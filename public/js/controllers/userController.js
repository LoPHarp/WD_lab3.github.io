const axios = window.axios;

import { User } from '../models/user.js';

/* Контролер для управління користувачами */
export class UserController 
{
  /* Вхід користувача */
  static async login(email, password) 
  {
    try 
    {
      const response = await axios.post('/api/login', { email, password });
      localStorage.setItem('currentUserId', response.data.id);
      return true;
    } 
    catch (error) 
    {
      console.error('Login error:', error);
      return false;
    }
  }

  /* Реєстрація нового користувача */
  static async register(email, password, gender, dateOfBirth) 
  {
    try 
    {
      const response = await axios.post('/api/register', { email, password, gender, dateOfBirth });
      return response.status === 200;
    } 
    catch (error) 
    {
      console.error('Register error:', error);
      return false;
    }
  }

  /* Отримання поточного користувача */
  static async getCurrentUser() 
  {
    const userId = localStorage.getItem('currentUserId');
    return userId ? await User.findById(userId) : null;
  }
}