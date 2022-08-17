/* jslint browser*/
/*globals window */

// On Safari, bfcache does not store the page state
// as well as Firefox. In particular, when going 'Back'
// Safari forgets which accordion was open.
// The workaround is to force Safari to reload the page.
// This slows performance for users, but is a marginally
// better experience.

// If this is Safari (thanks https://stackoverflow.com/a/7768006/1781075)
if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
    console.log('Safari detected.');
    window.onpageshow = function (event) {
        'use strict';
        if (event.persisted) {
            window.location.reload();
        }
    };
}
