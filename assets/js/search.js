function ebDisplaySearchResults(results, store) {

  var appendString = '';

  if (results.length) {

    appendString += '<div class="search-results" id="search-results">'

    appendString += '<h2>' + locales[pageLanguage].search['search-results'] + '</h2>';

    if (results.length == 1) {
      var localisedSearchResultsNumberSuffix = locales[pageLanguage].search['results-for-singular'];
    }
    else {
      var localisedSearchResultsNumberSuffix = locales[pageLanguage].search['results-for-plural'];
    }

    appendString += '<p>' + results.length + ' ' + localisedSearchResultsNumberSuffix;
    appendString +=  ' "<mark>' + searchTerm + '</mark>".</p>';

    appendString += '<ul>';

    for (var i = 0; i < results.length; i++) {
      var item = store[results[i].ref];
      appendString += '<li>';
      appendString += '<h3>';
      appendString += '<a href="' + item.url + '?query=';
      appendString += searchTerm + '">' + item.title + ' </a>';
      appendString += '</h3>';
      appendString += '<p>' + item.excerpt + '</p>';
      appendString += '</li>';
    }

    appendString += '</ul>';

    appendString += '</div>';

  } else {
    var localisedSearchResultsNumberSuffix = locales[pageLanguage].search['results-for-none'];
    appendString += '<p>' + localisedSearchResultsNumberSuffix + ' "' + searchTerm + '".</p>';
  }

  document.getElementById('search-results').innerHTML =  appendString;
}

if (searchTerm) {

  // display the placeholder
  var searchResultsContainer = document.getElementById('search-results');
  if (searchResultsContainer) {
    searchResultsContainer.innerHTML = '<p>' + locales[pageLanguage].search['placeholder-searching'] + '</p>';
  }

  // perform the search
  var results = index.search(searchTerm, {
    bool: "AND"
  });

  // display the results
  ebDisplaySearchResults(results, store);
}
