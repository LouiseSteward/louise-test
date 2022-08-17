/*jslint browser, for */
/*globals window, ebToggleClickout */

function ebNavKeyboardAccess() {
    "use strict";

    // All of the links that are always visible are keyboard accessible
    var firstOrderLinks = document.querySelectorAll("#nav li.has-children > a");
    firstOrderLinks.forEach(function(link) {
        link.setAttribute("tabindex", "0");
    });

    // Make all of the visually hidden sublinks inacccessible
    var submenuLinks = document.querySelectorAll("#nav li.has-children ol a");
    submenuLinks.forEach(function(link) {
        link.setAttribute("tabindex", "-1");
    });

    // then, when the sublist is visible, make the relevant links accessible
    firstOrderLinks.forEach(function(link) {
        link.addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                var thisMenu = link.closest("li.has-children");
                thisMenu.querySelector("ol").classList.toggle("visuallyhidden");

                var thisMenusButton = thisMenu.querySelector("button[data-toggle]");
                thisMenusButton.classList.toggle("show-children");

                var theseSubMenuLinks = thisMenu.querySelectorAll("li ol a");
                theseSubMenuLinks.forEach(function(sublink) {
                    if (sublink.hasAttribute("tabindex")) {
                        sublink.removeAttribute("tabindex");
                    } else {
                        sublink.setAttribute("tabindex", "-1");
                    }
                });
            }
        });
    });

    // need to have the same thing happen when the toggle button is used
    var toggleButtons = document.querySelectorAll("#nav li.has-children.no-link button[data-toggle]");
    toggleButtons.forEach(function(button) {
        button.addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                var thisMenu = button.closest("li.has-children");
                var theseSubMenuLinks = thisMenu.querySelectorAll("li ol a");

                theseSubMenuLinks.forEach(function(sublink) {
                    if (sublink.hasAttribute("tabindex")) {
                        sublink.removeAttribute("tabindex");
                    } else {
                        sublink.setAttribute("tabindex", "-1");
                    }
                });
            }
        });
    });
}

function ebNav() {
    'use strict';

    // let Opera Mini use the footer-anchor pattern
    if (navigator.userAgent.indexOf('Opera Mini') === -1) {

        // let newer browsers use js-powered menu
        if (document.querySelector !== "undefined" &&
                window.addEventListener) {

            // set js nav class
            document.documentElement.classList.add('js-nav');

            // set up the variables
            var menuLink = document.querySelector('[href="#nav"]');
            var menu = document.querySelector('#nav');

            // hide the menu until we click the link
            menu.classList.add("visuallyhidden");

            // add a close button
            var closeButton = '<button data-toggle data-nav-close>';
            closeButton += '<span class="visuallyhidden">Close menu</span>';
            closeButton += '</button>';
            menu.insertAdjacentHTML('afterBegin', closeButton);

            // hide the children and add the button for toggling
            var subMenus = document
                .querySelectorAll('#nav .has-children, #nav .has-children');
            var showChildrenButton = '<button data-toggle data-toggle-nav>';
            showChildrenButton += '<span class="visuallyhidden">Toggle</span>';
            showChildrenButton += '</button>';
            var i;
            for (i = 0; i < subMenus.length; i += 1) {
                subMenus[i].querySelector('ol, ul').classList.add('visuallyhidden');
                subMenus[i].querySelector('a, .docs-list-title')
                    .insertAdjacentHTML('afterend', showChildrenButton);
            }

            // Mark parents of active children active too
            var activeChildren = menu.querySelectorAll('li.active');
            var j, equallyActiveParent;
            for (j = 0; j < activeChildren.length; j += 1) {
                equallyActiveParent = activeChildren[j].closest('li:not(.active)');
                if (equallyActiveParent && equallyActiveParent !== 'undefined') {
                    equallyActiveParent.classList.add('active');
                    // Mark its children as active as well, for cases like the
                    // Leibnizes that are in different files under one parent heading
                    equallyActiveParent.querySelectorAll("li:not(.active)").forEach(function (child) {
                        child.classList.add("active");
                    });
                }
            }

            // show the menu when we click the link
            menuLink.addEventListener("click", function (ev) {
                ev.preventDefault();
                ebToggleClickout(menu, function () {
                    menu.classList.toggle("visuallyhidden");
                    document.documentElement.classList.toggle('js-nav-open');
                });
            }, true);

            // Show the menu using the Enter key
            menuLink.addEventListener("keydown", function (ev) {
                if (ev.key === "Enter") {
                    ev.preventDefault();
                    ebToggleClickout(menu, function () {
                        menu.classList.toggle("visuallyhidden");
                        document.documentElement.classList.toggle('js-nav-open');
                        document.querySelector("button[data-nav-close]").focus();
                    });
                }
            });

            var ebHideMenu = function () {
                menu.classList.add("visuallyhidden");
                document.documentElement.classList.remove('js-nav-open');
                document.querySelector("a.nav-button").focus();
            };

            // Close the nav with the Escape key
            menu.addEventListener("keydown", function(ev) {
                if (ev.key === "Escape") {
                    // Need to leave language selector alone if it is open
                    // Otherwise the user will get unexpected behaviour
                    var languageSelector = menu.querySelector(".language-select");
                    var eventTarget = event.target;
                    if (languageSelector
                        && languageSelector.contains(eventTarget)
                        && eventTarget !== languageSelector) {
                        return;
                    }
                    ev.preventDefault();
                    ebToggleClickout(menu, function () {
                        ebHideMenu();
                    });
                }
            });

            // listen for clicks inside the menu
            menu.addEventListener("click", function (ev) {
                var clickedElement = ev.target || ev.srcElement;

                // hide the menu when we click the button
                if (clickedElement.hasAttribute("data-nav-close")) {
                    ev.preventDefault();
                    ebToggleClickout(menu, function () {
                        ebHideMenu();
                    });
                    return;
                }

                // show the children when we click a .has-children
                if (clickedElement.hasAttribute("data-toggle-nav")) {
                    ev.preventDefault();
                    clickedElement.classList.toggle('show-children');
                    clickedElement.nextElementSibling.classList.toggle('visuallyhidden');
                    return;
                }

                // if it's an anchor with an href (an in-page link)
                if (clickedElement.tagName === "A" && clickedElement.getAttribute('href')) {
                    // ebHideMenu();
                    ebToggleClickout(menu, function () {
                        ebHideMenu();
                    });
                    return;
                }

                // if it's an anchor without an href (a nav-only link)
                if (clickedElement.tagName === "A") {
                    clickedElement.nextElementSibling.classList.toggle('show-children');
                    clickedElement.nextElementSibling.nextElementSibling.classList.toggle('visuallyhidden');
                    return;
                }
            });

            // This enables a back button, e.g. for where we don't have a
            // browser or hardware back button, and we have Jekyll add one.
            // This button is hidden in scss with `$nav-bar-back-button-hide: true;`.
            // If the user has navigated (i.e. there is a document referrer),
            // listen for clicks on our back button and go back when clicked.
            // We check history.length > 2 because new tab plus landing page
            // can constitute 2 entries in the history (varies by browser).
            var navBackButton;
            if (document.referrer !== "" || window.history.length > 2) {
                navBackButton = document.querySelector('a.nav-back-button');
                if (navBackButton) {
                    navBackButton.addEventListener('click', function (ev) {
                        ev.preventDefault();
                        window.history.back();
                    });
                }
            } else {
                navBackButton = document.querySelector('a.nav-back-button');
                if (navBackButton) {
                    navBackButton.parentNode.removeChild(navBackButton);
                }
            }
        }
    }
}

ebNav();
ebNavKeyboardAccess();
