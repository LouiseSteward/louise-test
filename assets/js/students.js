/*jslint browser */

function ebStudentsRemoveSectionNumbers() {
    'use strict';

    var sectionHeadings = document.querySelectorAll('h2');
    if (sectionHeadings.length > 0) {
        sectionHeadings.forEach(function (heading) {

            // The first anchor tag contains the number
            var headingLink = heading.querySelector('a');
            if (headingLink) {

                // Replace only the leading section number
                var newHeadingLinkHTML = headingLink.innerHTML.replace(/[0-9\.]+/, '');
                headingLink.innerHTML = newHeadingLinkHTML;
            }
             else {
                // in print there is no a, we want the innerHTML of the h2 to change
                var newHeadingInnerHTML = heading.innerHTML.replace(/[0-9\.]+/, '');
                heading.innerHTML = newHeadingInnerHTML;
             }
        });
    }
}

function ebStudentsHideNavItems() {
    'use strict';

    var hiddenNavItems = document.querySelectorAll('.nav-list .students-hidden, .toc-list .students-hidden');
    hiddenNavItems.forEach(function (item) {
        var expanderList = item.parentNode;
        var expander = expanderList.previousElementSibling;
        item.remove();

        // If the list now has no children, remove the expander,
        // after checking that we're targeting a list and expander
        if (expanderList && expander
                && expanderList.tagName === 'OL'
                && expander.tagName === 'BUTTON') {
            if (expanderList.children.length === 0) {
                expander.remove();
            }
        }
    });
}

ebStudentsRemoveSectionNumbers();
ebStudentsHideNavItems();
