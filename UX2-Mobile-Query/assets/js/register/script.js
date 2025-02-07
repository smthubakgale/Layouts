var register = { 
  init: () => {
    const form = document.getElementById('register-form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
    
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
    
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
    
        // Here you can add your registration logic
        console.log(`Username: ${username}, Email: ${email}, Password: ${password}`);
    
        // For demonstration purposes, let's assume the registration is successful
        alert('Registration successful!');
    });
  }
};

// Initialize the page
register.init();

