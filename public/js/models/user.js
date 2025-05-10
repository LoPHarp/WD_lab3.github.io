const axios = window.axios;

/* Модель для роботи з користувачами */
export class User 
{
  /* Ініціалізація користувача */
  constructor(id, email, password, gender, dateOfBirth, surname = '', name = '', patronymic = '', avatarUrl = 'img/avatar.png') 
  {
    this.id = id;
    this.email = email;
    this.password = password;
    this.gender = gender;
    this.dateOfBirth = dateOfBirth;
    this.surname = surname;
    this.name = name;
    this.patronymic = patronymic;
    this.avatarUrl = avatarUrl;
  }

  /* Пошук користувача за ідентифікатором */
  static async findById(id) 
  {
    try 
    {
      const response = await axios.get(`/api/users/${id}`);
      const user = response.data;
      return new User(user.id, user.email, user.password, user.gender, user.dateOfBirth, user.surname, user.name, user.patronymic, user.avatarUrl);
    } 
    catch (error) 
    {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  /* Збереження даних користувача */
  async save() 
  {
    try 
    {
      await axios.put(`/api/users/${this.id}`, 
      {
        surname: this.surname,
        name: this.name,
        patronymic: this.patronymic,
        avatarUrl: this.avatarUrl
      });
    } 
    catch (error) 
    {
      console.error('Error saving user:', error);
      throw error;
    }
  }
}