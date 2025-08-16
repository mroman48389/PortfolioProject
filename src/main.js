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

const darkLightModeTooltip = document.querySelector("#toggle-theme-tooltip");

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

/*********************************   Nav bar bottom border shadow   ***************************/

/* Add or remove "scrolled" class to the <nav> element depending on if the user has scrolled so 
   we can style it differently for each case. */
window.addEventListener("scroll", () => {
    const nav = document.querySelector("nav");
    
    if (window.scrollY > 0) {
      nav.classList.add("scrolled");
    } 
    else {
      nav.classList.remove("scrolled");
    }
});

/****************************  About me subsection fade in/outs  *********************************/

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