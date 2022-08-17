/*jslint browser */
/*globals anchors, pageLanguage, locales */

// Set the options for anchor.min.js,
// which is laoded before this file.
// See https://www.bryanbraun.com/anchorjs/

// Set options
anchors.options = {
    placement: 'right',   // 'left' disappears outside viewport
    visible: 'always',    // users should see that this is available
    icon: locales[pageLanguage].links['anchor-link']
};

// Add anchors to these elements
anchors.add('#content h2, #content h3');
