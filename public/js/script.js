
  /*  document.addEventListener('DOMContentLoaded', () => {
      const form = document.getElementById('loginForm');
      const container = document.querySelector('.container');
      const dashboard = document.getElementById('dashboard');
      const logoutBtn = document.getElementById('logoutBtn');
      const menuBtn = document.querySelector('.menu-btn');
      const dropdownMenu = document.querySelector('.dropdown-menu');

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const validEmail = "user@example.com";
        const validPassword = "123456";

        if (email === validEmail && password === validPassword) {
          container.style.display = 'none'; // hide login form
          dashboard.style.display = 'block'; // show dashboard
        } else {
          alert("❌ Invalid email or password.");
        }
      });

      logoutBtn.addEventListener('click', () => {
        dashboard.style.display = 'none'; // hide dashboard
        container.style.display = 'flex'; // show login form
        form.reset();
        dropdownMenu.style.display = 'none'; // close menu
      });

      // Toggle dropdown
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
      });

      // Close dropdown when clicking outside
      window.addEventListener('click', (e) => {
        if (!document.querySelector('.menu-container').contains(e.target)) {
          dropdownMenu.style.display = 'none';
        }
      });
    });
