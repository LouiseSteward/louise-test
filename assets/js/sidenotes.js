/* jslint browser */
/*global window*/

// Detect long sidenotes and make them 'web'wide
console.log('Debugging sidenotes.js...');

// Options:
// length: min characters to convert to .web-wide
// elements: which elements are sidenotes? Use CSS selectors
// siblings: which elements can wrap around web-wide sidenotes? Use tag names only.
var options = {
    length: '300',
    elements: '.sidenote, .info',
    siblings: 'p, ol, ul, dl, h3, h4, h5'
};

// Get all the sidenotes
function ebSidenoteConverterAllSidenotes() {
    'use strict';
    var sidenotes = document.querySelectorAll(options.elements);
    console.log('Found ' + sidenotes.length + ' sidenotes.');
    return sidenotes;
}

// Get a sidenote's length
function ebSidenoteConverterSidenoteLength(sidenote) {
    'use strict';
    var length = sidenote.innerText.length;
    return length;
}

// Check if an element is in the list of allowed siblings
function ebSidenoteConverterIsAllowedAsSibling(element) {
    'use strict';

    console.log('Checking whether ' + element.tagName + ' can wrap this sidenote.');

    // Get the allowed siblings list, remove spaces,
    // convert to uppercase to match tagNames,
    // and split it into an object.
    var allowedSiblings = options.siblings;
    allowedSiblings = allowedSiblings.replace(/\s/g, '');
    allowedSiblings = allowedSiblings.toUpperCase();
    allowedSiblings = allowedSiblings.split(',');

    // Check if the element is in the allowedSiblings object.
    if (Object.values(allowedSiblings).indexOf(element.tagName) > -1) {
        console.log('Yes, ' + element.tagName + ' can wrap a sidenote.');
        return true;
    }
}

// Add 'web-wide' class
function ebSidenoteConverterAddClass(sidenote) {
    'use strict';
    console.log('Adding "web-wide" class to sidenote: "' + sidenote.innerText + '"');

    // Also, we don't want web-wide sidenotes to be on the left,
    // so also add the web-sidenote-right class.
    sidenote = sidenote.classList.add('web-wide', 'web-sidenote-right');

    return sidenote;
}

// Recursively check the siblings of the sidenote
// to see if they can safely wrap around the sidenote.
function ebSidenoteConverterWrapText(sidenote, element, sidenoteLength, nextElementsLength) {
    'use strict';

    if (element.nextSibling) {
        if (ebSidenoteConverterIsAllowedAsSibling(element.nextSibling)) {
            console.log('This next element can wrap a sidenote: ' + element.nextSibling.innerText);
            nextElementsLength = nextElementsLength + element.nextSibling.innerText.length;
            if (nextElementsLength > sidenoteLength) {
                console.log('Following elements are long enough.');
                ebSidenoteConverterAddClass(sidenote);
            } else {
                ebSidenoteConverterWrapText(sidenote, element.nextSibling, sidenoteLength, nextElementsLength);
            }
        } else {
            return;
        }
    }
}

// The main process
function ebSidenoteConverterProcess() {
    'use strict';
    console.log('Starting to process sidenotes...');
    var i;
    var sidenoteLength;
    var sidenotes = ebSidenoteConverterAllSidenotes();
    var sidenote;
    for (i = 0; i < sidenotes.length; i += 1) {
        sidenote = sidenotes[i];
        sidenoteLength = ebSidenoteConverterSidenoteLength(sidenote);
        console.log('Sidenote is ' + sidenoteLength + ' characters long: "' + sidenote.innerText + '"');
        if (sidenoteLength > options.length) {
            console.log('Sidenote length more than ' + options.length + 'px');
            ebSidenoteConverterWrapText(sidenote, sidenote, sidenoteLength, 0);
        }
    }
}

ebSidenoteConverterProcess();
