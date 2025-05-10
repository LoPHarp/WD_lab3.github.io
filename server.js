const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const app = express()
const port = 3000

/* Налаштування middleware */
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

/* Підключення до бази даних SQLite */
const db = new sqlite3.Database('./blog.db', (err) => 
{
    if (err)
        console.error('Помилка підключення:', err.message)
    else
        console.log('Підключено до SQLite.')
})

/* Ініціалізація таблиць бази даних */
db.serialize(() => 
{
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            gender TEXT NOT NULL,
            dateOfBirth TEXT NOT NULL,
            surname TEXT,
            name TEXT,
            patronymic TEXT,
            avatarUrl TEXT
        )
    `)

    db.run(`
        CREATE TABLE IF NOT EXISTS posts (
            id TEXT PRIMARY KEY,
            authorId TEXT NOT NULL,
            content TEXT NOT NULL,
            date TEXT NOT NULL,
            FOREIGN KEY (authorId) REFERENCES users(id)
        )
    `)

    db.run(`
        CREATE TABLE IF NOT EXISTS comments (
            id TEXT PRIMARY KEY,
            postId TEXT NOT NULL,
            authorId TEXT NOT NULL,
            content TEXT NOT NULL,
            date TEXT NOT NULL,
            FOREIGN KEY (postId) REFERENCES posts(id),
            FOREIGN KEY (authorId) REFERENCES users(id)
        )
    `)
})

/* Функція для генерації унікального ідентифікатора */
const generateUniqueId = () => 
{
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/* API для реєстрації користувача */
app.post('/api/register', (req, res) => 
{
    const { email, password, gender, dateOfBirth } = req.body
    const id = generateUniqueId()

    db.get('SELECT email FROM users WHERE email = ?', [email], (err, row) => 
    {
        if (row)
            return res.status(400).json({ error: 'Email уже існує' })

        db.run(
            'INSERT INTO users (id, email, password, gender, dateOfBirth, surname, name, patronymic, avatarUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [id, email, password, gender, dateOfBirth, '', '', '', 'img/avatar.png'],
            (err) => 
            {
                if (err)
                    return res.status(500).json({ error: 'Помилка реєстрації' })

                res.json({ id })
            }
        )
    })
})

/* API для входу користувача */
app.post('/api/login', (req, res) => 
{
    const { email, password } = req.body
    db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, row) => 
    {
        if (err || !row)
            return res.status(401).json({ error: 'Невірні дані' })

        res.json({ id: row.id })
    })
})

/* API для отримання даних користувача */
app.get('/api/users/:id', (req, res) => 
{
    db.get('SELECT * FROM users WHERE id = ?', [req.params.id], (err, row) => 
    {
        if (err || !row)
            return res.status(404).json({ error: 'Користувача не знайдено' })

        res.json(row)
    })
})

/* API для оновлення даних користувача */
app.put('/api/users/:id', (req, res) => 
{
    const { surname, name, patronymic, avatarUrl } = req.body

    db.run(
        'UPDATE users SET surname = ?, name = ?, patronymic = ?, avatarUrl = ? WHERE id = ?',
        [surname, name, patronymic, avatarUrl, req.params.id],
        (err) => 
        {
            if (err)
                return res.status(500).json({ error: 'Помилка оновлення' })

            res.json({ success: true })
        }
    )
})

/* API для отримання всіх постів */
app.get('/api/posts', (req, res) => 
{
    db.all('SELECT * FROM posts ORDER BY date DESC', [], (err, rows) => 
    {
        if (err)
            return res.status(500).json({ error: 'Помилка отримання постів' })

        res.json(rows)
    })
})

/* API для отримання посту за ідентифікатором */
app.get('/api/posts/:id', (req, res) => 
{
    db.get('SELECT * FROM posts WHERE id = ?', [req.params.id], (err, row) => 
    {
        if (err || !row)
            return res.status(404).json({ error: 'Пост не знайдено' })

        db.all('SELECT * FROM comments WHERE postId = ?', [req.params.id], (err, comments) => 
        {
            if (err)
                return res.status(500).json({ error: 'Помилка отримання коментарів' })

            res.json({ ...row, comments })
        })
    })
})

/* API для створення нового посту */
app.post('/api/posts', (req, res) => 
{
    const { authorId, content, date } = req.body
    const id = generateUniqueId()

    db.run(
        'INSERT INTO posts (id, authorId, content, date) VALUES (?, ?, ?, ?)',
        [id, authorId, content, date],
        (err) => 
        {
            if (err)
                return res.status(500).json({ error: 'Помилка створення поста' })

            res.json({ id })
        }
    )
})

/* API для оновлення посту */
app.put('/api/posts/:id', (req, res) => 
{
    const { content } = req.body

    db.run('UPDATE posts SET content = ? WHERE id = ?', [content, req.params.id], (err) => 
    {
        if (err)
            return res.status(500).json({ error: 'Помилка оновлення поста' })

        res.json({ success: true })
    })
})

/* API для видалення посту */
app.delete('/api/posts/:id', (req, res) => 
{
    db.run('DELETE FROM posts WHERE id = ?', [req.params.id], (err) => 
    {
        if (err)
            return res.status(500).json({ error: 'Помилка видалення поста' })

        db.run('DELETE FROM comments WHERE postId = ?', [req.params.id], (err) => 
        {
            if (err)
                return res.status(500).json({ error: 'Помилка видалення коментарів' })

            res.json({ success: true })
        })
    })
})

/* API для отримання коментарів до посту */
app.get('/api/posts/:id/comments', (req, res) => 
{
    const postId = req.params.id

    db.all('SELECT * FROM comments WHERE postId = ?', [postId], (err, rows) => 
    {
        if (err)
            return res.status(500).json({ error: 'Помилка отримання коментарів' })

        res.json(rows)
    })
})

/* API для додавання коментаря */
app.post('/api/comments', (req, res) => 
{
    const { postId, authorId, content, date } = req.body
    const id = generateUniqueId()

    db.run(
        'INSERT INTO comments (id, postId, authorId, content, date) VALUES (?, ?, ?, ?, ?)',
        [id, postId, authorId, content, date],
        (err) => 
        {
            if (err)
                return res.status(500).json({ error: 'Помилка додавання коментаря' })

            res.json({ id })
        }
    )
})

/* Запуск сервера */
app.listen(port, () => 
{
    console.log(`Сервер запущено на http://localhost:${port}`)
})