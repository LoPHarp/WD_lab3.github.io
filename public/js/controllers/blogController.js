/* Контролер для управління блогом */
import { Post } from '../models/post.js';
import { BlogView } from '../views/blogView.js';
import { UserController } from '../controllers/userController.js';

export class BlogController 
{
  /* Ініціалізація контролера */
  constructor() 
  {
    this.view = new BlogView();
    this.postsPerPage = 2;
    this.currentPage = 1;
  }

  /* Ініціалізація блогу та перевірка авторизації */
  async init() 
  {
    const currentUser = await UserController.getCurrentUser();
    if (!currentUser) 
    {
      window.location.href = 'login.html';
      return;
    }

    await this.render();

    /* Обробка додавання нового посту */
    document.getElementById('addPostForm').addEventListener('submit', async (event) => 
    {
      event.preventDefault();
      console.log('Form submitted, attempting to add post');
      const content = document.getElementById('postContent').value;
      const currentUser = await UserController.getCurrentUser();
      if (!currentUser) 
      {
        alert('Будь ласка, увійдіть, щоб додати пост');
        return;
      }
      console.log('Current user:', currentUser.id);
      const newPost = new Post(null, currentUser.id, content, new Date().toLocaleDateString());
      try 
      {
        await newPost.save();
        console.log('Post saved successfully');
        this.currentPage = 1;
        await this.render();
        document.getElementById('addPostForm').reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById('addBlogModal'));
        modal.hide();
      } 
      catch (error) 
      {
        console.error('Error saving post:', error);
        alert('Помилка при збереженні поста. Перевірте консоль для деталей.');
      }
    });

    /* Обробка кліків для видалення, редагування та пагінації */
    document.addEventListener('click', async (event) => 
    {
      if (event.target.matches('[data-action="delete"]')) 
      {
        const postId = event.target.dataset.id;
        const post = await Post.findById(postId);
        if (post) 
        {
          await post.delete();
          await this.render();
        }
      } 
      else if (event.target.matches('[data-action="edit"]')) 
      {
        const postId = event.target.dataset.id;
        const post = await Post.findById(postId);
        if (post) 
        {
          document.getElementById('editPostId').value = post.id;
          document.getElementById('editPostContent').value = post.content;
        }
      } 
      else if (event.target.matches('.page-link')) 
      {
        event.preventDefault();
        const page = parseInt(event.target.dataset.page);
        if (page && !isNaN(page)) 
        {
          this.currentPage = page;
          await this.render();
        }
      }
    });

    /* Обробка редагування посту */
    document.getElementById('editPostForm').addEventListener('submit', async (event) => 
    {
      event.preventDefault();
      const postId = document.getElementById('editPostId').value;
      const newContent = document.getElementById('editPostContent').value;
      const post = await Post.findById(postId);
      if (post) 
      {
        post.content = newContent;
        await post.save();
        await this.render();
        const modal = bootstrap.Modal.getInstance(document.getElementById('editPostModal'));
        modal.hide();
      }
    });

    /* Обробка додавання коментарів */
    document.addEventListener('submit', async (event) => 
    {
      if (event.target.matches('.add-comment-form')) 
      {
        event.preventDefault();
        const postId = event.target.dataset.postId;
        const content = event.target.querySelector(`#commentContent${postId}`).value;
        const currentUser = await UserController.getCurrentUser();
        if (!currentUser) 
        {
          alert('Будь ласка, увійдіть, щоб додати коментар');
          return;
        }
        const post = await Post.findById(postId);
        if (post) 
        {
          await post.addComment(currentUser.id, content, new Date().toLocaleDateString());
          await this.render();
        }
      }
    });
  }

  /* Відображення постів */
  async render() 
  {
    const posts = await Post.getAll();
    this.view.renderPosts(posts, this.currentPage, this.postsPerPage);
  }
}