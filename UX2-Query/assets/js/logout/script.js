var logout = { 
  init: () => {
   // Get the login again button
    const loginAgainButton = document.getElementById('login-again-btn');
    
    // Add event listener to the login again button
    loginAgainButton.addEventListener('click', () => {
        // Redirect to the login page
        window.location.href = 'login.html';
    });    
  }
};

// Initialize the page
logout.init();

    
