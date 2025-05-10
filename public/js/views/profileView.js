/* Вигляд для відображення профілю користувача */
import { UserController } from '../controllers/userController.js';

export class ProfileView 
{
  /* Ініціалізація вигляду */
  constructor() 
  {
    this.container = document.querySelector('.container.mt-3 .row .col-12.col-md-8 .p-3');
    this.avatarContainer = document.querySelector('.container.mt-3 .row .col-12.col-md-4 img');
  }

  /* Відображення профілю */
  renderProfile(user) 
  {
    if (!user) 
    {
      this.container.innerHTML = '<p>Будь ласка, увійдіть, щоб переглянути профіль.</p>';
      return;
    }

    this.avatarContainer.src = user.avatarUrl;

    this.container.innerHTML = `
      <h5 class="mb-3">Ваш профіль</h5>
      <table class="table table-sm">
        <tbody>
          <tr>
            <th scope="row">Прізвище</th>
            <td>${user.surname || ''}</td>
          </tr>
          <tr>
            <th scope="row">Ім'я</th>
            <td>${user.name || ''}</td>
          </tr>
          <tr>
            <th scope="row">По Батькові</th>
            <td>${user.patronymic || ''}</td>
          </tr>
          <tr>
            <th scope="row">Email</th>
            <td>${user.email}</td>
          </tr>
          <tr>
            <th scope="row">Стать</th>
            <td>${user.gender}</td>
          </tr>
          <tr>
            <th scope="row">Дата народження</th>
            <td>${user.dateOfBirth}</td>
          </tr>
        </tbody>
      </table>
      <button class="btn btn-primary" id="editProfileBtn" data-bs-toggle="modal" data-bs-target="#editProfileModal"><i class="bi bi-pencil"></i> Редагувати профіль</button>
    `;
  }

  /* Відображення форми редагування профілю */
  renderEditForm(user) 
  {
    const modal = document.createElement('div');
    modal.innerHTML = `
      <div class="modal fade" id="editProfileModal" tabindex="-1" aria-labelledby="editProfileModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editProfileModalLabel">Редагувати профіль</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form id="editProfileForm">
                <div class="mb-3">
                  <label for="editSurname" class="form-label">Прізвище</label>
                  <input type="text" class="form-control" id="editSurname" value="${user.surname || ''}">
                </div>
                <div class="mb-3">
                  <label for="editName" class="form-label">Ім'я</label>
                  <input type="text" class="form-control" id="editName" value="${user.name || ''}">
                </div>
                <div class="mb-3">
                  <label for="editPatronymic" class="form-label">По Батькові</label>
                  <input type="text" class="form-control" id="editPatronymic" value="${user.patronymic || ''}">
                </div>
                <div class="mb-3">
                  <label for="editAvatar" class="form-label">Зображення профілю (URL)</label>
                  <input type="text" class="form-control" id="editAvatar" value="${user.avatarUrl}">
                </div>
                <button type="submit" class="btn btn-primary">Зберегти</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
}