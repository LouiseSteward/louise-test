/* jslint browser */
/*global window, MathJax */

// Toggles 'expandable boxes'

console.log('Debugging expandable-box.js');

// Do the toggling
function ebExpandableBoxToggle(event) {
    'use strict';

    if (event.target && event.target.classList.contains('toggle')) {

        // Get the content walking up the tree from the a.toggle
        var expandableBoxBoxContent = event.target.parentNode.parentNode.parentNode.querySelectorAll('h3 ~ *, h4 ~ *, h5 ~ *, h6 ~ *');
        var k;

        if (event.target.classList.contains('closed')) {
            event.target.classList.remove('closed');
            event.target.classList.add('open');
            for (k = 0; k < expandableBoxBoxContent.length; k += 1) {
                expandableBoxBoxContent[k].classList.remove('visuallyhidden');
                console.log('Box opened: ' + expandableBoxBoxContent[k].parentNode.innerText.substring(0, 40).replace(/\s\s+/g, ' ') + '...');
            }
            // Analytics tracking of walk-through box opens
            var expandableBoxH3Heading = event.target.parentNode.parentNode
                                        .parentNode.querySelector("h3 strong")
                                        .childNodes[0].nodeValue.toLowerCase();
            var expandableBoxClassList = event.target.parentNode.parentNode
                                        .parentNode.classList;
            if (expandableBoxH3Heading
                && expandableBoxClassList.contains("walk-through")
                && settings.site.output === "web") {
                    // Call the tracking function from analytics.js
                    ebTrackExpandableBoxOpen(expandableBoxH3Heading);
            }
        } else {
            event.target.classList.remove('open');
            event.target.classList.add('closed');
            for (k = 0; k < expandableBoxBoxContent.length; k += 1) {
                expandableBoxBoxContent[k].classList.add('visuallyhidden');
                console.log('Box closed: ' + expandableBoxBoxContent[k].parentNode.innerText.substring(0, 40).replace(/\s\s+/g, ' ') + '...');
            }
        }
    }
}

// Add toggle button to `.expandable-box strong`
function ebExpandableBoxAddBoxToggle(box) {
    'use strict';

    console.log('Adding box toggle to ' + box.innerText.substring(0, 40).replace(/\s\s+/g, ' ') + '...');

    // Get the h3 strong expandable box header, e.g. 'FIND OUT MORE'
    var boxHeader = box.querySelector('h3 strong, h4 strong, h5 strong, h6 strong');

    // Add the toggle button
    var boxToggleButton = document.createElement('a');
    boxToggleButton.classList.add('toggle', 'closed');

    // Insert the button after the header
    boxHeader.insertAdjacentElement('beforeEnd', boxToggleButton);

    // Listen for clicks on .toggle.
    // Remember that accordion.js is listening for clicks, too,
    // currently on #content a, [data-accordion] (i.e. h2s), and #nav [href].
    boxHeader.querySelector('.toggle').addEventListener('click', ebExpandableBoxToggle, true);

}

// Get all the targets we might link to in expandable bxoes.
// The callback should be a function that does something with those targets.
function ebExpandableBoxTargets() {
    'use strict';

    // Get all the elements with IDs in boxes
    // which do not start with 'MathJax-'
    var targets = document.querySelectorAll('.expandable-box [id]:not([id^="MathJax-"])');

    return targets;
}

// If an element inside a box is targeted, click the toggle
// so that it opens.
function ebExpandableBoxClickContainerBoxToggle(element) {
    'use strict';

    if (element) {

        console.log('Checking if the container of ' + element.id + ' is an expandable box');
        var container = element.parentNode;

        // Stop looking if we're at the document body
        if (container === document.body) {
            return;
        }

        // If the container is an expandable box, click its toggle,
        // otherwise use this function to check the container's container.
        if (container.classList.contains('expandable-box')) {
            console.log('We need to open the box ' + container.querySelector('h2, h3, h4').innerText);
            var toggle = container.querySelector('a.toggle.closed');
            console.log('The toggle is ' + toggle.innerHTML);
            if (toggle) {
                toggle.click();
            }
        } else {
            ebExpandableBoxClickContainerBoxToggle(container);
        }
    }
}

function ebExpandableBoxListenForIncomingLinks() {
    'use strict';

    var targets = ebExpandableBoxTargets();

    targets.forEach(function (target) {
        console.log('Listening for hashchange pointing to this link in an expandable box: ' + target.id);
        target.addEventListener('idTargeted', function () {
            console.log('Element with ID ' + target.id + ' targeted by hashchange.');
            ebExpandableBoxClickContainerBoxToggle(target);
        });
    });
}

// Check the URL for the targets inside boxes
function ebExpandableBoxCheckURLForTargets() {
    'use strict';

    var hashInCurrentURL = window.location.hash.split('#')[1];
    var targets = ebExpandableBoxTargets();

    // If the hash is in our list of targets, expand its box
    var i;
    var targetElement;
    for (i = 0; i < targets.length; i += 1) {
        if (targets[i].id === hashInCurrentURL) {
            targetElement = document.getElementById(hashInCurrentURL);

            console.log('Hash is ' + hashInCurrentURL);
            console.log('We have target ' + targetElement.id);
            console.log('Expand the box for ' + targets[i].id);

            ebExpandableBoxClickContainerBoxToggle(targetElement);
        }
    }
}

// Hide the contents of each box and add toggle
function ebExpandableBoxProcessBoxes() {
    'use strict';

    var expandableBoxBoxes = document.querySelectorAll('.expandable-box');
    var expandableBoxBoxContent;
    var i;
    var j;

    for (i = 0; i < expandableBoxBoxes.length; i += 1) {

        // Hide content
        expandableBoxBoxContent = expandableBoxBoxes[i].querySelectorAll('h3 ~ *, h4 ~ *, h5 ~ *, h6 ~ *');

        for (j = 0; j < expandableBoxBoxContent.length; j += 1) {

            console.log('Hiding ' + expandableBoxBoxContent[j].innerText.substring(0, 40).replace(/\s\s+/g, ' ') + '...');

            expandableBoxBoxContent[j].classList.add('visuallyhidden');

            console.log('Now hidden: ' + expandableBoxBoxContent[j].innerText.substring(0, 40).replace(/\s\s+/g, ' ') + '...');
        }

        // Add the toggle
        ebExpandableBoxAddBoxToggle(expandableBoxBoxes[i]);
    }
}

// If MathJax is running, only run all this once the MathJax is typeset.
// Otherwise, MathJaxDisplay divs will appear after
// the expandable-box contents have been hidden.
if (document.querySelector('script#MathJax, script[type^="text/x-mathjax-config"]')) {
    MathJax.Hub.Register.StartupHook("End", function () {
        'use strict';

        ebExpandableBoxProcessBoxes();
        ebExpandableBoxListenForIncomingLinks();
        window.addEventListener("hashchange", ebExpandableBoxCheckURLForTargets(), false);
    });
} else {
    ebExpandableBoxProcessBoxes();
    ebExpandableBoxListenForIncomingLinks();
    window.addEventListener("hashchange", ebExpandableBoxCheckURLForTargets(), false);
}
