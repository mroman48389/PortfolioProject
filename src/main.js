/**************************************   Scroll anchors   *****************************************/

/* Mimic the behavor of clicking on the "About me" anchor. This will get attached to a button. FEATURE REMOVED. */
// document.querySelector("#scroll-down").addEventListener("click", () => {
//     const rootStyles = getComputedStyle(document.documentElement);
//     const navBarHeight = parseFloat(rootStyles.getPropertyValue('--nav-bar-height-unscrolled'));

//     window.scrollTo({
//         top: document.querySelector("#about-me").offsetTop - navBarHeight,
//     });
// });

/*****************************    Light/dark mode   *********************************************/

/* If the user clicks the element with id toggle-theme, add the light-theme class to html elements. 

   Note that document.documentElement is equivalent to document.querySelector("html"), so we
   are adding light-theme to the html element and can then use html.light-theme in the CSS to
   change the colors in light mode. Since :root also refers to the html element, we can do
   :root.light-theme to change the color variables we defined. */

function initDarkMode() {
  const darkLightModeTooltip = document.querySelector("#toggle-theme-tooltip");

  if (darkLightModeTooltip) {
    document.querySelector("#toggle-theme").addEventListener("click", () => {
        document.documentElement.classList.toggle("light-theme");

        const isLightTheme = document.documentElement.classList.contains("light-theme");
        darkLightModeTooltip.textContent = isLightTheme ? "Switch to dark mode" : "Switch to light mode";
    });

    /* Also add light-theme to the html element if the user prefers it. */
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;

    if (prefersLight) {
        document.documentElement.classList.add("light-theme");
        darkLightModeTooltip.textContent = "Switch to dark mode";
    }
    else {
        darkLightModeTooltip.textContent = "Switch to light mode";
    }
  }
}

/*********************************   Nav bar bottom border shadow   ***************************/

/* Add or remove "scrolled" class to the <nav> element depending on if the user has scrolled so 
   we can style it differently for each case. */
function initNavScroll() {
  window.addEventListener("scroll", () => {
      const nav = document.querySelector("nav");
      
      if (window.scrollY > 0) {
        nav.classList.add("scrolled");
      } 
      else {
        nav.classList.remove("scrolled");
      }
  });
}

/****************************  About me subsection fade in/outs  *********************************/

function initAboutMeSubsections() {
  /* Grab all elements assigned the class "about-me-subsection" in the order they appear in the DOM. */
  const aboutMeSubsections = document.querySelectorAll('.about-me-subsection');

  /* For each subsection (element [el]) we grabbed, add one of two classes to it depending on if we 
    want it to slide in from the left side of the screen or the right side. The first should slide in
    from the left and they should alternate. This avoids needing to assign this classes manually in the
    HTML. */
  aboutMeSubsections.forEach((el, i) => {
      el.classList.add(i % 2 === 0 ? 'slide-in-from-left' : 'slide-in-from-right');
  });

  function animateOnScroll(elements, threshold = 0.2) {
    /* Create a new instance of IntersectionObserver. The IntersectionObserver API efficiently 
      detects when elements enter or exit the viewport (more efficiently than scroll event listeners). 
      In this case, the elements will be the subsections of our About me section.
      
      The callback function IntersectionObserver takes will run whenever an observed element (subsection) 
      is in the viewport. The callback receives an array ("entries"). Each item in the array represents an 
      observed element and its interaction status. 

      The options object IntersectionObserver takes contains a threshold telling it at what percent 
      visibility of the element IntersectionObserver should trigger the callback.  So, at 0.2, the callback triggers 
      as soon as 20% of the subsection is in the viewport. 0 would trigger it if even one pixel in the subsection was 
      in the viewport. 1 would only trigger it if all (100%) of the subsection was in the viewport.
    */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            /* If any part of the subsection is in the viewport, (subject to the threshold set), ... */
            if (entry.isIntersecting) {
                /* Add "visible" to the subsection so that the CSS animation will be triggered. */
                entry.target.classList.add('visible');
                /* Stop observing the subsection if it becomes visible so that the animation runs only
                  once (even if the user scrolls away and back). */
                observer.unobserve(entry.target);
            }
        });
    }, {
      threshold: 0.5
    });

    /* Start observing each subsection so the animation triggers when it enters the viewport. */
    aboutMeSubsections.forEach(el => observer.observe(el));
  }

  animateOnScroll(aboutMeSubsections);
}

/* Add event listener to "Show email" button to hide my email from bots. My email will only be available if the user clicks on it. */
function initEmailRevealButton() {
  const showEmailBtn = document.getElementById('show-email-grid');
  const emailAddressContainer = document.getElementById('email-container-grid');

  /* If reveal button and email container exist (guards against runtime errors), add an event listener to the button that will swap
     it out for a link with the my email. */
  if (showEmailBtn && emailAddressContainer) {
    showEmailBtn.addEventListener('click', () => {
      /* Programmatically construct my email and create an anchor element to attach it to. */
      const user1 = 'mroman';
      const user2 = '8465';
      const domain = 'gmail.com';
      const email = `${user1}${user2}@${domain}`;
      const link = document.createElement('a');
      link.href = `mailto:${email}`;
      link.textContent = email;
      link.target = '_blank';

      /* Place the newly created link to my email inside the email container. */
      emailAddressContainer.innerHTML = '';
      emailAddressContainer.appendChild(link);

      /* Hide the reveal button and show the email container by adding and removing the hidden class, respectively. */
      showEmailBtn.classList.add('hidden');
      emailAddressContainer.classList.remove('hidden');
      /* Add animation class here rather than in HTML to guarantee the animation plays after the element becomes visible (which we have
         done by removing .hidden). */
      emailAddressContainer.classList.add('email-fade-in'); 

      console.log('Button clicked');
      console.log(showEmailBtn.classList); // Should include "hidden"
    });
  }
}

function initContactFormValidation() {
  const contactForm = document.querySelector("form");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      const name = document.getElementById("contact-me-name");
      const email = document.getElementById("contact-me-email");
      const message = document.getElementById("contact-me-message");

      if (name && email && message) {
        e.preventDefault(); // Prevent default submission
    
        let isValid = true;
      
        /* Clear previous errors by setting the text back to blank and removing the error message styling class from the error message container divs. */
        document.querySelectorAll(".error-message-container").forEach(container => {
          container.textContent = "";
          container.classList.remove("error-message");
        });
      
        /* Shows the error message on the screen. */
        function showError(input, message) {
          /* We put a div under each <input> and <textarea> to hold the error message, so we should be able to use 
            nextElementSibling to grab it. Then we can change the text and apply the class to style the message. */
          const errorMessageContainer = input.nextElementSibling;
          errorMessageContainer.textContent = message;
          errorMessageContainer.classList.add("error-message");
    
          /* Screen readers, etc. will tell the user that validation failed when tabbing into the field. */
          input.setAttribute("aria-invalid", "true");
    
          /* Screen readers, etc. will read the error message when the field is focused on. */
          input.setAttribute("aria-describedby", errorMessageContainer.id || "error-" + input.id);
        }
    
        /* Validate name */
        if (name.value.trim().length < 2) {
          showError(name, "Name must be at least 2 characters.");
          isValid = false;
        }
        else if (name.value.trim().length > 50) {
          showError(name, "Name must be less than 50 characters.");
          isValid = false;
        }
      
        /* Validate email. Regex check breakdown from left to right: 
          
            "^"     : Start of string.
            "[^@]+" : Find at least one character before the "@" (local portion of email).
            "@"     : Looks for the "@"".
            "[^@]+" : Find at least one character after the "@" but before the "." (domain portion of email, like "google").
            "\."    : Look for the ".".
            "[^@]+" : Find at least one character after the "." (top-level domain portion of email, like "com").
            "$"     : End of string.
        */
        if ((email.value.length < 5 || email.value.length > 254 || !/^[^@]+@[^@]+\.[^@]+$/.test(email.value))) {
          showError(email, "Please enter a valid email.");
          isValid = false;
        }
      
        /* Validate message */
        if (message.value.trim().length < 10) {
          showError(message, "Message must be at least 10 characters.");
          isValid = false;
        }
        else if (message.value.trim().length > 1000) {
          showError(message, "Message must be less than 1000 characters.");
          isValid = false;
        }
      
        if (isValid) {
          contactForm.submit();
        }
      }
    });
  }
}

/* DOMContentLoaded is an event that fires when the initial HTML document has been completely parsed and the DOM is fully
   constructed. This prevents race conditions between scripts and the DOM, null references when accessing elements that haven't loaded,
   and inconsistent behavior across browsers. */
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initNavScroll();
  initAboutMeSubsections();
  initEmailRevealButton();
  initContactFormValidation();
});