/**************************************   Scroll anchors   *****************************************/

/* Mimic the behavor of clicking on the "About me" anchor. This will get attached to a button. */
document.querySelector("#scroll-down").addEventListener("click", () => {
    window.scrollTo({
        top: document.querySelector("#about-me").offsetTop - 20,
    });
});

/*****************************    Light/dark mode   *********************************************/

/* If the user clicks the element with id toggle-theme, add the light-theme class to html elements. 

   Note that document.documentElement is equivalent to document.querySelector("html"), so we
   are adding light-theme to the html element and can then use html.light-theme in the CSS to
   change the colors in light mode. Since :root also refers to the html element, we can do
   :root.light-theme to change the color variables we defined. */
document.querySelector("#toggle-theme").addEventListener("click", () => {
    document.documentElement.classList.toggle("light-theme");
});

/* Also add light-theme to the html element if the user prefers it. */
const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;

if (prefersLight) {
    document.documentElement.classList.add("light-theme");
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