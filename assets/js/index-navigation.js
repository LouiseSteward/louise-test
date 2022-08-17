/*jslint browser */
/*globals locales, pageLanguage */

// This file is meant to be processed by Jekyll,
// wrapping the Holmes include in our own check
// that the page actually includes a reference index.
// Jekyll will insert the Holmes function here.

var runHolmes = function() {

    {% include_relative vendor/holmes.js %}

    // Define Holmes options
    holmes({
        input: 'input.index-filter', // default: input[type=search]
        find: 'li', // querySelectorAll that matches each of the results individually
        class: {
            hidden: 'filter-hidden'
        }
    });
};

// Add a filter to the page
function ebIndexAddFilterInput() {
    'use strict';

    var indexList = document.querySelector('.reference-index');
    if (indexList) {

        // Create filter input element
        var indexFilter = document.createElement('input');
        indexFilter.setAttribute('type', 'text');
        indexFilter.classList.add('index-filter');
        indexFilter.setAttribute('autofocus', 'autofocus');

        if (locales[pageLanguage].index.filter.placeholder) {
            indexFilter.setAttribute('placeholder', locales[pageLanguage].index.filter.placeholder);
        }

        // Insert the filter before the index
        indexList.insertAdjacentElement('beforebegin', indexFilter);
    }
}

function ebIndexNavigationLoad() {
    'use strict';

    var indexList = document.querySelector('.reference-index');
    if (indexList) {
        runHolmes();
    }

    // Add a filter text box to the page
    ebIndexAddFilterInput();
}

// Go
ebIndexNavigationLoad();
