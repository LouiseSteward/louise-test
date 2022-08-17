/*jslint browser */
/*globals BigScreen */

const ebToggleFullscreenImage = function (event) {
    "use strict";

    let button = event.target;
    let figureContainer = button.closest(".figure-images");

    if (BigScreen.enabled) {
        BigScreen.toggle(figureContainer,
            function (figureContainer){
                figureContainer.classList.add("fullscreen");
                button.innerHTML = locales[pageLanguage].figures["exit-fullscreen"];
            },
            function(figureContainer) {
                figureContainer = button.closest(".figure-images");
                figureContainer.classList.remove("fullscreen");
                button.innerHTML = locales[pageLanguage].figures["enter-fullscreen"];
            }
        );
    }
};


function ebFullscreenImages () {
    "use strict";

    // Find the icons
    const fullscreenButtons = document.querySelectorAll(".fullscreen-button");

    // For each icon
    fullscreenButtons.forEach(function (button) {
        button.addEventListener("click", ebToggleFullscreenImage);
        button.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                ebToggleFullscreenImage(event);
            }
        });
    });
}

ebFullscreenImages();
