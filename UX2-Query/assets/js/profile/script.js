// Get the edit profile button
const editProfileButton = document.getElementById('edit-profile-btn');

// Get the edit profile form
const editProfileForm = document.getElementById('edit-profile-form');

// Get the username, email, and phone display elements
const usernameDisplay = document.getElementById('username-display');
const emailDisplay = document.getElementById('email-display');
const phoneDisplay = document.getElementById('phone-display');

// Get the username, email, and phone input elements
const usernameInput = document.getElementById('username-input');
const emailInput = document.getElementById('email-input');
const phoneInput = document.getElementById('phone-input');

// Add event listener to the edit profile button
editProfileButton.addEventListener('click', () => {
    // Toggle the edit profile form
    editProfileForm.classList.toggle('hidden');

    // If the form is visible, populate the input fields with the current values
    if (!editProfileForm.classList.contains('hidden')) {
        usernameInput.value = usernameDisplay.textContent;
        emailInput.value = emailDisplay.textContent;
        phoneInput.value = phoneDisplay.textContent;
    }
});

// Add event listener to the edit profile form
editProfileForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get the new username, email, and phone values
    const new
