/* jslint */

// Remove everything except slides, figures and images
// for slideline review, output as screen-pdf

// We want to keep:
// #content > .slides,
// #content > .figure,
// #content > .einstein > .slides,
// #content > .einstein > .figure,
// #content > .economist > .slides,
// #content > .economist > .figure,
// #content > .economists > .slides,
// #content > .economists > .figure,
// #content > .great-economists > .slides,
// #content > .question > .slides,
// #content > .question > .figure,
// #content > .exercise > .slides,
// #content > .exercise > .figure,
// #content > .info > .figure,
// #content > .info > .slides,
// #content p > img

console.log('Creating images-only HTML...');

function ebImagesOnly() {
    'use strict';

    // get content, add a new div after it
    var content = document.getElementById('content');
    var keeperContainer = document.createElement('div');
    keeperContainer.id = "keeper";
    content.parentNode.appendChild(keeperContainer);

    // get stuff to put in it
    var keepers = document.querySelectorAll('h1, #content > .slides, #content > .figure, #content > .einstein > .slides, #content > .einstein > .figure, #content > .economist > .slides, #content > .economist > .figure, #content > .economists > .slides, #content > .economists > .figure, #content > .great-economists > .slides, #content > .question > .slides, #content > .question > .figure, #content > .exercise > .slides, #content > .exercise > .figure, #content > .info > .figure, #content > .info > .slides, #content p > img');
    var i;
    for (i = 0; i < keepers.length; i += 1) {
        keeperContainer.appendChild(keepers[i]);
    }

    console.log('There are ' + keepers.length + ' keepers.');

    var figuresAndImages = document.querySelectorAll('.figure, #content p > img');

    console.log('There are ' + figuresAndImages.length + ' figures and images.');

    // move keeper contents to #content
    content.innerHTML = keeperContainer.innerHTML;
    keeperContainer.remove();

    // remove some other stuff too
    var ditchers = document.querySelectorAll('.masthead, #nav, #footer, [href="#nav"]');
    var j;
    for (j = 0; j < ditchers.length; j += 1) {
        ditchers[j].remove();
    }
}

ebImagesOnly();
