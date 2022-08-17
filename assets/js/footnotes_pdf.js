"use strict";

function ebReferencesPDF() {

    // list the features we use
    // (classList and forEach gave us problems with Prince or Phantom,
    // so we don't use them here)
    var featuresSupported = navigator.userAgent.indexOf('Opera Mini') === -1 &&
            'querySelector' in document;

    // get all the .footnote s
    var footnoteLinks = document.querySelectorAll('.footnote');

    // early exit for unsupported or if there are no footnotes
    if (!featuresSupported || footnoteLinks.length === 0) return;

    // exit if we're in phantom, to avoid duplicate footnote-detail
    if (typeof window.callPhantom === 'function') return;

    // loop through footnotes
    for (var i = 0; i < footnoteLinks.length; i++) {

        // get the target ID
        var targetID = footnoteLinks[i].hash;

        // NOTE: Prince's .hash behaviour is unusual: it strips the # out
        // So, let's use getElementById instead of querySelector
        // If it starts with a hash, chop it out
        if (targetID.indexOf('#') === 0) {
            targetID = targetID.replace('#', '');
        }

        // find the li with the ID from the .footnote's href
        // get the contents
        var targetReference = document.getElementById(targetID);

        // make a div.reference
        var footnoteContainer = document.createElement('div');
        footnoteContainer.className += ' footnote-detail';
        footnoteContainer.id = targetID;

        // get the container element
        var containingElement = footnoteLinks[i].parentNode.parentNode;

        // if it's in a sidenote, put it after
        // otherwise put it before, for print styling reasons
        if (containingElement.parentNode.className.indexOf('sidenote') >= 0) {
            containingElement.appendChild(footnoteContainer);
            // also add class noting where the footnote is
            footnoteContainer.className += ' footnote-detail-after';
        } else {
            containingElement.parentNode
            .insertBefore(footnoteContainer, containingElement);
            // also add class noting where the footnote is
            footnoteContainer.className += ' footnote-detail-before';
        }

        // move the li contents inside the div.reference
        footnoteContainer.innerHTML = targetReference.innerHTML;

        // add a class to the parent
        containingElement.parentNode.className += ' contains-footnote';
    }

    // remove old div.footnotes to avoid duplicate IDs
    var content = document.querySelector('#content');
    var footnotesList = content.querySelector('.footnotes');
    if (content && footnotesList) content.removeChild(footnotesList);
}

ebReferencesPDF();
