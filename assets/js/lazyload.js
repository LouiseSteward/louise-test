// Check for no-accordion setting on page
var ebLazyLoadImagesCheckPageAccordionOff = function() {
    'use strict';

    var pageAccordionOff;

    var accordionPageSetting = document.body.getAttribute('data-accordion-page');
    if (accordionPageSetting &&
            (accordionPageSetting === "none")) {
        pageAccordionOff = true;
    } else {
        pageAccordionOff = false;
    }
    return pageAccordionOff;
}

var ebLazyLoadImages = function(lazyImages) {

    if (!Array.prototype.forEach) return;

    lazyImages.forEach(function(lazyImage) {
        // if there's a noscript before our image, remove it
        var lazySibling = lazyImage.previousElementSibling;
        if(lazyImage.previousElementSibling) {
            if (lazySibling.tagName.toLowerCase() === 'noscript') {
                lazySibling.parentNode.removeChild(lazyImage.previousElementSibling);
            }
        }

        // set the src to data-src, then remove data-src
        var newSrc = lazyImage.getAttribute('data-src');

        // if there's no data-src (e.g. we've already run lazyload) return
        if(!newSrc) return;

        lazyImage.setAttribute('src', newSrc);
        lazyImage.removeAttribute('data-src');

        // if srcset is supported, add it
        if ('srcset' in document.createElement('img') && lazyImage.getAttribute("data-srcset") !== null) {
            var srcset = lazyImage.getAttribute('data-srcset');
            lazyImage.setAttribute('srcset', srcset);
            lazyImage.removeAttribute('data-srcset');
        }
    });
}

if (settings.web.images.lazyload) {
  // if we're not on a unit, lazy load all images
  if('querySelectorAll' in document) {
      var thisIsNotAUnit = (document.querySelector('body').getAttribute('class').indexOf('chapter') === -1);
      var thisHasNoH2s = (document.querySelector('#content h2') === null);
      var thisIsEndmatter = (document.querySelector('body').getAttribute('class').indexOf('endmatter') != -1);
      var thisIsALeibniz = (document.querySelector('body').getAttribute('class').indexOf('leibniz') != -1);
      if (thisIsNotAUnit || thisHasNoH2s || thisIsEndmatter || thisIsALeibniz || ebLazyLoadImagesCheckPageAccordionOff) {
          var lazyImages = document.querySelectorAll('[data-src]');
          ebLazyLoadImages(lazyImages);
      }
  }
  // if there's a chapter-opener-image, lazyload it
  if('querySelectorAll' in document) {
      var chapterOpenerImages = document.querySelectorAll('.chapter-opener-image [data-src]');
      if(chapterOpenerImages) {
          ebLazyLoadImages(chapterOpenerImages);
      }
  }
}
