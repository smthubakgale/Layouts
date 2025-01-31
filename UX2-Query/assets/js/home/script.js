var home = {
  myFunction: () => {
    console.log("Welcome to Home!");
  },
  
  init: () => {
    document.querySelector("h1").addEventListener("click", home.myFunction);
  }
};

// Initialize the page
home.init();
