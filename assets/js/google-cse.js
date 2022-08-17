// Add Google Custom Search to a page, and add the query string
// as a parameter to the end of the target URL.
// Thanks to https://stackoverflow.com/a/35395297/1781075 for the tip.

// A note on implementation:
// never place two instances of the gcse:searchbox on a page,
// because search results will be hidden on Chrome for Android,
// until the user taps on the hidden input field or changes screen orientation,
// and you will spend fruitless days trying to figure out why.


// Main Google CSE code from cse.google.com
// Store the ID in _data/settings.yml, e.g. as
// google-cse-id: 001234567890123456789:abcde1234567
  (function() {
    var cx = '{{ site.data.settings.google-cse-id }}';
    var gcse = document.createElement('script');
    gcse.type = 'text/javascript';
    gcse.async = true;
    gcse.src = 'https://cse.google.com/cse.js?cx=' + cx;
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(gcse, s);
  })();


// Add query string to result URL as parameter,
// so that we can pass it to mark.js for highlighting
// search terms on the target page
function addQueryParameter(searchQuery){
  var queryParameter="?query=";

  // Append each word in the searchQuery array to the parameter
  var i = 0;
  for (i=0;i<searchQuery.length;i++){
    if (i != searchQuery.length - 1) {
      queryParameter+=searchQuery[i]+"+";
    } else {
      queryParameter+=searchQuery[i];
    }
  }
  // Now to add that parameter to each search result link.
  var googleSearchResultLinks = document.querySelectorAll('a.gs-title');

  // First, find each search result link by a.gs-title.
  for (i=0;i<googleSearchResultLinks.length;i++){
    var googleSearchResultLink = googleSearchResultLinks[i].getAttribute('href');

    // Then append the parameter to the href.
    var newLinkWithQueryParameter = googleSearchResultLink+queryParameter;
    googleSearchResultLinks[i].setAttribute('href', newLinkWithQueryParameter);

    // Then, to avoid Google using its own link and
    // stripping our query parameter in the process,
    // replace the data-cturl and data-ctorig with our full href.
    googleSearchResultLinks[i].setAttribute('data-cturl', newLinkWithQueryParameter);
    googleSearchResultLinks[i].setAttribute('data-ctorig', newLinkWithQueryParameter);
  }
};


// Check for Google search results
function checkForGoogleSearchResults() {

  // Create an array from the words in the search box
  console.log('Browsers may throw an error here because search results haven\'t loaded yet. Don\'t worry, we\'ll try again.')
  var searchQuery = document.getElementById('gsc-i-id1').value.replace(/\"/g,'').split(' '),
      searchResultsBox = document.getElementsByClassName('gsc-resultsbox-visible')[0];

  // Once those variables are available, we can stop the interval checking
  // and run addQueryParameter.
  if (searchQuery !== undefined && searchResultsBox !== undefined) {
    clearInterval(checkForGoogleSearchResultsInterval)
    addQueryParameter(searchQuery);

    // Hide the 'Searching...' placeholder
    document.getElementsByClassName('search-placeholder')[0].style.display = "none";

    // Once we've added the query parameter, we can show the results,
    // which till now our CSS has hidden.
    searchResultsBox.style.display = "block";

    // Give focus back to the search box for quick new search
    document.getElementById('gsc-i-id1').select();
  }
};


// It takes a while for Google search results to load,
// so if we're on the search-results page,
// let's check for theme every second.

// Get the page's name
var thisURLArray = window.location.href.split('?')[0].split('/');
var thisPage = thisURLArray[thisURLArray.length - 1];

// Start checking for Google search results if this is a search page
if(thisPage === "search.html") {
  var checkForGoogleSearchResultsInterval = setInterval(checkForGoogleSearchResults, 1000);
}
