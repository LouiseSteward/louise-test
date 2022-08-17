// Load locales.yml into a locales array.

// -------------------------------------------------------------
// Options
// -------

// Localise home pages in place, or redirect to different page?
var redirectHomepages = true;

// -------------------------------------------------------------


// Convert locales.yml into a JSON string.
// Note that hyphens in keys are converted to underscores.
var locales = {{ site.data.locales | jsonify }};

function ebCheckForTranslationLanguage(language) {
    'use strict';

    // If language is in the array, return true
    if (metadata.languages.includes(language)) {
        return true;
    } else {
        console.log(language + ' is not a translation.');
        return false;
    }
}

// Various content localisations

function localiseText() {
    // Localise home page
    console.log('Localising for ' + pageLanguage);
    var homeReadbuttons = document.querySelectorAll('.button');
    var homePageHeading = document.querySelector('.home h1');
    // If language is set with a URL param, show only that language's read button
    if (homeReadbuttons.length > 0 && pageLanguageByURLParameter) {
        var i;
        for (i = 0; i < homeReadbuttons.length; i += 1) {
            homeReadbuttons[i].classList.add('visuallyhidden');
        }
        var languageButton = document.createElement('p');
        languageButton.classList.add('button');
        homePageHeading.insertAdjacentElement('afterend', languageButton);
        if (pageLanguage == 'en') {
            languageButton.innerHTML = '<a href="book/text/0-3-contents.html">' + locales[pageLanguage].home.read + '</a>';
        } else {
            languageButton.innerHTML = '<a href="book/' + pageLanguage + '/text/0-3-contents.html">' + locales[pageLanguage].home.read + '</a>';
        }
    }

    // Localise HTML title element on home page
    if (document.querySelector('title')
            && document.querySelector('body.home')) {
        var titleElement = document.querySelector('title');
        titleElement.innerHTML = locales[pageLanguage].home["html-title"];
    }

    // Localise author and title on home page
    var homePageTitle = document.querySelector('.home h1');
    if (homePageTitle) {
        homePageTitle.innerHTML = '<strong>' + locales[pageLanguage].project.creator + '</strong>' + ' ' + locales[pageLanguage].project.name;
    }

    // Localise masthead
    var mastheadProjectName = document.querySelector('.masthead .masthead-series-name a');
    if (mastheadProjectName) {
        mastheadProjectName.innerHTML = locales[pageLanguage].project.name;
    }

    // Localise search
    var searchPageHeading = document.querySelector('.search-page #content h1:first-of-type');
    if (searchPageHeading) {
        searchPageHeading.innerHTML = locales[pageLanguage].search['search-title'];
    }

    // Localise search form
    var searchLanguageToLocalise = document.querySelector('#search-language');
    if (searchLanguageToLocalise) {
        searchLanguageToLocalise.setAttribute('value', pageLanguage);
    };

    // Localise search-box placeholder
    var searchInputBox = document.querySelector('.search input.search-box');
    if (searchInputBox) {
        var searchInputBoxPlaceholder = document.querySelector('.search input.search-box').placeholder;
        if (searchInputBoxPlaceholder) {
            searchInputBoxPlaceholder = locales[pageLanguage].search['search-placeholder'];
        }
    }

    // Localise search-box submit button
    var searchSubmitInput = document.querySelector('.search input.search-submit');
    if (searchSubmitInput) {
        searchSubmitInput.setAttribute('value', locales[pageLanguage].search['search-title']);
    }

    // Localise search form label for screen readers
    var searchFormLabel = document.querySelector('.search label.visuallyhidden');
    if (searchFormLabel) {
        searchFormLabel.innerHTML = locales[pageLanguage].search['search-title'];
    }

    // Localise searching... notice
    var searchProgressPlaceholder = document.querySelector('.search-placeholder');
    if (searchProgressPlaceholder) {
        searchProgressPlaceholder.innerHTML = locales[pageLanguage].search['placeholder-searching'];
    };

    // Localise Google CSE search snippets
    var googleCSESearchBox = document.querySelector('.search input.search-box');
    if (googleCSESearchBox) {
        googleCSESearchBox.placeholder = locales[pageLanguage].search.placeholder;
    };

    // Add any notices set in locales as search.notice
    if (searchPageHeading) {
        var searchNotice = document.createElement('div');
        searchNotice.classList.add('search-page-notice');
        searchNotice.innerHTML = '<p>' + locales[pageLanguage].search.notice + '</p>';
        searchPageHeading.insertAdjacentElement('afterend', searchNotice);
    };

    // We cannot localise the nav/TOC, since the root search page
    // always uses the parent-language. So we replace the nav
    // on the search page with a back button instead.
    // In case we have a back button (`$nav-bar-back-button-hide; true` in scss)
    // hide that one.
    var searchNavButtonToReplace = document.querySelector('.search-page [href="#nav"]');
    var searchNavDivToReplace = document.querySelector('.search-page #nav');
    var navBackButton = document.querySelector('.nav-back-button');
    if (searchNavButtonToReplace && navBackButton) {
        if (document.referrer != "" || window.history.length > 0) {
            navBackButton.remove();
            searchNavButtonToReplace.innerHTML = locales[pageLanguage].nav.back;
            searchNavButtonToReplace.addEventListener('click', function(ev) {
                ev.preventDefault();
                console.log('Going back...');
                window.history.back();
            });
        };
    };
    if (searchNavDivToReplace) {
        searchNavDivToReplace.innerHTML = '';
    }

    // If no results with GSE, translate 'No results' phrase
    window.addEventListener("load", function (event) {
        console.log("All loaded, checking for no-result.");
        var noResultsGSE = document.querySelector('.gs-no-results-result .gs-snippet');
        if (noResultsGSE) {
            noResultsGSE.innerHTML = locales[pageLanguage].search['results-for-none'] + ' ‘' + searchTerm + '’';
        }
    });

    // localise questions
    var questionButtons = document.querySelectorAll('.question .check-answer-button');
    function replaceText(button) {
        button.innerHTML='{{ locale.questions.check-answers-button }}';
    }
    if (questionButtons) {
        questionButtons.forEach(replaceText);
    }
}

// Get the page language
if (ebGetParameterByName('lang')) {
    var pageLanguage = ebGetParameterByName('lang');
    var pageLanguageByURLParameter = true;
    localiseText();
} else {
    var pageLanguage = document.documentElement.lang;
    // If epub, this is xml:lang
    if (!pageLanguage) {
        var pageLanguage = document.documentElement.getAttribute('xml:lang');
    }
    localiseText();
};
