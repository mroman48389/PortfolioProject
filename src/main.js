/*****************************    Light/dark mode   *********************************************/

/* If the user clicks the element with id dark-light-mode, add the light-theme class to html elements. 

   Note that document.documentElement is equivalent to document.querySelector("html"), so we
   are adding light-theme to the html element and can then use html.light-theme in the CSS to
   change the colors in light mode. Since :root also refers to the html element, we can do
   :root.light-theme to change the color variables we defined. */

function initDarkMode() {

  const container = document.querySelector(".dark-light-mode-container");
  const toggleButton = document.querySelector("#dark-light-mode");
  const tooltip = document.querySelector("#dark-light-mode-tooltip");

  if (container && toggleButton && tooltip) {
    toggleButton.addEventListener("mouseenter", () => {
      container.classList.add("show-dark-light-mode-tooltip");
    });

    toggleButton.addEventListener("mouseleave", () => {
      container.classList.remove("show-dark-light-mode-tooltip");
    });

    toggleButton.addEventListener("click", (e) => {
      container.classList.remove("show-dark-light-mode-tooltip");
      /* Remove sticky focus. */
      toggleButton.blur(); 
        
      document.documentElement.classList.toggle("light-theme");

      const isLightTheme = document.documentElement.classList.contains("light-theme");
      tooltip.textContent = isLightTheme ? "Switch to dark mode" : "Switch to light mode";
    });

    /* Also add light-theme to the html element if the user prefers it. */
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;

    if (prefersLight) {
        document.documentElement.classList.add("light-theme");
        tooltip.textContent = "Switch to dark mode";
    }
    else {
        tooltip.textContent = "Switch to light mode";
    }
  }
}

/*********************************   Nav bar bottom border shadow   ***************************/

/* Add or remove "scrolled" class to the <nav> element depending on if the user has scrolled so 
   we can style it differently for each case. Also need to adjust where the main element starts and
   our scroll margin tops for when the user clicks on an anchor to go to a section. */
function initNavScroll() {
  function positionNavElementsUnscrolled() {
    const root = document.documentElement;
    const nav = document.querySelector("nav");
    const main = document.querySelector("main");

    if (nav && main) {

      const styles = getComputedStyle(root);
      const navHeight = parseFloat(styles.getPropertyValue("--nav-height").trim());
      const scrollGap = parseFloat(styles.getPropertyValue("--scroll-gap").trim());
      const darkLightModeHeight = parseFloat(styles.getPropertyValue("--dark-light-mode-height").trim());

      if (window.scrollY > 0) {
        nav.classList.add("nav-scrolled");
        main.classList.add("main-scrolled");

        const scrolledPadding = parseFloat(styles.getPropertyValue("--nav-scrolled-padding-block").trim());
        const navHeightTotal = navHeight + (scrolledPadding * 2);
        const scrollMargin = `${navHeightTotal + scrollGap}px`;
        root.style.setProperty("--scroll-margin-top", scrollMargin);

        const navVerticalCenter = navHeightTotal / 2;
        const darkLightModeVerticalCenter = navVerticalCenter - darkLightModeHeight / 2;
        root.style.setProperty("--dark-light-mode-top", `${darkLightModeVerticalCenter}px`);
      } 
      else {
        nav.classList.remove("nav-scrolled");
        main.classList.remove("main-scrolled");

        const unscrolledPadding = parseFloat(styles.getPropertyValue("--nav-unscrolled-padding-block").trim());
        const navHeightTotal = navHeight + (unscrolledPadding * 2);
        const scrollMargin = `${navHeightTotal + scrollGap}px`;
        root.style.setProperty("--dark-light-mode-top", scrollMargin);

        const navVerticalCenter = navHeightTotal / 2;
        const darkLightModeVerticalCenter = navVerticalCenter - darkLightModeHeight / 2;
        root.style.setProperty("--dark-light-mode-top", `${darkLightModeVerticalCenter}px`);
      }
    }
  }

  window.addEventListener("scroll", positionNavElementsUnscrolled);
  /* Need to run once on page load to give the same initial layout as when user goes back to unscrolled position. */
  window.addEventListener("load", positionNavElementsUnscrolled);
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
      threshold: 0.1
    });

    /* Start observing each subsection so the animation triggers when it enters the viewport. */
    aboutMeSubsections.forEach(el => observer.observe(el));
  }

  animateOnScroll(aboutMeSubsections);
}

/*******************************************   Experience tags and pop-ups  ******************************************/

function initExperienceTagsAndPopups() {
  /* Element with .tag-container class should have one of the following classes applied to it as well. */
  const frontEndSkillClass = 'front-end';
  const backEndSkillClass = 'back-end';
  const versionControlWorkflowToolSkillClass = 'version-control-workflow-tools';
  const desktopSkillClass = 'desktop';
  const miscellaneousSkillClass = 'miscellaneous';

  /* Experience type text. Element with .experience-type-title class should have its textContent set to this. */
  const frontEndSkillText = 'Front-end';
  const backEndSkillText = 'Back-end';
  const versionControlWorkflowToolSkillText = 'Version control / Workflow';
  const desktopSkillText = 'Desktop';
  const miscellaneousSkillText = 'Miscellaneous';

  /* Element with .progress-bar class should have one of the following classes applied to it as well. */
  const beginnerProgressClass = 'beginner';
  const intermediateProgressClass = 'intermediate';
  const advancedProgressClass = 'advanced';
  const expertProgressClass = 'expert';

  /* Skill level text. Element with .skill-level-value class should have its textContent set to this. */
  const beginnerSkillLevelText = 'Beginner';
  const intermediateSkillLevelText = 'Intermediate';
  const advancedSkillLevelText = 'Advanced';
  const expertSkillLevelText = 'Expert';

  function createSkill(listItemClass, progressBarClass, name, experienceType, experienceLevel, experienceDuration) {
    return {
      listItemClass,    
      progressBarClass, 
      
      name,               
      experienceType,     
      experienceLevel,    
      experienceDuration, 
    };
  };

  const skills = [
    createSkill(frontEndSkillClass, advancedProgressClass, 'JavaScript', frontEndSkillText, advancedSkillLevelText, '5+ years'),
    createSkill(frontEndSkillClass, advancedProgressClass, 'React', frontEndSkillText, advancedSkillLevelText, '4+ years'),
    createSkill(frontEndSkillClass, advancedProgressClass, 'HTML', frontEndSkillText, advancedSkillLevelText, '5+ years'),
    createSkill(frontEndSkillClass, advancedProgressClass, 'CSS', frontEndSkillText, advancedSkillLevelText, '5+ years'),
    createSkill(frontEndSkillClass, advancedProgressClass, 'AG Grid', frontEndSkillText, advancedSkillLevelText, '3+ years'),
    createSkill(frontEndSkillClass, advancedProgressClass, 'Material UI', frontEndSkillText, advancedSkillLevelText, '3+ years'),
    createSkill(frontEndSkillClass, intermediateProgressClass, 'jQuery', frontEndSkillText, intermediateSkillLevelText, '1+ years'),

    createSkill(backEndSkillClass, advancedProgressClass, 'Python', backEndSkillText, advancedSkillLevelText, '3+ years'),
    createSkill(backEndSkillClass, intermediateProgressClass, 'NumPy', backEndSkillText, intermediateSkillLevelText, '3+ years'),
    createSkill(backEndSkillClass, intermediateProgressClass, 'OpenPyXl', backEndSkillText, intermediateSkillLevelText, '3+ years'),
    createSkill(backEndSkillClass, advancedProgressClass, 'Excel', backEndSkillText, advancedSkillLevelText, '16+ years'),

    createSkill(versionControlWorkflowToolSkillClass, intermediateProgressClass, 'Git', versionControlWorkflowToolSkillText, intermediateSkillLevelText, '10+ years'),
    createSkill(versionControlWorkflowToolSkillClass, intermediateProgressClass, 'GitHub', versionControlWorkflowToolSkillText, intermediateSkillLevelText, '10+ years'),
    createSkill(versionControlWorkflowToolSkillClass, intermediateProgressClass, 'TortoiseGit', versionControlWorkflowToolSkillText, intermediateSkillLevelText, '10+ years'),
    createSkill(versionControlWorkflowToolSkillClass, intermediateProgressClass, 'Postman', versionControlWorkflowToolSkillText, intermediateSkillLevelText, '3+ years'),
    createSkill(versionControlWorkflowToolSkillClass, beginnerProgressClass, 'Docker', versionControlWorkflowToolSkillText, beginnerSkillLevelText, '3+ years'),
    createSkill(versionControlWorkflowToolSkillClass, advancedProgressClass, 'Unfuddle', versionControlWorkflowToolSkillText, advancedSkillLevelText, '10+ years'),

    createSkill(desktopSkillClass, advancedProgressClass, 'Delphi', desktopSkillText, advancedSkillLevelText, '16+ years'),
    createSkill(desktopSkillClass, advancedProgressClass, 'Object Pascal', desktopSkillText, advancedSkillLevelText, '16+ years'),
    createSkill(desktopSkillClass, advancedProgressClass, 'TMS VCL', desktopSkillText, advancedSkillLevelText, '16+ years'),
    createSkill(desktopSkillClass, advancedProgressClass, 'SetupBuilder', desktopSkillText, advancedSkillLevelText, '16+ years'),

    createSkill(miscellaneousSkillClass, intermediateProgressClass, 'Visual Studio Code', miscellaneousSkillText, intermediateSkillLevelText, '3+ years'),
    createSkill(miscellaneousSkillClass, intermediateProgressClass, 'Webstorm', miscellaneousSkillText, intermediateSkillLevelText, '3+ years'),
    createSkill(miscellaneousSkillClass, advancedProgressClass, 'Copilot', miscellaneousSkillText, advancedSkillLevelText, '2+ years'),
    createSkill(miscellaneousSkillClass, intermediateProgressClass, 'Balsamiq', miscellaneousSkillText, intermediateSkillLevelText, '3+ years'),
    createSkill(miscellaneousSkillClass, advancedProgressClass, 'JSON', miscellaneousSkillText, advancedSkillLevelText, '7+ years'),
    createSkill(miscellaneousSkillClass, intermediateProgressClass, 'VBA', miscellaneousSkillText, intermediateSkillLevelText, '3+ years'),
    createSkill(miscellaneousSkillClass, intermediateProgressClass, 'Java', miscellaneousSkillText, intermediateSkillLevelText, '4+ years'),
    createSkill(miscellaneousSkillClass, advancedProgressClass, 'FileZilla', miscellaneousSkillText, advancedSkillLevelText, '16+ years'),
  ];


  /* Get reference to the experience skills template (all the experience skills tags and their pop-ups) and the <ul> they 
    belong to. */
  const experienceSkillsTemplate = document.getElementById('experience-skill-template');
  const experienceTagsList = document.getElementById('experience-tags-list');

  if (experienceSkillsTemplate && experienceTagsList) {
    /* DocumentFragment is a lightweight, minimal DOM container with which we can build up a collection of DOM nodes
      in memory before injecting them into the DOM. This will give us a performance boost, since we won't need to
      repaint for each experience skill. */
    const fragment = document.createDocumentFragment();

    skills.forEach(skillObj => {
      /* Create the experience tag and pop-up for the skill. */
      const experienceSkill = experienceSkillsTemplate.content.cloneNode(true);

      /* Customize it. */
      experienceSkill.querySelector('.tag-contents').textContent = skillObj.name;
      experienceSkill.querySelector('.experience-type-title').textContent = skillObj.experienceType;
      experienceSkill.querySelector('.skill-level-value').textContent = skillObj.experienceLevel;
      experienceSkill.querySelector('.experience-level-value').textContent = skillObj.experienceDuration;

      /* Tells the tag if it should receive front-end, back-end, etc. styling. */
      experienceSkill.querySelector('.tag-container').classList.add(skillObj.listItemClass);

      /* Tells the progress bar if it should receive beginner, advanced, etc. styling. */
      experienceSkill.querySelector('.progress-bar').classList.add(skillObj.progressBarClass);

      /* Add the experience tag and pop-up to the fragment. */
      fragment.appendChild(experienceSkill);
    });

    /* Add all experience tags and pop-ups to the <ul> at once. */
    experienceTagsList.appendChild(fragment); 
  }
}

/*********************************************   Contact me - Reveal email button   ************************************/

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
    });
  }
}

/*********************************************   Contact me - Form validation   ************************************/

function initFormInputListeners() {
  /* Grab the success message under the form inputs and the form inputs themselves. */
  const successMessage = document.getElementById("contact-me-success-message");
  const formInputs = document.querySelectorAll("#contact-me-name, #contact-me-email, #contact-me-message");

  /* If the contents of any of the inputs change, remove the visible class from the sucess message and add the hidden class. 
     This way, the user will know they must resubmit their message. */
  formInputs.forEach(formInput => {
    formInput.addEventListener("input", () => {
      if (successMessage) {
        successMessage.classList.remove("message-sent-visible");
        successMessage.classList.add("message-sent-hidden");
      }
    });
  });
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
          /* Netlify will handle the form now. */
          // contactForm.submit();

          /* FormData is a built-in JavaScript class from Web API that lets us construct key-value pairs for form
             submissions. Add a form name for Netlify (should match form name in HTML), which will be 
             processing user messages for us so we avoid needing a backend for this simple project. */
          const formData = new FormData(contactForm);
          formData.append("form-name", "contact");
        
          fetch("/", {
            method: "POST",
            body: formData,
          })
          .then(() => {
            /* We have a midden message telling the user their message was sent. Add the message-sent-visible class to see it. */
            const successMessage = document.getElementById("contact-me-success-message");

            if (successMessage) {
              successMessage.classList.add("message-sent-visible");
              /* Read the success message out loud after the user finishes their current interaction (not mid-typing/navigation). */
              successMessage.setAttribute("aria-live", "polite");
            }
        
            /* Clear the form */
            contactForm.reset();
          })
          .catch((error) => {
            console.error("Form submission error:", error);
          });
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
  initExperienceTagsAndPopups();
  initEmailRevealButton();
  initFormInputListeners();
  initContactFormValidation();
});