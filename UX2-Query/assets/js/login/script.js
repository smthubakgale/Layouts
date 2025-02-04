var home = {
  myFunction: () => {
    console.log("Welcome to Home!");
  },
  
  init: () => {
    const form = document.getElementById('login-form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
    
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
    
        // Here you can add your authentication logic
        console.log(`Username: ${username}, Password: ${password}`);
    
        // For demonstration purposes, let's assume the credentials are correct
        alert('Login successful!');
    });
  }
};

// Initialize the page
home.init();
