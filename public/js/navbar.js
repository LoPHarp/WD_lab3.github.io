/* Ініціалізація навігаційного меню та футера */
document.addEventListener("DOMContentLoaded", function () 
{
  /* Додавання навігаційного меню */
  document.getElementById("navbar-container").innerHTML = `
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
          <div class="container-fluid">
              <a href="index.html" class="navbar-brand">BLOG</a>
              <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                  <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarCollapse">
                  <div class="navbar-nav">
                      <a href="index.html" class="nav-item nav-link">Home</a>
                      <a href="blog.html" class="nav-item nav-link">Blog</a>
                  </div>
                  <div class="navbar-nav ms-auto">
                      <a href="profile.html" class="nav-item nav-link">Profile</a>
                      <a href="login.html" class="nav-item nav-link">Login</a>
                      <a href="register.html" class="nav-item nav-link">Register</a>
                  </div>
              </div>
          </div>
      </nav>
  `;

  /* Додавання футера */
  document.getElementById("footer-container").innerHTML = `
      <footer class="footer bg-dark text-white text-center py-3">
          <div class="container">
              <p>© 2025 Blog. All rights reserved.</p>
              <p>Contact us: <a href="mailto:dmanuylov11@gmail.com" class="text-white">dmanuylov11@gmail.com</a></p>
          </div>
      </footer>
  `;

  /* Активація поточної сторінки в меню */
  const currentPage = window.location.pathname;
  let activeLink = currentPage === '/' ? 'index.html' : currentPage.split("/").pop();
  const navLinks = document.querySelectorAll(".navbar-nav a");

  navLinks.forEach(link => 
  {
    if (link.getAttribute("href") === activeLink) 
    {
      link.classList.add("active");
    } 
    else 
    {
      link.classList.remove("active");
    }
  });
});