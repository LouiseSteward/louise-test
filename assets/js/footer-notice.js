/*jslint */
/*globals window, Prince, pageLanguage, locales */

// Teacher notice running footer
// Use with css:
// content: prince-script(footernotice);

// Get the locale phrase for footer notice for this HTML document's language
// pageLanguage is provided by locales.js
var noticeText = locales[pageLanguage]['pdf']['notice'];

function addFooterNoticeFunc() {
    'use strict';

    if (typeof Prince === 'object' && typeof Prince.addScriptFunc === 'function') {
        console.log('Adding footer notice in Prince.');
        Prince.addScriptFunc("footernotice", function () {
            // This attriute is only created when
            // notices are turned on in settings
            if (document.body.hasAttribute('data-pdf-notice')) {
                return noticeText;
            } else {
                return '';
            }
        });
    }
}

addFooterNoticeFunc();
