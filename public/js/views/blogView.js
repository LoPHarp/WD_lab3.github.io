/* Вигляд для відображення блогів */
import { Post } from '../models/post.js';
import { User } from '../models/user.js';

export class BlogView 
{
  /* Ініціалізація вигляду */
  constructor() 
  {
    this.container = document.querySelector('#posts-container');
    this.paginationTop = document.querySelector('#pagination-top .pagination');
    this.paginationBottom = document.querySelector('#pagination-bottom .pagination');
  }

  /* Відображення постів */
  async renderPosts(posts, currentPage = 1, postsPerPage = 2) 
  {
    this.container.innerHTML = '';

    const totalPosts = posts.length;
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const currentPosts = posts.slice(startIndex, endIndex);

    /* Завантаження даних авторів для постів і коментарів */
    const postsWithAuthors = await Promise.all(currentPosts.map(async (post) => 
    {
      const author = await User.findById(post.authorId);
      /* Завантаження авторів коментарів */
      const commentsWithAuthors = await Promise.all(post.comments.map(async (comment) => 
      {
        const commentAuthor = await User.findById(comment.authorId);
        return { comment, commentAuthor };
      }));
      return { post, author, commentsWithAuthors };
    }));

    /* Формування HTML для кожного посту */
    postsWithAuthors.forEach(({ post, author, commentsWithAuthors }) => 
    {
      const authorName = author ? `${author.surname || ''} ${author.name || ''}`.trim() || 'Невідомий' : 'Невідомий';
      const postElement = document.createElement('div');
      postElement.className = 'card mb-4 shadow-sm';
      postElement.innerHTML = `
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start">
            <div class="flex-shrink-0">
              <img src="${author ? author.avatarUrl || 'img/avatar.png' : 'img/avatar.png'}" class="rounded-circle" width="80" height="80" alt="User Avatar">
            </div>
            <div class="flex-grow-1 ms-3">
              <h5 class="card-title">${authorName} <small class="text-muted"><i>Опубліковано ${post.date}</i></small></h5>
              <p class="card-text">${post.content}</p>
              <button class="btn btn-link p-0" data-bs-toggle="collapse" data-bs-target="#comments${post.id}">Переглянути коментарі</button>
              <div class="collapse mt-3" id="comments${post.id}">
                ${commentsWithAuthors.map(({ comment, commentAuthor }) => 
                {
                  const commentAuthorName = commentAuthor ? `${commentAuthor.surname || ''} ${commentAuthor.name || ''}`.trim() || 'Невідомий' : 'Невідомий';
                  return `
                    <div class="d-flex mb-2">
                      <div class="flex-shrink-0">
                        <img src="${commentAuthor ? commentAuthor.avatarUrl || 'img/avatar.png' : 'img/avatar.png'}" class="rounded-circle" width="60" height="60" alt="User Avatar">
                      </div>
                      <div class="flex-grow-1 ms-3">
                        <h5 class="card-text">${commentAuthorName} <small class="text-muted"><i>Опубліковано ${comment.date}</i></small></h5>
                        <p class="card-text">${comment.content}</p>
                      </div>
                    </div>
                  `;
                }).join('')}
                <form class="add-comment-form mt-3" data-post-id="${post.id}">
                  <div class="mb-2">
                    <label for="commentContent${post.id}" class="form-label">Додати коментар</label>
                    <textarea class="form-control" id="commentContent${post.id}" rows="2" required></textarea>
                  </div>
                  <button type="submit" class="btn btn-primary btn-sm">Додати коментар</button>
                </form>
              </div>
            </div>
            <div class="dropdown">
              <button class="btn btn-link p-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-list fs-4"></i>
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" href="#" data-action="delete" data-id="${post.id}">Видалити</a></li>
                <li><a class="dropdown-item" href="#" data-action="edit" data-id="${post.id}" data-bs-toggle="modal" data-bs-target="#editPostModal">Редагувати</a></li>
              </ul>
            </div>
          </div>
        </div>
      `;
      this.container.appendChild(postElement);
    });

    /* Відображення пагінації */
    this.renderPagination(totalPages, currentPage);
  }

  /* Відображення пагінації */
  renderPagination(totalPages, currentPage) 
  {
    let paginationHtml = `
      <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
        <a href="#" class="page-link" data-page="${currentPage - 1}">Previous</a>
      </li>
    `;
    
    /* Завжди буде хоча б одна сторінка, навіть якщо постів немає */
    const pagesToShow = totalPages < 1 ? 1 : totalPages;
    for (let i = 1; i <= pagesToShow; i++) 
    {
      paginationHtml += `
        <li class="page-item ${i === currentPage ? 'active' : ''}">
          <a href="#" class="page-link" data-page="${i}">${i}</a>
        </li>
      `;
    }
    
    paginationHtml += `
      <li class="page-item ${currentPage === pagesToShow ? 'disabled' : ''}">
        <a href="#" class="page-link" data-page="${currentPage + 1}">Next</a>
      </li>
    `;

    this.paginationTop.innerHTML = paginationHtml;
    this.paginationBottom.innerHTML = paginationHtml;
  }
}