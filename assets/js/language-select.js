/*jslint browser */

function ebLanguageSelector() {
    "use strict";
    // The language selector needs to be keyboard accessible
    var languageSelector = document.querySelector(".language-select");

    if (languageSelector) {
        languageSelector.addEventListener("keydown", function (event) {
            // Toggle the dropdown with Enter
            if (event.key === "Enter" && languageSelector.contains(event.target)) {
                languageSelector.toggleAttribute("visible");
            }
            // Close the dropdown with Escape
            if (event.key === "Escape" && languageSelector.hasAttribute("visible")) {
                languageSelector.removeAttribute("visible");
                languageSelector.focus();
            }
        });
    }
}

ebLanguageSelector();
