// Add event listener to dropdown toggle
document.addEventListener("DOMContentLoaded", function() {
  const dropdownToggle = document.querySelector(".dropdown-toggle");

  dropdownToggle.addEventListener("click", function(event) {
    event.preventDefault();
    const dropdownMenu = document.querySelector(".dropdown-menu");
    dropdownMenu.classList.toggle("show");
  });
});

// Get elements
const topNav = document.querySelector('.top-nav');
const sideNav = document.querySelector('.side-nav');
const docsNav = document.querySelector('.docs-nav');
const mainContent = document.querySelector('.main-content'); 
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');
const subNavTriggers = document.querySelectorAll('.dropdown');
const subNavs = document.querySelectorAll('.sub-nav');
const modals = document.querySelectorAll('.modal');
const accordionTriggers = document.querySelectorAll('.accordion');
const alertCloseButtons = document.querySelectorAll('.alert .close-button');
const asideToggle = document.querySelector('.aside-toggle'); 

// Add event listeners
navLinks.forEach(link => link.addEventListener('click', handleNavLinkClick));
subNavTriggers.forEach(trigger => trigger.addEventListener('mouseover', handleSubNavTrigger));
subNavTriggers.forEach(trigger => trigger.addEventListener('mouseout', handleSubNavTrigger)); 
accordionTriggers.forEach(trigger => trigger.addEventListener('click', handleAccordionTrigger));
alertCloseButtons.forEach(button => button.addEventListener('click', handleAlertClose));

function clearSections() {
  document.querySelectorAll('section').forEach((section) => {
    section.innerHTML = '';
    section.classList.remove('active');
    section.classList.remove('hidden');
    section.classList.add('hidden');
  });
}

function addSectionId(cssCode, sectionId) {

    const selectors = cssCode.match(/([^{]+)\s*\{/g);
    if (selectors) {
        selectors.forEach(selector => {

            var mat = selector.split('}');
            var m1  = selector.indexOf("}") == -1 ? '' : selector.substring(0 , selector.lastIndexOf('}'));
            var m2 = selector.indexOf("}") == -1 ? '' : selector.slice(selector.lastIndexOf('}') + 1);

           if(!(m1 == '' && m2 ==  '')){
             mat = [m1 , m2];
           }
      
            var a = (mat.length == 2) ? mat[0] : '';
            var b = (mat.length == 2) ? mat[1] : mat[0];

            if(mat.length == 2){ a += '\n }'; }
      
            var c = b.split('\n');
            var d = '';

            c.forEach((s)=>
              {
                  if(s.length == 0){
                    d += '\n';
                  }
                  else if(s.indexOf('body') == -1 && s.indexOf('/*') == -1) 
                  {
                    var e = s.split(',');
                    
                    e.forEach((s2 , k2)=>
                    { 
                       if(s2.indexOf('@media') == -1){
                          d += `#${sectionId} ` + s2; 
                       }
                      else {
                        d += s2;
                      }

                       if (e.length > 1 && k2 != e.length - 1) {
                          d += ',';
                       }
                    })
                  }
                  else{
                    d += s;
                  }
              });

            const newSelector = (a + d).replace('body', `#${sectionId}`);
            cssCode = cssCode.replace(selector, newSelector);
        });
    }
  
    return cssCode;
}
function addSectionIdToJs(jsCode, sectionId) {
  // Use regular expressions to find and modify query selectors
  return   jsCode.replace(/(document\.querySelector|document\.querySelectorAll|jQuery|[$])\s*\(\s*["'](#|\.|)([a-zA-Z0-9_-]+)["']\s*\)/g, (match, p1, p2, p3) => {
    return `${p1}('#${sectionId} ${p2}${p3}')`;
  });
}


function loadPage(pageUrl) { 
  clearSections();

  fetch('pages/' + pageUrl)
  .then(response => {
    if (response.ok) {
      return response.text();
    } else {
      throw new Error(`Error: ${response.status}`);
    }
  })
.then((html) => {   
    // Select all section elements
       const sections = document.querySelectorAll('section'); 
    // Loop through each section
       window["dscript"] = window["dscript"] || [];

       window["dscript"].forEach((s)=>
       {
          s.remove();
       });
  
       sections.forEach(section => 
       {
            // Select all style and script elements within the section
               const stylesAndScripts = section.querySelectorAll('style, script');
      
            // Remove each style and script element
               stylesAndScripts.forEach(element => element.remove());
        });
  
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const links = doc.querySelectorAll('link');
    const styles = doc.querySelectorAll('style');
    const scripts = doc.querySelectorAll('script');
    const pageContent = doc.body.innerHTML
        .replace(/<script>.*?<\/script>/g, '') // Remove script tags
        .replace(/<style>.*?<\/style>/g, '') // Remove style tags
        .replace(/<link.*?rel="stylesheet".*?>/g, ''); // Remove CSS links

    // Load page-specific CSS, HTML, and JS
    const pageName = pageUrl.replace('.html', '');
    const sectionId = `${pageName}`;
    const section = document.getElementById(sectionId);

    // Add CSS
    styles.forEach(style =>{
       const htm = style.innerHTML; 
       if(htm){
         let css = htm; 

         const modifiedCss = addSectionId(css.trim(), sectionId);

         const newStyle = document.createElement('style');
         newStyle.textContent = modifiedCss;
         section.appendChild(newStyle);
       }
    });
    links.forEach(link => {
      if (link.getAttribute('rel') === 'stylesheet' && link.getAttribute('href').endsWith('.css')) {
        const href = link.getAttribute('href').replace('../', '');
        if(href){
          fetch(href)
          .then(response => {
            if (response.ok) {
              return response.text();
            } else {
              throw new Error(`Error: ${response.status}`);
            }
          })
          .then(htm =>
          {
              let css = htm; 
    
              const modifiedCss = addSectionId(css.trim(), sectionId);

              const newStyle = document.createElement('style');
              newStyle.textContent = modifiedCss;
              section.appendChild(newStyle);
          })
          .catch(error => console.error(`Error loading CSS: ${error}`));
          
        }
      }
    });

    // Add HTML
    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = pageContent;
  
    const stylesAndScripts2 = contentDiv.querySelectorAll('style, script'); 
    stylesAndScripts2.forEach(element => element.remove());
    
     section.appendChild(contentDiv);

    // Add JS
    scripts.forEach(script => {
      let src = script.getAttribute('src');
      const htm = script.innerHTML;
      
      if(htm){
        const jsCode = htm;
        const modifiedJsCode = addSectionIdToJs(jsCode, sectionId); 
        const modifiedScript = document.createElement('script');
        modifiedScript.textContent = modifiedJsCode;
        section.appendChild(modifiedScript);
        window["dscript"].push(modifiedScript);
      }
      else if(src)
      { 
          src = src.replace('../', ''); 

          fetch(src)
          .then(response => {
            if (response.ok) {
              return response.text();
            } else {
              throw new Error(`Error: ${response.status}`);
            }
          })
          .then(jsCode => { 
              const modifiedJsCode = addSectionIdToJs(jsCode, sectionId);  
              const modifiedScript = document.createElement('script');
              modifiedScript.textContent = modifiedJsCode;
              section.appendChild(modifiedScript);
              window["dscript"].push(modifiedScript);
            })
          .catch(error => console.error(`Error loading JS: ${error}`));
          }
      
    });
   // Display Current Section
      section.classList.remove('hidden');
      section.classList.add('active');
   //
  })
.catch((error) => console.error(error));
}

// Function to get the query parameter value
function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}
// Load the page dynamically based on the query parameter
const page = getQueryParameter('page');
if (page) {
    loadPage(page + '.html');
} else {
    // Load the default page if no query parameter is provided
    loadPage('home');
}

function handleNavLinkClick(event) {
  event.preventDefault();

  let target = event.target;
  
  // If the target is an <i> element, get its parent
  if (target.tagName === 'I') {
    target = target.parentNode;
  }
  
  const targetSection = target.getAttribute('href').substring(1); 
  window.location.href = '?page=' + targetSection ;
}

function handleSubNavTrigger(event) {
const subNav = event.target.querySelector('.sub-nav');
if (event.type === 'mouseover' && subNav) {
subNav.style.display = 'block';
} else if(subNav) {
subNav.style.display = 'none';
}
}

function handleAccordionTrigger(event) {
const accordionContent = event.target.nextElementSibling;
accordionContent.classList.toggle('show');
}

function handleAlertClose() {
const alert = event.target.parentElement;
alert.remove();
}

function init() {
// Initialize modals
modals.forEach(modal => {
const closeButton = modal.querySelector('.close-button');
closeButton.addEventListener('click', () => modal.style.display = 'none');
});

// Initialize tooltips
const tooltips = document.querySelectorAll('.tooltip');
tooltips.forEach(tooltip => {
const trigger = tooltip.querySelector('.tooltip-trigger');
trigger.addEventListener('mouseover', () => tooltip.classList.add('show'));
trigger.addEventListener('mouseout', () => tooltip.classList.remove('show'));
});
}

// Initialize
init();

// Add event listener for window resize
window.addEventListener('resize', () => {
  
  if (window.innerWidth > 768) {
   
  } 
});

asideToggle.addEventListener('click', () => { 
   if(sideNav.classList.contains('mob-nav')){
      sideNav.classList.remove('mob-nav');
   }
   else{
      sideNav.classList.add('mob-nav');
   }
});

document.addEventListener('click', (event) => { 
  if (!docsNav.contains(event.target) && sideNav.contains(event.target)) { 
    sideNav.classList.remove('mob-nav');
  }
});

// Check if mobile device
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

