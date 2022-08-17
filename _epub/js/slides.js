"use strict";

console.log('Debugging slides.js');

var ebSlideSupports = function() {
    return navigator.userAgent.indexOf('Opera Mini') === -1 &&
        'querySelector' in document &&
        'addEventListener' in window &&
        'onhashchange' in window &&
        !!Array.prototype.forEach &&
        document.querySelectorAll('.slides');
}

var ebSlidesMoveSummaryMeta = function(slidelines) {

    console.log('Moving summary meta for each slide...');

    slidelines.forEach(function(slideline) {

        var summary = slideline.querySelector('.summary');

        // get the summary's .caption and .figure-source
        var summaryCaption = summary.querySelector('.caption'),
            summaryFigureSource = summary.querySelector('.figure-source');

        // create a new div to put them in
        var summaryMeta = document.createElement('div');
            summaryMeta.classList.add('figure-summary-meta');

        // If they exist, move them both to after the slideline
        // (To put the caption and source somewhere else,
        // move them using insertAdjacentHTML, which takes
        // beforebegin, afterbegin, beforeend, or afterend as params.)
        if (summaryCaption != null) {
            summaryMeta.insertAdjacentHTML('beforeend', summaryCaption.outerHTML);
        }
        if (summaryFigureSource != null) {
            summaryMeta.insertAdjacentHTML('beforeend', summaryFigureSource.outerHTML);
        }

        // Put the summary meta at the end of the slideline
        slideline.insertAdjacentHTML('beforeend', summaryMeta.outerHTML);

        // add the summary id to the slideline
        slideline.id = summary.id;

        // remove the summary figure
        slideline.removeChild(summary);
    })
}

function ebTruncateText(text, maxLength) {
    var string = text;
    if (string.length > maxLength) {
        string = string.substring(0, maxLength) + "…";
    }
    return string;
}

var ebSlidesBuildNav = function(slidelines) {
    slidelines.forEach(function(slideline){

        // get all the figures
        var figures = slideline.querySelectorAll('.figure'),
        figuresCount = figures.length;

        // make the slide nav
        var slideNavigationInsert = '';
        slideNavigationInsert += '<nav class="nav-slides';
        if (figuresCount > 4) {
            slideNavigationInsert += ' nav-slides-many';
            if (figuresCount > 6) {
                slideNavigationInsert += ' nav-slides-many-many';
            }
        }
        slideNavigationInsert += '">';


        slideNavigationInsert += '<ol>';

        figures.forEach(function(figure) {
            slideNavigationInsert += '<li>'
            slideNavigationInsert += '<a href="#' + figure.id + '">';

            // add thumbnail

            // if no image, use the figure title
            if (figure.querySelector('.figure-images img')) {
                console.log('Adding thumbnail image for ' + figure.querySelector('.figure-reference').innerText);
                var thumb = figure.querySelector('.figure-images img').cloneNode();
                console.log('Thumbnail image found for ' + figure.querySelector('.figure-reference').innerText);
                thumb.removeAttribute('srcset');
                thumb.removeAttribute('sizes');
                thumb.setAttribute('alt', '');
                slideNavigationInsert += thumb.outerHTML;
            } else {
                console.log('Adding thumbnail image for ' + figure.querySelector('.figure-reference').innerText);
                var thumbText = figure.querySelector('.figure-body .title').innerText;
                console.log('Thumbnail text found for ' + figure.querySelector('.figure-reference').innerText + ': "' + thumbText + '"');
                thumbText = ebTruncateText(thumbText, 8);
                slideNavigationInsert += '<span class="slide-thumbnail-text">';
                slideNavigationInsert += thumbText;
                slideNavigationInsert += '</span>';
            }

            slideNavigationInsert += '</a>';
            slideNavigationInsert += '</li>';
        });

        slideNavigationInsert += '</ol>';
        slideNavigationInsert += '</nav>';

        slideline.insertAdjacentHTML('afterbegin', slideNavigationInsert);
    });
}

var ebResetSlides = function(slidelines) {
    slidelines.forEach(function(slideline){

        // get all the figures, hide them
        var figures = slideline.querySelectorAll('.figure');

        figures.forEach(function(slideline) {
            slideline.classList.add('visuallyhidden');
        });

        // get the slide nav items, hide them
        var slideNavItems = slideline.previousElementSibling.querySelectorAll('.nav-slides li');
        slideNavItems.forEach(function(slideline) {
            slideline.classList.remove('slide-current');
        })

    });
}

var ebSlidesShowFirstInSlideline = function(slideline) {
    // find the first figure and show it
    var figures = slideline.querySelectorAll('.figure');
    figures[0].classList.remove('visuallyhidden');
}

var ebSlidesShowFirst = function(slidelines) {
    slidelines.forEach(function(slideline){
        ebSlidesShowFirstInSlideline(slideline);
    });
}

var ebSlidesMarkNavUpToCurrent = function(slideline) {
    var navItems = slideline.querySelectorAll('.nav-slides li'),
        hitCurrent = false;

    navItems.forEach(function(navItem) {
        if (hitCurrent) return;

        if(navItem.classList.contains('slide-current')) {
            hitCurrent = true;
            return;
        }

        navItem.classList.add('slide-current');
    });

}

var ebSlidesShow = function(slidelines) {

    // check for hash
    if(!window.location.hash) {
        ebSlidesShowFirst(slidelines);
        return;
    }

    var sanitisedTargetHash = decodeURIComponent(window.location.hash.replace(':', '\\:'));
    // check if it starts with a number, after the #
    // (which means querySelector(sanitisedTargetHash) will return an error)
    if (!isNaN(sanitisedTargetHash[1])) {
        ebSlidesShowFirst(slidelines);
        return;
    }

    slidelines.forEach(function(slideline) {
        // check if hash is in this slideline
        if (!slideline.querySelector(sanitisedTargetHash)) {
            ebSlidesShowFirstInSlideline(slideline);
            return;
        }

        // show the target slideline
        slideline.querySelector(sanitisedTargetHash)
               .classList.remove('visuallyhidden');

        // reset the slide-current
        slideline.querySelectorAll('.nav-slides li').forEach(function(navItem) {
            navItem.classList.remove('slide-current');
        });

        // mark the current one with slide-current
        var selector = '.nav-slides [href="' + sanitisedTargetHash + '"]';
        var targetLinkElement = slideline.querySelector(selector);
        targetLinkElement.setAttribute('tabindex', 0);
        targetLinkElement.focus();

        var targetParent = targetLinkElement.parentNode;
        targetParent.classList.add('slide-current');

        // mark all the ones up to the current one
        ebSlidesMarkNavUpToCurrent(slideline);
    });
}

var ebSlidesKeyDown = function() {
    // listen for key movements
    window.addEventListener("keydown", function(ev) {
        var keyCode = ev.key || ev.which,
            clickedElement = ev.target || ev.srcElement;

        if (document.querySelector('.slides ' + clickedElement.hash)) {
            if ((keyCode === 'ArrowLeft'
                 || keyCode === 37
                 || keyCode === 'ArrowUp'
                 || keyCode === 38) &&
                clickedElement.parentNode.previousElementSibling) {
                ev.preventDefault();
                clickedElement.parentNode.previousElementSibling
                  .querySelector('a').click();
            } else if ((keyCode === 'ArrowRight'
                        || keyCode === 39
                        || keyCode === 'ArrowDown'
                        || keyCode === '40') &&
                        clickedElement.parentNode.nextElementSibling) {
                ev.preventDefault();
                clickedElement.parentNode.nextElementSibling
                  .querySelector('a').click()
            }
        }
    });
}

var ebSlidesAlreadyShown = function() {
    // get all the nav slide links
    var navSlides = document.querySelectorAll('.nav-slides a');

    navSlides.forEach(function(navSlide) {
        // list for clicks on each nav slide link
        navSlide.addEventListener('click',function(ev) {

            var itsCurrentlyHidden = document.querySelector(this.getAttribute('href')).classList.contains('visuallyhidden')

            // if it's currently shown, stop the anchor's jump
            if(!itsCurrentlyHidden) {
                ev.preventDefault();
            }
        })
    });
}

var ebSlides = function() {
    if (!ebSlideSupports()) return;

    // get all the slidelines
    var slidelines = document.querySelectorAll('.slides');

    // move the summary meta
    ebSlidesMoveSummaryMeta(slidelines);

    // build the nav
    ebSlidesBuildNav(slidelines);

    // get, then hide, the figures and slide nav items
    ebResetSlides(slidelines);

    // show slide from hash
    ebSlidesShow(slidelines);

    // prevent jump when clicking already shown slides
    ebSlidesAlreadyShown();

    // listen for hashchanges
    window.addEventListener("hashchange", function() {
        // get, then hide, the figures and slide nav items
        ebResetSlides(slidelines);

        // show slide from hash
        ebSlidesShow(slidelines);
    });

    // listen for keys
    ebSlidesKeyDown();
}

ebSlides();
