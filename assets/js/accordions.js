/*jslint browser, for */
/*global window, ebLazyLoadImages, searchTerm, videoShow
    locales, pageLanguage, console, Element, HTMLDocument,
    settings, Node, MutationObserver */

// console.log('Debugging accordions.js');

// --------------------------------------------------------------
// Options, defined in _data/settings.yml
//
// 1. Use CSS selectors to list the headings that will
//    define each accordion section, e.g. '#content h2'
var accordionHeads = '#content .subheadline, ' + '#content ' + settings[settings.site.output].accordion.level;
// 2. Which heading's section should we show by default?
var defaultAccordionHead = '#content .subheadline, ' + '#content ' + settings[settings.site.output].accordion.level;
// 3. Auto close last accordion when you open a new one?
var autoCloseAccordionSections = settings[settings.site.output].accordion.autoClose;
// --------------------------------------------------------------

function ebAccordionInit() {
    'use strict';

    var pageAccordionOff;

    // Check for no-accordion setting on page
    var accordionPageSetting = document.body.getAttribute('data-accordion-page');
    if (accordionPageSetting &&
            (accordionPageSetting === "none")) {
        pageAccordionOff = true;
    }

    // Check if there are any headings on the page
    // to make into an accordion.
    var availableAccordionHeads = document.querySelectorAll(accordionHeads);
    var noAccordionHeadings = false;
    if (!availableAccordionHeads
            || availableAccordionHeads.length === 0) {
        noAccordionHeadings = true;
    }

    return navigator.userAgent.indexOf('Opera Mini') === -1 &&
            document.querySelectorAll !== "undefined" &&
            window.addEventListener !== "undefined" &&
            !!Array.prototype.forEach &&
            !pageAccordionOff &&
            !noAccordionHeadings;
}

function ebAccordionPageSetting() {
    'use strict';

    var accordionPageSetting = document.body.getAttribute('data-accordion-page');
    return accordionPageSetting;
}

function ebAccordionDefaultAccordionHeadID() {
    'use strict';

    var defaultAccordionHeadID;

    // Get the default accordion section's id
    if (defaultAccordionHead !== '') {
        defaultAccordionHeadID = document.querySelector(defaultAccordionHead).id;
        if (!defaultAccordionHeadID) {
            defaultAccordionHeadID = 'defaultAccordionSection';
        }
    }
    return defaultAccordionHeadID;
}

function ebAccordionSetUpSections(collapserButtons) {
    'use strict';

    // Exit if there are no accordionHeads
    if (!document.querySelector(accordionHeads)) {
        return;
    }

    // add role="tablist" to the parent of the role="tab"s
    var content = document.querySelector('#content');
    content.setAttribute('role', 'tablist');

    // loop through collapserButtons
    collapserButtons.forEach(function (collapserButton) {

        // make a section to move the collapsing content into
        var section = document.createElement('section');
        section.setAttribute('role', 'tabpanel');
        section.setAttribute('aria-labelledby', collapserButton.id);
        section.setAttribute('data-accordion-container', collapserButton.id);

        // add the section to the doc
        content.insertBefore(section, collapserButton);


        // make a header, add it to the section
        var header = document.createElement('header');

        //  move the toggle to the header
        header.appendChild(collapserButton);

        // make a link for this id
        var accordionLink = document.createElement('a');
        accordionLink.href = '#' + collapserButton.id;
        accordionLink.innerHTML = collapserButton.innerHTML;

        // Add the link inside the toggle
        collapserButton.innerHTML = accordionLink.outerHTML;
        collapserButton.setAttribute('role', 'tab');

        // add the header to the section
        section.appendChild(header);


        // make a div for the rest of the contents
        var container = document.createElement('div');
        container.setAttribute('data-container', true);

        // add it to the section
        section.appendChild(container);
    });

    ebAccordionFillSections();

    // If there is more than one section,
    // add an 'expand all/close all' button
    if (collapserButtons.length > 1) {
        ebAccordionShowAllButton();
    }
}

function ebAccordionFillSections() {
    'use strict';

    // Grab the individual #contents elements of the page
    var contentItems = document.getElementById('content').childNodes;

    // Put all the items in an array.
    var j, contentItemsForSections = [];
    for (j = 0; j < contentItems.length; j += 1) {
        contentItemsForSections.push(contentItems[j]);
    }

    // We don't know where our first section is yet
    var currentSection = false;

    // Loop through the content to accordify
    contentItemsForSections.forEach(function (contentItem) {

        // If this is an element (not a text or comment node), and
        // if this is a section, update currentSection, then move on
        if (contentItem.nodeType === Node.ELEMENT_NODE) {
            if (contentItem.getAttribute('role') === 'tabpanel') {
                currentSection = contentItem;
                return;
            }
        }

        // Have we reached the first section yet? if not, move on
        if (!currentSection) {
            return;
        }

        // Otherwise, move it inside the currentSection's data-container
        currentSection.querySelector('[data-container]')
            .appendChild(contentItem);
    });
}

function ebMoveThemeKeys() {

    // Theme keys are in a div above the h2 they apply to.
    // when the accordion loads, we want to move the theme-key
    // links to be inline, inside their h2.

    // get the theme keys and the theme key links
    var themeKeys = document.querySelectorAll('.theme-key');
    var themeKeysLinks = document.querySelectorAll('.theme-key a');

    themeKeysLinks.forEach(function(themeKeysLink) {

        // Theme-key spans at the end of a section
        // are inside a div
        // that does NOT have a next sibling.
        // Subheadline theme-key spans are not in a <section>
        // or subheadline div, so their parent para DOES
        // have a next sibling.

        var targetHeading;
        if (themeKeysLink.parentNode.nextElementSibling === null) {
            // this is an end-of-section theme key
            targetHeading = themeKeysLink.closest('section')
                    .nextElementSibling.querySelector('h2');
        } else {
            // this is a subheadline theme key
            targetHeading = themeKeysLink.closest('#content')
                    .querySelector('.subheadline, h2');
        }
        if (targetHeading !== undefined) {
            targetHeading.appendChild(themeKeysLink);
        }
    })

    // remove now empty theme keys divs
    themeKeys.forEach(function(themeKey) {
        themeKey.parentNode.removeChild(themeKey);
    })
}

function ebAccordionHideThisSection(targetID) {
    'use strict';

    console.log('Hiding only section ' + targetID);
    var tabPanel = document.querySelector('[role="tabpanel"][aria-labelledby="' + targetID + '"]');
    tabPanel.querySelector('[role="tab"]')
        .setAttribute('data-accordion', 'closed');
    tabPanel.querySelector('[data-container]')
        .setAttribute('aria-expanded', 'false');
}

function ebAccordionHideAll() {
    'use strict';

    var tabPanels = document.querySelectorAll('[role="tabpanel"]');
    tabPanels.forEach(function (current) {
        current.querySelector('[role="tab"]')
            .setAttribute('data-accordion', 'closed');
        current.querySelector('[data-container]')
            .setAttribute('aria-expanded', 'false');
    });
}

function ebAccordionShowAll() {
    'use strict';

    // console.log('expanding all');

    var tabPanels = document.querySelectorAll('[role="tabpanel"]');
    tabPanels.forEach(function (current) {
        current.querySelector('[role="tab"]')
            .setAttribute('data-accordion', 'open');
        current.querySelector('[data-container]')
            .setAttribute('aria-expanded', 'true');
    });
    // load all of the videos in the chapter
    if (typeof(videoShow) === 'function') {
        videoShow(document);
    }

    // load all of the images in the chapter
    var lazyimages = document.querySelectorAll('[data-srcset]');
    ebLazyLoadImages(lazyimages);
}

function ebAccordionHideAllExceptThisOne(targetID) {
    'use strict';

    // console.log('Starting ebAccordionHideAllExceptThisOne...');

    var tabPanels = document.querySelectorAll('[role="tabpanel"]');
    tabPanels.forEach(function (tabPanel) {
        // if it's the one we just clicked, skip it
        if (tabPanel.getAttribute('aria-labelledby') === targetID) {
            return;
        }

        // otherwise, hide it
        tabPanel.querySelector('[role="tab"]')
            .setAttribute('data-accordion', 'closed');
        tabPanel.querySelector('[data-container]')
            .setAttribute('aria-expanded', 'false');
    });
}

function ebAccordionCheckParent(node) {
    'use strict';

    // if (node !== null) {
    //     console.log('Checking for parent element of "' + node.innerText.substring(0, 20) + '..."');
    // }

    // if there is no parent, or something went wrong, exit
    if (!node) {
        return false;
    }
    if (!node.parentNode) {
        return false;
    }
    if (node.tagName === "BODY") {

        // console.log('Parent node is the body element. We\'re done looking.');

        return false;
    }

    var nodeParent = node.parentNode;

    // console.log('nodeParent is "' + nodeParent.innerText.substring(0, 20) + '..."');

    var parentAttribute = nodeParent.getAttribute('data-accordion-container');

    // if there's a parent, check if it's got data-accordion-container
    // and return that value, which is copied from the id of the section heading
    if (parentAttribute) {
        return nodeParent.getAttribute('data-accordion-container');
    }
    // if (!parentAttribute) {
    //     console.log('Parent node of "' + node.innerText.substring(0, 20) + '..." is not an accordion section');
    // }

    return ebAccordionCheckParent(nodeParent);
}

// find and return containing section
// (the aria-labelledby attribute matches the ID)
function ebAccordionFindSection(targetToCheck) {
    'use strict';

    // if (targetToCheck !== null) {
    //     console.log('Finding section that contains: ' + targetToCheck.outerHTML.substring(0, 80));
    // }

    // work recursively up the DOM looking for the section
    return ebAccordionCheckParent(targetToCheck);
}

function ebWhichTarget(targetID) {
    'use strict';

    // console.log('Starting ebWhichTarget...');

    var targetToCheck;

    // if we're given an ID, use it
    if (targetID) {
        // console.log('Using targetID ' + targetID);

        // Decode the targetID URI in case it's not ASCII
        // console.log('targetID encoded: ' + targetID);
        targetID = decodeURIComponent(targetID);
        // console.log('targetID decoded: ' + targetID);

        targetToCheck = document.getElementById(targetID);
    } else {
        // else use the hash
        var trimmedHash = window.location.hash.replace('#', '');

        // Decode the trimmedHash in case it's not ASCII
        // console.log('Using trimmedHash; encoded: ' + trimmedHash);
        trimmedHash = decodeURIComponent(trimmedHash);
        // console.log('using trimmedHash; decoded: ' + trimmedHash);

        targetToCheck = document.getElementById(trimmedHash);
    }


    // if the ID doesn't exist, exit
    if (!targetToCheck) {
        return false;
    }

    return targetToCheck;
}

function ebAccordionShow(targetID) {
    'use strict';

    // console.log('Starting ebAccordionShow...');
    // console.log('ebAccordionShow\'s targetID is: ' + targetID);

    var targetToCheck = ebWhichTarget(targetID);
    if (!targetToCheck) {
        return;
    }

    var sectionID = ebAccordionFindSection(targetToCheck);
    // If we are not linking to a section or something inside it,
    // show the default section
    if (!sectionID) {
        ebAccordionShowDefaultSection();
    }

    // set the accordion, then work down to toggle and content div
    var sectionTarget = '[aria-labelledby="' + sectionID + '"]';
    var sectionToShow = document.querySelector(sectionTarget);

    // update the tab
    if (sectionToShow) {
        var tab = sectionToShow.querySelector('[role="tab"]');
        tab.setAttribute('data-accordion', 'open');

        // update the tab contents
        var tabContents = sectionToShow.querySelector('[data-container]');
        tabContents.setAttribute('aria-expanded', 'true');

        // lazyload the images inside
        var lazyimages = sectionToShow.querySelectorAll('[data-src]');

        // console.log('lazyimages: ' + lazyimages.innerHTML);

        if (lazyimages.innerHTML !== undefined) {
            ebLazyLoadImages(lazyimages);
        }

        // if we have a slideline in this section, check if it's a portrait one
        var slidelinesInThisSection = sectionToShow.querySelectorAll('.slides');

        slidelinesInThisSection.forEach(function (slidelineInThisSection) {
            var firstFigureImg = slidelineInThisSection.querySelector('.figure img');

            if (firstFigureImg) {
                firstFigureImg.addEventListener('load', function () {
                    var portraitSlideline = (firstFigureImg.height > firstFigureImg.width);
                    if (portraitSlideline) {
                        slidelineInThisSection.querySelector('nav').classList.add('nav-slides-portrait');
                    }
                });
            }
        });

        if (typeof(videoShow) === 'function') {
            videoShow(sectionToShow);
        }
    }

}

function ebAccordionListenForAnchorClicks(querySelectorString) {
    'use strict';

    // console.log('Starting ebAccordionListenForAnchorClicks...');

    // listen for clicks on *all* the anchors in #content by default
    var allTheAnchors;
    if (querySelectorString) {
        allTheAnchors = document.querySelectorAll(querySelectorString);
    } else {
        allTheAnchors = document.querySelectorAll('#content a');
    }

    allTheAnchors.forEach(function (oneOfTheAnchors) {

        // if it's an external link, exit
        if (oneOfTheAnchors.target === '_blank') {
            return;
        }

        oneOfTheAnchors.addEventListener("click", function (event) {

            event.stopPropagation();

            // If the link was clicked with a modifier key pressed
            // (e.g. Ctrl + click), assume user wants a new tab,
            // and do not continue processing this here.
            if (event.metaKey || event.ctrlKey || event.shiftKey) {
                console.log('User was pressing Ctrl, Shift or the meta key.');
                return;
            }

            // Declare targetID so JSLint knows it's coming in this function.
            var targetID;

            // ignore target blank / rel noopener links
            if (event.currentTarget.getAttribute('rel') === 'noopener') {
                return;
            }

            // get the target ID by removing any file path and the #
            if (event.currentTarget.hasAttribute('href')) {
                targetID = event.currentTarget.getAttribute('href').replace(/\?.+/, '').replace(/.*#/, '');
                console.log('The targetID is: ' + targetID);
            } else {
                return;
            }
            // if it's an open accordion, close it
            if (event.currentTarget.parentNode.getAttribute('data-accordion') === 'open') {
                event.preventDefault();
                ebAccordionHideThisSection(targetID);
                return;
            }

            // did we click on a thing that wasn't an accordion?
            // which section / accordion is it inside?
            if (!event.currentTarget.parentNode.getAttribute('data-accordion')) {

                console.log('We clicked on something that is not an accordion. Now to find targetID ' + targetID + ' in the DOM...');

                // find the target of the link in the DOM
                var targetOfLink = document.getElementById(targetID);
                // recursively update targetID until we have a data-accordion
                targetID = ebAccordionFindSection(targetOfLink);
            }

            // now open the right closed accordion
            ebAccordionShow(targetID);
            if (autoCloseAccordionSections === true) {
                ebAccordionHideAllExceptThisOne(targetID);
            }
        });
    });
}

function ebAccordionListenForHeadingClicks() {
    'use strict';

    // also listen for heading clicks
    var allTheToggleHeaders = document.querySelectorAll('[data-accordion]');
    allTheToggleHeaders.forEach(function (oneOfTheToggleHeaders) {
        oneOfTheToggleHeaders.addEventListener("click", function () {
            // simulate anchor click
            event.target.querySelector('a').click();
        });
    });
}

function ebAccordionListenForNavClicks() {
    'use strict';

    // also listen for nav clicks
    var navLinks = document.querySelectorAll('#nav [href]');
    navLinks.forEach(function (navLink) {
        navLink.addEventListener("click", function () {
            // get the section and click to open it if it's closed
            var theSection = document.getElementById(event.target.hash.replace(/.*#/, ''));
            // simulate anchor click, if it's closed
            if (theSection) {
                if (theSection.getAttribute('data-accordion') === 'closed') {
                    theSection.querySelector('a').click();
                }
            }
        });
    });
}

function ebAccordionListenForHashChange() {
    'use strict';

    // console.log('Starting ebAccordionListenForHashChange...');

    window.addEventListener("hashchange", function (event) {

        // Don't treat this like a normal click on a link
        event.preventDefault();

        // get the target ID from the hash,
        // removing any query parameters
        var targetID = window.location.hash.replace(/\?.+/, '');
        // console.log('targetID encoded: ' + targetID);

        targetID = decodeURIComponent(targetID);
        // console.log('targetID decoded: ' + targetID);

        // get the target of the link
        var targetOfLink = document.getElementById(targetID.replace(/.*#/, ''));
        // console.log('targetOfLink: ' + targetOfLink.innerHTML);

        // check if it's in the viewport already
        var targetRect = targetOfLink.getBoundingClientRect();
        var targetInViewport = targetRect.top >= -targetRect.height
                && targetRect.left >= -targetRect.width
                && targetRect.bottom <= targetRect.height + window.innerHeight
                && targetRect.right <= targetRect.width + window.innerWidth;
        // console.log('targetInViewport of ' + targetOfLink + ": " + targetInViewport);

        // check if it's an accordion
        var targetAccordionStatus = targetOfLink.getAttribute('data-accordion');
        // console.log('targetAccordionStatus: ' + targetAccordionStatus);

        // if it's in the viewport and it's not an accordion, then exit
        if (targetInViewport && !targetAccordionStatus) {
            return;
        }

        // if it's an accordion and it's closed, open it / jump to it
        if (targetAccordionStatus === 'closed') {
            targetOfLink.querySelector('a').click();
            return;
        }

        // otherwise, open the appropriate accordion
        var targetAccordionID = ebAccordionFindSection(targetOfLink);

        ebAccordionShow(targetAccordionID);
        if (autoCloseAccordionSections === true) {
            console.log('Hiding other sections...');
            ebAccordionHideAllExceptThisOne(targetAccordionID);
        }
    });
}

// Remove theme filter to show all sections
function ebAccordionFilterRemove(callback) {
    'use strict';

    // Remove active filters
    var themeFilterButtonsActive = document.querySelectorAll('.theme-legend-filter-button-active');
    var i;
    for (i = 0; i < themeFilterButtonsActive.length; i += 1) {
        console.log('Removing active status from ' + themeFilterButtonsActive[i].outerHTML);
        themeFilterButtonsActive[i].classList.remove('theme-legend-filter-button-active');
    };

    // Show hidden sections
    var sections = document.querySelectorAll('section[role="tabpanel"]');
    var j;
    for (j = 0; j < sections.length; j += 1) {
        sections[j].style.display = 'block';
    };

    // Call the callback function if there is one,
    // e.g. applying a new filter.
    if (callback) {
        return callback();
    };
}

// Hide sections that don't contain a given theme number
function ebAccordionFilter(themeFilterButton, themeNumber) {
    'use strict';

    // Check if we're clicking on the active filter,
    // in which case show all (i.e. remove the filtering)
    var themeFilterButtonIsActive = themeFilterButton.classList.contains('theme-legend-filter-button-active');
    if (themeFilterButtonIsActive) {
        ebAccordionFilterRemove();
        return;
    }

    // Remove any previous filter, and on callback,
    // apply the theme filter.
    ebAccordionFilterRemove(function () {
        console.log('Filtering for theme number ' + themeNumber);

        // Mark the filter button
        themeFilterButton.classList.add('theme-legend-filter-button-active');

        // Hide all sections that don't contain the themeNumber
        var sections = document.querySelectorAll('section[role="tabpanel"]');
        var themeNumberClass = 'theme-key-' + themeNumber;
        var i;
        for (i = 0; i < sections.length; i += 1) {
            if (sections[i].querySelector('a.' + themeNumberClass)) {
                console.log('Section contains theme ' + themeNumber);
            } else {
                sections[i].style.display = 'none';
            }
        }
    });

}

// Add an event listener to a filter button
function ebAccordionFilterListenForFilterClicks(themeFilterButton, themeFilterNumber) {
    themeFilterButton.addEventListener('click', function() {
        ebAccordionFilter(themeFilterButton, themeFilterNumber);
    });
    themeFilterButton.addEventListener('keydown', function(event) {
        if (event.key === "Enter") {
            ebAccordionFilter(themeFilterButton, themeFilterNumber);
        }
    });
}

// Listen for clicks on theme filters
function ebAccordionFilterAddListeners() {
    'use strict';
    var themeFilterButtons = document.querySelectorAll('[data-theme-filter]');

    themeFilterButtons.forEach(function(themeFilterButton) {
        var themeFilterNumber = themeFilterButton.getAttribute('data-theme-filter');
        console.log('Listening for clicks on ' + themeFilterButton + ' for theme number ' + themeFilterNumber);
        ebAccordionFilterListenForFilterClicks(themeFilterButton, themeFilterNumber);
    });
}

// Add a filter button to each theme in the theme legend
function ebAccordionFilterButtons() {
    'use strict';
    var themeLegendItems = document.querySelectorAll('.chapter .theme-legend li');
    var i;
    var button;
    for (i = 0; i < themeLegendItems.length; i += 1) {

        // Get the theme number, which is a number at the end of the classlist
        var themeNumber = themeLegendItems[i].className.match(/\d+/);

        // Create the button
        button = '';
        button = document.createElement('a');
        button.classList.add('theme-legend-filter-button');
        button.setAttribute('data-theme-filter', themeNumber);
        button.setAttribute("tabindex", 0);
        themeLegendItems[i].insertAdjacentElement('afterbegin', button);
    };

    // Filter when clicked
    ebAccordionFilterAddListeners();
}

function ebAccordionShowDefaultSection() {
    'use strict';
    ebAccordionHideAllExceptThisOne(ebAccordionDefaultAccordionHeadID());
    ebAccordionShow(ebAccordionDefaultAccordionHeadID());
}

// Add a close-all button to close all sections
function ebAccordionCloseAllButton() {
    'use strict';
    var button = document.querySelector('.accordion-show-all-button');
    button.innerHTML = locales[pageLanguage].accordion['close-all'];

    // Close all when clicked
    button.addEventListener('click', function () {
        ebAccordionHideAll();
        ebAccordionShowAllButton();
    });
}

// Add an expand-all button to open all sections
function ebAccordionShowAllButton() {
    'use strict';

    var button;
    if (document.querySelector('.accordion-show-all-button')) {
        button = document.querySelector('.accordion-show-all-button');
        button.innerHTML = locales[pageLanguage].accordion['show-all'];
    } else {

        var firstSection = document.querySelector(defaultAccordionHead);
        if (firstSection) {
            // Create a wrapper for the button
            var buttonWrapper = document.createElement('div');
            buttonWrapper.classList.add('accordion-show-all-button-wrapper');
            firstSection.insertAdjacentElement('beforebegin', buttonWrapper);

            // Create the button link
            button = document.createElement('a');
            button.classList.add('accordion-show-all-button');
            button.innerHTML = locales[pageLanguage].accordion['show-all'];
            buttonWrapper.insertAdjacentElement('afterbegin', button);
        }
    }

    if (button instanceof Element || button instanceof HTMLDocument) {
        // Show all when clicked
        button.addEventListener('click', function () {
            ebAccordionShowAll();
            ebAccordionCloseAllButton();
        });
    }
}

function ebAccordify() {
    'use strict';

    // Signal that we're loading the accordion
    document.body.setAttribute('data-accordion-active', 'true');

    // exit if there aren't any headings
    var collapserTargets = accordionHeads;
    var collapserButtons = document.querySelectorAll(collapserTargets);
    if (!collapserButtons) {
        return;
    }

    // exit if this isn't a chapter
    var thisIsNotAChapter = (document.querySelector('body').getAttribute('class').indexOf('chapter') === -1);
    var thisHasNoH2s = (document.querySelector(accordionHeads) === null);
    var thisIsEndmatter = (document.querySelector('body').getAttribute('class').indexOf('endmatter') !== -1);
    if (thisIsNotAChapter || thisHasNoH2s || thisIsEndmatter) {
        return;
    }

    ebAccordionSetUpSections(collapserButtons);
    ebMoveThemeKeys();

    if (searchTerm) {
        // loop through sections
        var accordionSections = document.querySelectorAll('section[data-accordion-container]');
        accordionSections.forEach(function (accordionSection) {

            // check for any markjs marks
            var searchTermsInSection = accordionSection.querySelectorAll('[data-markjs]');
            var numberOfSearchTermsInSection = searchTermsInSection.length;

            // mark the sections that have the search term inside
            if (!!numberOfSearchTermsInSection) {
                var sectionHeaderLink = accordionSection.querySelector('header a');
                sectionHeaderLink.innerHTML = '<mark>' + sectionHeaderLink.innerHTML + '</mark>';

                // add a mini-summary paragraph
                var searchResultsMiniSummary = document.createElement('p');
                searchResultsMiniSummary.innerHTML = numberOfSearchTermsInSection + ' search results for ' + '"<mark>' + searchTerm + '</mark>"';
                accordionSection.querySelector('header').appendChild(searchResultsMiniSummary);
            }
        });
    }

    // if there's no hash, show the first section
    // else (there is a hash, so) show that section
    if (!window.location.hash) {
        ebAccordionShowDefaultSection();
        return;
    }

    ebAccordionHideAll();
    ebAccordionShow();
}

function ebExpand() {
    'use strict';

    // Check for expand-accordion setting on page
    if (ebAccordionPageSetting() === "expand") {
        ebAccordionShowAll();
    }
}

function ebLoadAccordion() {
    'use strict';
    if (ebAccordionInit()) {
        ebAccordify();
        ebExpand();
        ebAccordionListenForAnchorClicks();
        ebAccordionListenForHeadingClicks();
        ebAccordionListenForNavClicks();
        ebAccordionListenForHashChange();
        ebAccordionFilterButtons();
    }
}

// Wait for data-index-targets to be loaded
// and IDs to be assigned
// before applying the accordion.
function ebPrepareForAccordion() {
    'use strict';

    var accordionObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === "attributes") {
                if (document.body.getAttribute('data-accordion-active') !== 'true'
                        && document.body.getAttribute('data-index-targets')
                        && document.body.getAttribute('data-ids-assigned')) {
                    ebLoadAccordion();
                }
            }
        });
    });

    accordionObserver.observe(document.body, {
        attributes: true // listen for attribute changes
    });
}

window.onload = ebPrepareForAccordion();
