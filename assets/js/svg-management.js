/*jslint browser*/
/*globals SVGInject */

// This script helps get sensible SVGs into our pages.
// It first injects all SVGs linked as img tags
// into the code of the page itself, so that they
// have access to the page's CSS. This is mostly for fonts.
// Since some SVG styles use different font names
// to the ones in the site's global CSS, this script also
// replaces font names and related attributes in injected SVGs.

// Change font-family names in style attributes
function ebSVGFontFixes(svg) {
    'use strict';

    // Get the elements in the SVG with font-family set
    var ebFontFixElements = svg.querySelectorAll('[font-family], [style]');

    // What fonts do we want to change the names of?
    // Optionally add a new font-weight, e.g. for 'OpenSans-Bold',
    // which should be Open Sans with a bold weight.
    var fontsToChange = [
        {
            oldFontFace: 'OpenSans-Regular',
            newFontFace: 'Open Sans'
        },
        {
            oldFontFace: 'OpenSans-Bold',
            newFontFace: 'Open Sans',
            newFontWeight: 'bold'
        },
        {
            oldFontFace: 'Asap-Medium',
            newFontFace: 'Asap',
            newFontWeight: '600'
        },
        {
            oldFontFace: 'Asap-Regular',
            newFontFace: 'Asap',
        },
        {
            oldFontFace: 'Asap-MediumItalic',
            newFontFace: 'Asap',
            newFontWeight: '600',
            newFontStyle: 'italic'
        },
        {
            oldFontFace: 'Asap-Italic',
            newFontFace: 'Asap',
            newFontStyle: 'italic'
        },
        {
            oldFontFace: 'Asap-Bold',
            newFontFace: 'Asap',
            newFontWeight: 'bold'
        },
        {
            oldFontFace: 'SourceSansPro-Regular',
            newFontFace: 'Source Sans Pro',
            newFontWeight: '400',
        },
        {
            oldFontFace: 'SourceSansPro-Semibold',
            newFontFace: 'Source Sans Pro',
            newFontWeight: '600',
        },
        {
            oldFontFace: 'SourceSansPro-Bold',
            newFontFace: 'Source Sans Pro',
            newFontWeight: '700',
        },
    ];

    // Loop through the elements, making all the font changes
    // that we've listed above.
    var i, j;
    for (i = 0; i < ebFontFixElements.length; i += 1) {
        for (j = 0; j < fontsToChange.length; j += 1) {

            // Change font-family attributes
            if (ebFontFixElements[i].getAttribute('font-family')
                    === fontsToChange[j].oldFontFace) {
                ebFontFixElements[i].setAttribute('font-family',
                        fontsToChange[j].newFontFace);
                if (fontsToChange[j].newFontWeight) {
                    ebFontFixElements[i].setAttribute('font-weight',
                            fontsToChange[j].newFontWeight);
                }
                if (fontsToChange[j].newFontStyle) {
                    ebFontFixElements[i].setAttribute('font-style',
                            fontsToChange[j].newFontStyle);
                }
            }

            // Change font properties in style attributes
            if (ebFontFixElements[i].style.fontFamily === fontsToChange[j].oldFontFace) {
                ebFontFixElements[i].style.fontFamily = fontsToChange[j].newFontFace;
                if (ebFontFixElements[i].style.fontWeight || fontsToChange[j].newFontWeight) {
                    ebFontFixElements[i].style.fontWeight = fontsToChange[j].newFontWeight;
                }
                if (ebFontFixElements[i].style.fontStyle || fontsToChange[j].newFontStyle) {
                    ebFontFixElements[i].style.fontStyle = fontsToChange[j].newFontStyle;
                }
            }
        }
    }
}

// SVGInject options (https://github.com/iconfu/svg-inject#svginject)
// - run the font fixes after injecting SVGs
SVGInject.setOptions({
    afterLoad: function (svg) {
        'use strict';
        ebSVGFontFixes(svg);
    }
});

// Run svg-inject.min.js on all images
// that have an 'inject-svg' class.
function ebInjectSVGs() {
    'use strict';
    var ebSVGsToInject = document.querySelectorAll('img.inject-svg');
    var i;
    for (i = 0; i < ebSVGsToInject.length; i += 1) {
        SVGInject(ebSVGsToInject[i]);
    }
}

// Go
ebInjectSVGs();
