/*jslint browser */
/*globals window */

// Lets user switch to dark mode,
// and saves their choice to localStorage.

// Check for browser support
function ebDarkMarkSupport() {
    'use strict';
    if (window.localStorage
            && Storage !== 'undefined') {
        return true;
    }
}

// Save user preference to local storage
function ebDarkModeSave(status) {
    'use strict';
    if (window.localStorage
            && Storage !== 'undefined') {
        localStorage.setItem('dark-mode', status);
    }
}

// Turn on dark mode
function ebDarkModeOn() {
    'use strict';
    document.body.classList.add('dark-mode');
    ebDarkModeSave('on');
}

// Turn off dark mode
function ebDarkModeOff() {
    'use strict';
    document.body.classList.remove('dark-mode');
    ebDarkModeSave('off');
}

// Toggle dark mode
function ebDarkModeToggle() {
    'use strict';
    if (localStorage.getItem('dark-mode') === 'on') {
        ebDarkModeOff();
    } else {
        ebDarkModeOn();
    }
}

// Check for the saved mode and apply it,
// then listen for clicks to toggle mode
function ebDarkMode() {
    'use strict';

    // Exit if no support
    if (ebDarkMarkSupport() !== true) {
        return;
    }

    // If stored value is on, turn on dark mode
    var status = localStorage.getItem('dark-mode');
    if (status === 'on') {
        ebDarkModeOn();
    }

    // Show the button
    var darkModeControl = document.querySelector('.dark-mode-control');

    if (darkModeControl !== null) {
        darkModeControl.classList.remove('visuallyhidden');

        // Listen for clicks on it
        darkModeControl.addEventListener('click', function () {
            ebDarkModeToggle();
        });
        darkModeControl.addEventListener('keydown', function (event) {
            if (event.key === "Enter") {
                ebDarkModeToggle();
            }
        });
    }
}

// Run the main process
ebDarkMode();
