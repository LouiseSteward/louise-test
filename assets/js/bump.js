/*jslint browser*/
/*globals window, Prince */

// Bumps an element one up the DOM.

function findPrevious(elm) {
    'use strict';
    do {
        elm = elm.previousSibling;
    } while (elm && elm.nodeType !== 1);
    return elm;
}

function bumpUp(elm) {
    'use strict';
    var previous = findPrevious(elm);
    if (previous) {
        elm.parentNode.insertBefore(elm, previous);
    }
}

window.onload = function () {
    'use strict';
    var elementsToBumpUp = document.querySelectorAll('.bump-up');
    var i;
    for (i = 0; i < elementsToBumpUp.length; i += 1) {
        bumpUp(elementsToBumpUp[i]);
    }
};
