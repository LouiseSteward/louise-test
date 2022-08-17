/*jslint browser */
/*globals IntersectionObserver */

// Find any figure with a data-interactive attribute
// and place an iframe of that interactive graph over its image

function ebFigureGetInteractiveAttribute(figure) {
    'use strict';
    var interactiveFile = figure.getAttribute('data-interactive');

    if (interactiveFile === 'undefined') {
        interactiveFile = '';
    }

    return interactiveFile;
}

function ebReplaceImagesWithInteractiveIframes(figure) {
    'use strict';
    var images = figure.querySelectorAll('img, svg'); // SVG may already be injected, so we need to account for that
    var dataInteractiveAttribute = ebFigureGetInteractiveAttribute(figure);

    // If there really is a data-interactive attribute to work with...
    if (dataInteractiveAttribute !== ""
            && images
            && images.length > 0
            && dataInteractiveAttribute !== 'undefined') {

        // Create an array of interactive files in the data-interactive attribute
        var interactiveFilesArray = dataInteractiveAttribute.split(',');

        var i, iframe, imagePath, interactiveDirectoryPath, width, height;
        for (i = 0; i < interactiveFilesArray.length; i += 1) {

            // Trim whitespace from each item in the array
            interactiveFilesArray[i].trim();

            // Get the corresponding image path, since we assume
            // that the interactive equivalent is in a sibling directory in images/.
            imagePath = images[i].src || images[i].getAttribute('data-inject-url');
            console.log(imagePath);
            interactiveDirectoryPath = imagePath.replace(/\/images\/\w+\/.+/g, '/interactive/optimised/');

            // Create an iframe with the interactive source
            iframe = document.createElement('iframe');
            console.log('Creating iframe of ' + interactiveDirectoryPath + interactiveFilesArray[i]);
            iframe.setAttribute('src', interactiveDirectoryPath + interactiveFilesArray[i]);

            // Set a width for the iframe
            // iframe.width = figure.querySelector('.figure-images').offsetWidth;
            if (images[i].tagName === 'svg') {
                console.log('Using ' + images[i].tagName + ' dimensions for ' + figure.id);
                width = images[i].getBBox().x;
                height = images[i].getBBox().y;
            } else {
                console.log('Using ' + images[i].tagName + ' dimensions for ' + figure.id);
                width = images[i].offsetWidth;
                height = images[i].offsetHeight;
            }

            // Check for zero dimensions, and force them if so,
            // because if the image hadn't already loaded,
            // we wouldn't have its dimensions.
            if (width === 0 || height === 0) {
                console.log('Using .figure-images dimensions for ' + figure.id);
                width = images[i].closest('.figure-images').offsetWidth;
                height = images[i].closest('.figure-images').offsetHeight;
                if (width === 0 || height === 0) {
                    console.log('Width and/or height of .figure-images are 0. Using fallback dimensions for ' + figure.id);
                    width = width;
                    height = width / 4 * 3; // 3:4 aspect ratio
                }
            }

            // Set dimensions
            iframe.width = width;
            iframe.height = height;

            // Insert the iframe for its corresponding image
            images[i].insertAdjacentElement('afterend', iframe);
            images[i].style.display = 'none';

        }
    }
}


function ebInteractiveFigures() {
    'use strict';
    var interactiveFigures = document.querySelectorAll('[data-interactive]');

    // When an interactive figure is in view, replace its images with an iframe
    var interactiveFigureObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.intersectionRatio > 0) {
                ebReplaceImagesWithInteractiveIframes(entry.target);
                interactiveFigureObserver.unobserve(entry.target);
            } else {
                console.log('Figure ' + entry.target.id + ' not in view');
            }
        });
    });

    var i;
    for (i = 0; i < interactiveFigures.length; i += 1) {
        interactiveFigureObserver.observe(interactiveFigures[i]);
    }
}

// Go
ebInteractiveFigures();
