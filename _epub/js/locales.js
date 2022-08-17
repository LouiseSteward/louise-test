// Load locales.yml into a locales array.

// Convert locales.yml into a JSON string.
// Note that hyphens in keys are converted to underscores.
var locales = {{ site.data.locales | jsonify }};

// Or get the language from a URL parameter
// https://stackoverflow.com/a/901144/1781075
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Various content localisations

function localiseText() {

    // Localise home page
    var homeReadbuttons = document.querySelectorAll('.button');
    var homePageHeading = document.querySelector('.home h1');
    // If language is set with a URL param, show only that language's read button
    if (homeReadbuttons.length > 0 && pageLanguageByURLParameter) {
        for (let i = 0; i < homeReadbuttons.length; i++) {
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

    // Localise author and title on home page
    var homePageTitle = document.querySelector('.home h1');
    if (homePageTitle) {
        homePageTitle.innerHTML = '<strong>' + locales[pageLanguage].project.creator + '</strong>' + locales[pageLanguage].project.name;
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
    var searchNavButtonToReplace = document.querySelector('.search-page [href="#nav"]');
    var searchNavDivToReplace = document.querySelector('.search-page #nav');
    if (searchNavButtonToReplace) {
        searchNavButtonToReplace.innerHTML = locales[pageLanguage].nav.back;
        searchNavButtonToReplace.addEventListener('click', function(ev) {
            ev.preventDefault();
            console.log('Going back...');
            window.history.back();
        });

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
if (getParameterByName('lang')) {
    var pageLanguage = getParameterByName('lang');
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
