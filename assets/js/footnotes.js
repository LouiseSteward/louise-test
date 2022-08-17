"use strict";

function ebReferences() {

    // list the features we use
    var featuresSupported = navigator.userAgent.indexOf('Opera Mini') === -1 &&
            'querySelector' in document &&
            'addEventListener' in window &&
            !!Array.prototype.forEach;

    // get all the .footnote s
    var footnoteLinks = document.querySelectorAll('.footnote');

    // early exit for unsupported or if there are no footnotes
    if (!featuresSupported || footnoteLinks.length === 0) return;

    // loop through footnotes
    footnoteLinks.forEach(function(current) {

        // get the target ID
        var targetHash = current.hash;
        var targetID = current.hash.replace('#', '');

        // escape it with double backslashes, for querySelector
        var sanitisedTargetHash = targetHash.replace(':', '\\:');

        // find the li with the ID from the .footnote's href
        var targetReference = document.querySelector(sanitisedTargetHash);

        // make a div.reference
        var footnoteContainer = document.createElement('div');
        footnoteContainer.classList.add('footnote-detail');
        footnoteContainer.classList.add('visuallyhidden');
        footnoteContainer.setAttribute('data-bookmarkable', 'no');
        footnoteContainer.id = 'inline-' + targetID;

        // the a, up to the sup
        var theSup = current.parentNode;
        var theContainingElement = current.parentNode.parentNode;

        // add the reference div
        theContainingElement.appendChild(footnoteContainer);

        // move the li contents inside the div.reference
        footnoteContainer.innerHTML = targetReference.innerHTML;

        // now that we have duplicated the contents of the footnote, remove the
        // duplicated ID to improve accessibility
        var footnoteElements = footnoteContainer.querySelectorAll("[id]");
        footnoteElements.forEach(function (element) {
            if (element.getAttribute("id")) {
                element.removeAttribute("id");
            }
        });

        // The superscript is given role=doc-noteref by kramdown, but this needs
        // to be moved to the a inside the sup for accessibility
        if (theSup.getAttribute("role", "doc-noteref") &&
            theSup.querySelector("a")) {
                theSup.removeAttribute("role", "doc-noteref");
                var superscriptAnchor = theSup.querySelector("a");
                superscriptAnchor.setAttribute("role", "doc-noteref");
            }

        // show on hover
        theSup.addEventListener('mouseover', function(ev) {
            if (ev.target.classList.contains('footnote')) {
                footnoteContainer.classList.remove('visuallyhidden');
            }
        });
        // Make superscript keyboard focusable
        theSup.setAttribute("tabindex", 0);
        // Make contents of footnote not keyboard focusable initially
        var tabbableElements = footnoteContainer.querySelectorAll("a");
        tabbableElements.forEach(function(el) {
            el.setAttribute("tabindex", "-1");
        });
        
        // Open footnote when focused and Enter is pressed
        theSup.addEventListener('keydown', function(ev) {
            if (ev.key === "Enter") {
                footnoteContainer.classList.toggle('visuallyhidden');
                tabbableElements.forEach(function(el) {
                    el.removeAttribute("tabindex");
                });
            }
        });

        // add a class to the parent
        theContainingElement.parentNode.classList.add('contains-footnote');

        // if we mouseleave footnoteContainer, hide it
        // (mouseout also fires on mouseout of children, so we use mouseleave)
        footnoteContainer.addEventListener('mouseleave', function(ev) {
            if(ev.target === this) {
                setTimeout(function() {
                    footnoteContainer.classList.add('visuallyhidden');
                }, 1000);
            }
        });
        // Close footnote if Esc key is pressed
        window.addEventListener("keydown", function (event) {
            if (event.key === "Escape"
                && !footnoteContainer.classList.contains("visuallyhidden")) {
                footnoteContainer.classList.add("visuallyhidden");
                tabbableElements.forEach(function(el) {
                    el.setAttribute("tabindex", "-1");
                });
            }
        });

        // Clicking on the reverseFootnote link closes the footnote
        var reverseFootnote = footnoteContainer.querySelector('.reversefootnote');

        // remove the contents since we're using
        // CSS and :before to show a close button marker
        reverseFootnote.innerText = "";

        // Add hidden link text for screen readers
        var closeFootnoteLabel = document.createElement("span");
        closeFootnoteLabel.classList.add("visuallyhidden");
        closeFootnoteLabel.innerText = locales[pageLanguage].footnotes['close-footnote'];
        reverseFootnote.appendChild(closeFootnoteLabel);

        reverseFootnote.addEventListener('click', function(ev) {
            ev.preventDefault();
            footnoteContainer.classList.add('visuallyhidden');
        });

        // remove the href to avoiding jumping down the page
        current.removeAttribute('href');

    });

    // Format the footnotes at the bottom of the page
    var footnoteItems = document.querySelectorAll(".footnotes a.reversefootnote");
    var reverseFootnoteAlt = locales[pageLanguage].footnotes['reversefootnote-alt'];

    // Need a relative path to root, to find assets/images in web and app output
    // Default location is two levels away from root
    var pathToRoot = "../../";
    // If we are in a translation, we need another folder level
    var languageList = metadata.languages;
    languageList.forEach(function (language) {
        if (window.location.href.includes("/" + language + "/text")) {
            pathToRoot = "../../../";
        }
    });

    footnoteItems.forEach(function(reverseFootnoteLink) {
        var reversefootnoteArrow = document.createElement("img");
        reversefootnoteArrow.setAttribute(
            "src",
            pathToRoot + "assets/images/reversefootnote-arrow.svg"
        );
        reversefootnoteArrow.setAttribute("alt", reverseFootnoteAlt);
        reverseFootnoteLink.innerHTML = "";
        reverseFootnoteLink.appendChild(reversefootnoteArrow);
        // Add a tooltip to the reversefootnote link
        reverseFootnoteLink.setAttribute("title", reverseFootnoteAlt);
    })

    // role=doc-endnotes is automatically added to the footnote div by kramdown,
    // but it needs to be moved down into the ol for accessibility

    var footnoteDiv = document.querySelector("div.footnotes");
    if (footnoteDiv.getAttribute("role", "doc-endnotes") &&
        footnoteDiv.querySelector("ol")) {
            footnoteDiv.removeAttribute("role", "doc-endnotes");
            var footnoteOL = footnoteDiv.querySelector("ol");
            footnoteOL.setAttribute("role", "doc-endnotes");
    }
}

ebReferences();
