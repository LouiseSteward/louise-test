/* jslint browser */
/*global window */

function ebDefinitionsInit() {
    'use strict';

    // check for browser support of the features we use
    return navigator.userAgent.indexOf('Opera Mini') === -1 &&
            document.querySelector !== undefined &&
            window.addEventListener !== undefined &&
            !!Array.prototype.forEach;
}

function ebDefinitionsSlugify(snail) {
    'use strict';

    return snail.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/-+/g, '-')            // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text;
}

function ebDefinitionsMoveDefinitions() {
    'use strict';

    // get all the definition-terms and loop over them
    var definitionTerms = document.querySelectorAll('.definition-term');

    // loop over them
    definitionTerms.forEach(function (definitionTerm) {

        console.log('Processing definition for ' + definitionTerm.innerHTML);

        // visually hide the old dl, the parent of the definitionTerm
        definitionTerm.parentNode.classList.add('hidden-definition-list');

        // get the definition term
        var definitionTermText = definitionTerm.innerHTML;

        // Detect presence of em spans
        var definitionTermTextIsItalic;
        if (definitionTermText.indexOf('<em>') !== -1) {
            console.log(definitionTermText + ' contains italics.');
            definitionTermTextIsItalic = true;
        }

        // Create a plain-text version of definitionTermText for matching with dataTermInText
        var termTextForMatching = definitionTermText;
        // 1. Remove em spans created from asterisks in markdown
        if (definitionTermTextIsItalic) {
            termTextForMatching = termTextForMatching.replace(/(<([^>]+)>)/ig, "*");
        }
        // 2. Straighten quotes in the HTML to match data-terms
        termTextForMatching = termTextForMatching.replace("’", "'");
        termTextForMatching = termTextForMatching.replace("‘", "'");
        console.log('termTextForMatching: ' + termTextForMatching);

        // to check that we even have any terms to define:
        // find a data-term attribute
        var dataTermInText = document.querySelector('[data-term="' + termTextForMatching + '"]');
        // check that we have the term in the text
        if (!dataTermInText) {
            return;
        }


        // now we can add popups to each of them

        // find all the places where we want a popup
        var dataTermsInText = document.querySelectorAll('[data-term="' + termTextForMatching + '"]');

        // for each one, get the description and add the popup
        dataTermsInText.forEach(function (dataTermInText) {

            // if the term contained italics, put the em tags back
            if (definitionTermTextIsItalic) {
                definitionTermText = termTextForMatching.replace(/\*(.+?)\*/ig, '<em>$1</em>');
            }

            // get the description text
            var definitionDescriptionText = definitionTerm.nextElementSibling.innerHTML;

            // add it after the data-term
            var definitionPopup = document.createElement('span');
            definitionPopup.innerHTML = '<span class="definition-hover-term">' + definitionTermText + '</span>' + ' ' + definitionDescriptionText;
            definitionPopup.classList.add('visuallyhidden');
            definitionPopup.classList.add('definition-description-hover');
            definitionPopup.setAttribute('data-bookmarkable', 'no');
            // Removing addition of IDs to prevent duplicate IDs on a chapter page
            // to improve accessibility.
            // definitionPopup.id = 'dd-' + ebDefinitionsSlugify(definitionTermText);
            dataTermInText.insertAdjacentElement('afterEnd', definitionPopup);

            // add the closing X as a link
            var closeButton = document.createElement('button');
            closeButton.classList.add('close');
            closeButton.innerHTML = '<span class="visuallyhidden">close</span>';
            definitionPopup.appendChild(closeButton);
        });

    });

}

function ebDefinitionsKeyboardAccess() {
    "use strict";

    var descriptionSpans = document.querySelectorAll("span.definition-description-hover");
    descriptionSpans.forEach(function(span) {
        var tabbableElements = span.querySelectorAll("em.definition-cross-reference a, button.close");
        tabbableElements.forEach(function(el) {
            el.setAttribute("tabindex", "-1");
        });
    });
}

function ebDefinitionsShowDescriptions() {
    'use strict';

    // get the terms
    var dataTerms = document.querySelectorAll('[data-term]');

    // loop and listen for hover on child description
    dataTerms.forEach(function (dataTerm) {
        // get the child that we want to pop up
        var childPopup = dataTerm.nextElementSibling;

        if (childPopup) {
            // show on click
            dataTerm.addEventListener('click', function () {
                childPopup.classList.remove('visuallyhidden');
            });
            // Make definitions keyboard focusable
            dataTerm.setAttribute("tabindex", 0);

            var tabbableElements = childPopup.querySelectorAll("em.definition-cross-reference a, button.close");
            // Show definition when focused and Enter is pressed
            dataTerm.addEventListener('keydown', function (event) {
                if (event.key === "Enter") {
                    childPopup.classList.toggle('visuallyhidden');
                    tabbableElements.forEach(function (el) {
                        if (el.hasAttribute("tabindex")) {
                            el.removeAttribute("tabindex");
                        }
                        else {
                            el.setAttribute("tabindex", "-1");
                        }
                    });
                }
            });
        } else {
            console.debug('A data-term is not loading. Check the definition for: ' + dataTerm.innerText);
        }

    });

}

function ebDefinitionsHideDescriptions() {
    'use strict';

    var descriptions = document.querySelectorAll('.definition-description-hover');

    descriptions.forEach(function (description) {
        // if we mouseleave description, hide it
        // (mouseout also fires on mouseout of children, so we use mouseleave)
        description.addEventListener('mouseleave', function () {
            setTimeout(function () {
                description.classList.add('visuallyhidden');
            }, 1000);
        });
        var tabbableElements = description.querySelectorAll("em.definition-cross-reference a, button.close");
        // Close definition when Esc is pressed
        window.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                description.classList.add('visuallyhidden');
                tabbableElements.forEach(function (el) {
                    el.setAttribute("tabindex", "-1");
                });
            }
        });
    });

}

function ebDefinitionsHideDescriptionWithButton() {
    'use strict';

    var closeButtons = document.querySelectorAll('.definition-description-hover button.close');

    // listen for clicks on all close buttons
    closeButtons.forEach(function (closeButton) {
        closeButton.addEventListener('click', function () {
            // ev.preventDefault();
            closeButton.parentNode.classList.add('visuallyhidden');
        });
        closeButton.addEventListener("keydown", function(ev) {
            if (ev.key === "Enter") {
                var tabbableElements = closeButton.parentNode.querySelectorAll(
                    "em.definition-cross-reference a, button.close"
                );
                tabbableElements.forEach(function(el) {
                    el.setAttribute("tabindex", "-1");
                });
            }
        });
    });
}

var ebDefinitions = function () {
    'use strict';

    // early exit for lack of browser support
    if (!ebDefinitionsInit()) {
        return;
    }

    // move all the definitions next to their terms
    ebDefinitionsMoveDefinitions();

    // listen for hover and things
    ebDefinitionsKeyboardAccess();
    ebDefinitionsShowDescriptions();
    ebDefinitionsHideDescriptions();
    ebDefinitionsHideDescriptionWithButton();


};

ebDefinitions();

// Debugging logs should be stripped automatically
// when JS is minified.
console.log('Debugging definitions.js');
