/*jslint browser */

// Change the content of the notification close button label
function ebChangeCloseButton() {
    "use strict";

    const closeButtons = document.querySelectorAll(".notification.login-prompt label");

    if (closeButtons) {
        closeButtons.forEach(function (button) {
            button.innerHTML = "╳";
        });
    }
}

ebChangeCloseButton();


// Detect whether the reader is logged in to the WP site
function ebLoggedInToWP() {
    "use strict";

    let readerIsLoggedIn = false;
    const cookieName = "coreproject_sess";

    if (document.cookie.includes(cookieName)) {
        // we're logged in to the WP account
        readerIsLoggedIn = true;
    }

    return readerIsLoggedIn;
}


function ebDisplayLoginPrompts() {
    "use strict";

    const centralLoginPopup = document.querySelector(".central-login-prompt");
    const sidebarLoginPrompt = document.querySelector(".sidebar-login-prompt");
    
    // If they are not logged in, show the sidebar prompt on the home page
    if (!ebLoggedInToWP() && ("{{ site.data.settings.web.login-prompts }}" === "true")) {

        if (sidebarLoginPrompt && document.body.classList.contains("home")) {
            sidebarLoginPrompt.classList.remove("visuallyhidden");
        }
    }

    // Then, always show the prompts inside in instructors-preview view
    if ("{{ site.view }}" === "instructors-preview") {
        if (sidebarLoginPrompt) {
            sidebarLoginPrompt.classList.remove("visuallyhidden");
        }
    }
}

ebDisplayLoginPrompts();


function ebHideSectionContents() {
    "use strict";

    if ("{{ site.view }}" === "instructors-preview") {
        // if we're in a unit, get all the sections
        if (
            document.body.classList.contains("chapter") &&
            !document.body.classList.contains("home")
        ) {

            // get all the sections
            let sections = document.querySelectorAll("section > div[data-container='true']");

            sections.forEach(function (section) {
                // Check whether the h2 has class "instructors-only" -- these are
                // the sections that get greyed out in instructors-preview view
                const h2 = section.parentNode.querySelector("h2");
                if (h2.classList.contains("instructors-only")) {

                    section.classList.add("obscured-section");

                    let button = document.createElement("a");
                    button.innerHTML = "Instructor login";
                    button.classList.add("instructor-login");

                    const redirect = location.pathname.replace("instructors-preview", "instructors");

                    button.setAttribute("href", "{{ site.canonical-url }}/login/?redirect_to=" + redirect);
                    button.setAttribute("target", "_self")

                    if (section.getAttribute("aria-expanded") === "false") {
                        button.classList.add("visuallyhidden");
                    }

                    section.after(button);

                    // when the section is open, show the button
                    let sectionObserver = new MutationObserver(function (mutationsList) {
                        mutationsList.forEach(function (mutation) {
                            if (
                                mutation.type === "attributes" &&
                                mutation.attributeName === "aria-expanded"
                            ) {
                                if (section.getAttribute("aria-expanded") === "true") {
                                    button.classList.remove("visuallyhidden");
                                } else {
                                    button.classList.add("visuallyhidden");
                                }
                            }
                        });
                    });

                    sectionObserver.observe(section, {attributes: true});
                }
            });
        }
    }
}

ebHideSectionContents();
