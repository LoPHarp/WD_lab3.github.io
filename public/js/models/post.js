const axios = window.axios;

/* Модель для роботи з постами */
export class Post 
{
  /* Ініціалізація посту */
  constructor(id, authorId, content, date, comments = []) 
  {
    this.id = id;
    this.authorId = authorId;
    this.content = content;
    this.date = date;
    this.comments = comments;
  }

  /* Отримання всіх постів */
  static async getAll() 
  {
    try 
    {
      const response = await axios.get('/api/posts');
      const postsData = response.data;
      const postsWithComments = await Promise.all(postsData.map(async (postData) => 
      {
        const commentsResponse = await axios.get(`/api/posts/${postData.id}/comments`);
        const comments = commentsResponse.data;
        return new Post(postData.id, postData.authorId, postData.content, postData.date, comments);
      }));
      return postsWithComments;
    } 
    catch (error) 
    {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  /* Пошук посту за ідентифікатором */
  static async findById(id) 
  {
    try 
    {
      const response = await axios.get(`/api/posts/${id}`);
      const data = response.data;
      return new Post(data.id, data.authorId, data.content, data.date, data.comments);
    } 
    catch (error) 
    {
      console.error('Error fetching post:', error);
      return null;
    }
  }

  /* Збереження посту */
  async save() 
  {
    try 
    {
      if (this.id) 
      {
        await axios.put(`/api/posts/${this.id}`, { content: this.content });
      } 
      else 
      {
        const response = await axios.post('/api/posts', 
        {
          authorId: this.authorId,
          content: this.content,
          date: this.date
        });
        this.id = response.data.id;
      }
    } 
    catch (error) 
    {
      console.error('Error saving post:', error);
      throw error;
    }
  }

  /* Видалення посту */
  async delete() 
  {
    try 
    {
      await axios.delete(`/api/posts/${this.id}`);
    } 
    catch (error) 
    {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  /* Додавання коментаря до посту */
  async addComment(authorId, content, date) 
  {
    try 
    {
      await axios.post('/api/comments', 
      {
        postId: this.id,
        authorId,
        content,
        date
      });
    } 
    catch (error) 
    {
      console.error('Error adding comment:', error);
      throw error;
    }
  }
}