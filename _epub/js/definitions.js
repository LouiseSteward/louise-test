/* jslint browser */
/*global window, console */

var ebDefinitionsInit = function () {
    'use strict';

    // check for browser support of the features we use
    return navigator.userAgent.indexOf('Opera Mini') === -1 &&
            document.querySelector !== undefined &&
            window.addEventListener !== undefined &&
            !!Array.prototype.forEach;
};

var ebDefinitionsSlugify = function (snail) {
    'use strict';

    return snail.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/-+/g, '-')            // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text;
};

var ebConvertToAnchorTag = function (element) {
    'use strict';

    // Thanks https://stackoverflow.com/a/34237781/1781075
    function cloneAttributes(element, sourceNode) {
        var attr;
        var attributes = Array.prototype.slice.call(sourceNode.attributes);
        // While attr can be set to the last attribute in attributes
        // (i.e. there is still an attribute in attributes to copy),
        // set that attribute on the element. (Note, we really do want
        // to try to set the value of attr here, not test if it equals anything.)
        while (attr = attributes.pop()) {
            element.setAttribute(attr.nodeName, attr.nodeValue);
        }
    }

    // Make it an anchor tag, not a strong span
    var newElement = document.createElement('a');
    newElement.innerHTML = element.innerHTML;
    cloneAttributes(newElement, element);
    element.parentNode.replaceChild(newElement, element);
    return newElement;
};

var ebDefinitionsMoveDefinitions = function () {
    'use strict';

    // get all the definition-terms and loop over them
    var definitionTerms = document.querySelectorAll('.definition-term');

    // loop over them
    definitionTerms.forEach(function (definitionTerm) {

        // visually hide the old dl, the parent of the definitionTerm
        definitionTerm.parentNode.classList.add('hidden-definition-list');

        // get the definition term
        var definitionTermText = definitionTerm.innerHTML;

        // Detect presence of em spans. Note that em spans may include attributes,
        // so only test for <em, not <em>.
        var definitionTermTextIsItalic;
        if (definitionTermText.indexOf('<em') !== -1) {
            // console.log(definitionTermText + ' contains italics.');
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
        // console.log('termTextForMatching: ' + termTextForMatching);

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

            // Style the term (we do this here so that this styling only applies if JS
            // loads and runs, to avoid making a term look like a link that doesn't work)
            dataTermInText.classList.add('data-term-clickable');

            // get the description text
            var definitionDescriptionText = definitionTerm.nextElementSibling.innerHTML;

            // add it after the data-term
            var definitionPopup = document.createElement('span');
            definitionPopup.innerHTML = '<span class="definition-hover-term">' + definitionTermText + '</span>' + ' ' + definitionDescriptionText;
            definitionPopup.classList.add('visuallyhidden');
            definitionPopup.classList.add('definition-description-hover');
            definitionPopup.id = 'dd-' + ebDefinitionsSlugify(definitionTermText);
            dataTermInText.insertAdjacentElement('afterEnd', definitionPopup);

            // add the closing X as a link
            var closeButton = document.createElement('button');
            closeButton.classList.add('close');
            closeButton.innerHTML = '<span class="visuallyhidden">close</span>';
            definitionPopup.appendChild(closeButton);

            // Convert to anchor tag
            ebConvertToAnchorTag(dataTermInText);
        });

    });

};

var ebDefinitionsShowDescriptions = function () {
    'use strict';

    // get the terms
    var dataTerms = document.querySelectorAll('[data-term]');

    // loop and listen for hover on child description
    dataTerms.forEach(function (dataTerm) {

        // get the child that we want to pop up
        var childPopup = dataTerm.nextElementSibling;

        // show on click
        dataTerm.addEventListener('click', function () {
            childPopup.classList.remove('visuallyhidden');
        });

    });

};

var ebDefinitionsHideDescriptions = function () {
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
    });

};

var ebDefinitionsHideDescriptionWithButton = function () {
    'use strict';

    var closeButtons = document.querySelectorAll('.definition-description-hover button.close');

    // listen for clicks on all close buttons
    closeButtons.forEach(function (closeButton) {
        closeButton.addEventListener('click', function () {
            // ev.preventDefault();
            closeButton.parentNode.classList.add('visuallyhidden');
        });
    });
};

var ebDefinitions = function () {
    'use strict';

    // early exit for lack of browser support
    if (!ebDefinitionsInit()) {
        return;
    }

    // move all the definitions next to their terms
    ebDefinitionsMoveDefinitions();

    // listen for hover and things
    ebDefinitionsShowDescriptions();
    ebDefinitionsHideDescriptions();
    ebDefinitionsHideDescriptionWithButton();


};

ebDefinitions();
