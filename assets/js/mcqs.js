var ebMCQsInit = function() {
    // check for browser support of the features we use
    // and presence of mcqs
    return navigator.userAgent.indexOf("Opera Mini") === -1 &&
    "querySelector" in document &&
    !!Array.prototype.forEach &&
    "addEventListener" in window &&
    document.querySelectorAll(".question") &&
    !document.querySelector(".table-of-questions");
};

var ebMCQsFindNumberOfCorrectAnswers = function(questionCode) {
    // not digits
    var digitsRegex = /\D/;

    // apply the regex
    var matchedDigitsRegex = questionCode.match(digitsRegex);

    // grab the index of the match
    var numberOfCorrectAnswers = matchedDigitsRegex["index"];

    return numberOfCorrectAnswers;
}

var ebMCQsPositionOfCorrectAnswer = function(trimmedQuestionCode) {
    // vowels * numberOfCorrectAnswers, then consonants * numberOfCorrectAnswers, repeated numberOfCorrectAnswers times
    // vowel regex
    var vowelRegex = /[aeiou]*/;

    // apply the regex
    var matchedVowelRegex = trimmedQuestionCode.match(vowelRegex);

    // get the length of the matched thing
    var positionOfCorrectAnswer = matchedVowelRegex[0].length;

    return positionOfCorrectAnswer;
}

var ebMCQsDobfuscateQuestionCode = function(questionCode) {
    // find the first batch of numbers in the string
    var numberOfCorrectAnswers = ebMCQsFindNumberOfCorrectAnswers(questionCode);

    // trim the string
    var questionCodeLength = questionCode.length;
    var trimmedQuestionCode = questionCode.substr(numberOfCorrectAnswers, questionCodeLength);

    // initialise our array
    var correctAnswers = [];

    // loop for the right length: numberOfCorrectAnswers long
    for (var i = 0; i < numberOfCorrectAnswers; i++) {
        var positionOfCorrectAnswer  = ebMCQsPositionOfCorrectAnswer(trimmedQuestionCode);
        correctAnswers.push(positionOfCorrectAnswer);

        // trim the bit we've used out of the string
        trimmedQuestionCode = trimmedQuestionCode.substr(positionOfCorrectAnswer*2, trimmedQuestionCode.length)
    }
    return correctAnswers;
}

var ebMCQsGetCorrectAnswers = function(question) {

    // get the correct answers
    var questionCode = question.getAttribute('data-question-code');
    var correctAnswers = ebMCQsDobfuscateQuestionCode(questionCode);

    // set the default correctAnswersObj
    var correctAnswersObj = {};

    // get all the feedbacks for this questions
    var feedbacks = question.querySelectorAll('.mcq-feedback li');

    // set it all false for now
    feedbacks.forEach(function(feedback, index) {
        correctAnswersObj[index+1] = false;
    });

    // update correctAnswersObj from the correctAnswers array
    correctAnswers.forEach(function(correctAnswer) {
        correctAnswersObj[correctAnswer] = true;
    });

    return correctAnswersObj;
}

var ebMCQsMakeOptionCheckboxes = function(question) {
    var dataQuestion = question.getAttribute('data-question');
    // get all the options for this question
    var options = question.querySelectorAll('.mcq-options li');

    // loop over options
    options.forEach(function(option, index) {
        // create a unique id for this mcq option
        var optionLetter = String.fromCharCode(index + 65);
        var id = dataQuestion + '-option-' + optionLetter;

        // make the checkbox
        var checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('data-index', index);
        checkbox.setAttribute('id', id);
        checkbox.setAttribute('name', dataQuestion);

        // make a label to put around the checkbox
        var label = document.createElement('label');
        label.setAttribute('for', id);

        // the label gets the checkbox as a child
        label.appendChild(checkbox);

        // now the label gets the option text
        label.innerHTML = label.innerHTML + option.innerHTML;

        // remove the now-duplicate option text
        // and put the label inside the option
        option.innerHTML = '';
        option.appendChild(label);

        // make the option non-bookmarkable
        option.setAttribute('data-bookmarkable', 'no');
    });
}

var ebMCQsAddButton = function(question) {
    // make the button
    var button = document.createElement('button');
    button.innerHTML = locales[pageLanguage].questions['check-answers-button'];
    button.classList.add('check-answer-button');

    // now add it to question, before the feedback
    var feedback = question.querySelector('.mcq-feedback');
    question.insertBefore(button, feedback);
}

var ebMCQsMakeQuestionAccessible = function(question) {
    // get the h3 and wrap the contents of the h3 in a legend
    var questionHeading = question.querySelector('h3');
    var questionHeadingContents = questionHeading.innerHTML;

    var legend = document.createElement('legend');
    legend.innerHTML = questionHeadingContents;

    questionHeading.innerHTML = '';
    questionHeading.appendChild(legend);
}

var ebMCQsGetAllSelected = function(mcqsToCheck) {

    // set the default selectedOptions
    var selectedOptions = {};

    // set it all false for now
    var allTheCheckboxes = mcqsToCheck.querySelectorAll('[type="checkbox"]');
    allTheCheckboxes.forEach(function(selectedCheckbox, index){
        selectedOptions[index+1] = false;
    });

    // update for the selected ones
    var selectedCheckboxes = mcqsToCheck.querySelectorAll('[type="checkbox"]:checked');
    selectedCheckboxes.forEach(function(selectedCheckbox) {
        var dataIndex = parseFloat(selectedCheckbox.getAttribute('data-index'));
        selectedOptions[dataIndex + 1] = true;
    });

    return selectedOptions;
}

var ebMCQsHideAllFeedback = function(mcqsToCheck) {
    var feedbacks = mcqsToCheck.querySelectorAll('.mcq-feedback li');
    feedbacks.forEach(function(feedback) {
        // reset the styles
        feedback.classList.remove('mcq-feedback-show');
    });
}

var ebMCQsShowSelectedOptions = function(mcqsToCheck, selectedOptions) {
    var feedbacks = mcqsToCheck.querySelectorAll('.mcq-feedback li');
    feedbacks.forEach(function(feedback, index) {
        // if it's been selected, show it
        if(selectedOptions[index+1]) {
            feedback.classList.add('mcq-feedback-show');
        }

        // make the feedback non-bookmarkable
        feedback.setAttribute('data-bookmarkable', 'no');

    });
}

var ebMCQsShowSelectedIncorrectOptions = function(mcqsToCheck, selectedOptions, correctAnswersForThisMCQs) {
    var feedbacks = mcqsToCheck.querySelectorAll('.mcq-feedback li');
    feedbacks.forEach(function(feedback, index) {
        // if it's been selected, and it's incorrect, show it
        if(selectedOptions[index+1] &&
            selectedOptions[index+1] !== correctAnswersForThisMCQs[index+1]) {
            feedback.classList.add('mcq-feedback-show');
        }

        // make the feedback non-bookmarkable
        feedback.setAttribute('data-bookmarkable', 'no');

    });
}

var ebMCQsMarkSelectedOptions = function() {
    // get all the options
    var questionOptions = document.querySelectorAll('.mcq-options li');

    // loop over them
    questionOptions.forEach(function(questionOption) {
        // listen for clicks on the label and add/remove .selected to the li
        questionOption.addEventListener('click', function(){
            if (this.querySelector('[type="checkbox"]:checked')) {
                this.classList.add('selected');
            } else {
                this.classList.remove('selected');
            }
        });
    });
}

var ebMCQsGetAllCorrectAnswers = function() {
    // initialise answer store
    var ebMCQsCorrectAnswersForPage = {};

    // get all the questions
    var questions = document.querySelectorAll('.question');

    // loop over questions
    questions.forEach(function(question) {
        // get the correct answers
        var correctAnswersObj = ebMCQsGetCorrectAnswers(question);

        // get the ID, then put the answer set into the store
        var dataQuestion = question.getAttribute('data-question');
        ebMCQsCorrectAnswersForPage[dataQuestion] = correctAnswersObj;
    });

    return ebMCQsCorrectAnswersForPage;
}

var ebMCQsExactlyRight = function(correctAnswersForThisMCQs, selectedOptions) {
    // compare each selectedOption with the correctAnswer
    // if one is wrong, exit with false
    for (var optionNumber in selectedOptions) {
        if(selectedOptions[optionNumber] !== correctAnswersForThisMCQs[optionNumber]) {
            return false;
        }
    }

    // if we haven't been kicked out yet, it must be exactly right
    return true;
}

var ebMCQsNotAllTheCorrectAnswers = function(correctAnswersForThisMCQs, selectedOptions) {
    var numberOfCorrectAnswers = 0;
    var numberOfSelectedCorrectAnswers = 0;
    var numberOfSelectedIncorrectAnswers = 0;

    // loop through the correct answers
    for (var key in correctAnswersForThisMCQs) {
        // count correct answers
        if(correctAnswersForThisMCQs[key]) {
            numberOfCorrectAnswers++;
        }

        // count selected correct answers
        if(correctAnswersForThisMCQs[key] && selectedOptions[key]) {
            numberOfSelectedCorrectAnswers++;
        }

        // count selected incorrect answers
        if(!correctAnswersForThisMCQs[key] && selectedOptions[key]) {
            numberOfSelectedIncorrectAnswers++;
        }
    }

    // if we haven't selected all the correct answers
    // and we haven't selected any incorrect answers
    if(numberOfSelectedCorrectAnswers < numberOfCorrectAnswers && numberOfSelectedIncorrectAnswers === 0) {
        return true;
    }

    return false;
}

// get the WordPress ID from a cookie, or return false if we don't have one
var ebMCQsWordPressUserId = function() {

    var cookieName = 'coreproject_sess';

    // get the cookie, split it into bits
    var cookie = document.cookie.split('; ');

    var WordPressUserIdCookie = cookie.find(function(el) {
        // if it starts with coreproject_sess, it's our WP one
        return el.indexOf(cookieName) === 0;
    });

    if (!WordPressUserIdCookie) {
        // we're logged out, anon
        return false;
    }

    // decode it and remove the cookie name
    var decodedCookie = decodeURIComponent(WordPressUserIdCookie).replace(cookieName + '=', '');

    return decodedCookie;
}

// If we have a nav (i.e. web or app output),
// add the WordPress account button to the nav,
// change the text based on logged in or not
var ebMCQsAddWordPressAccountButton = function() {
    // get #nav
    var theNav = document.querySelector('#nav');

    if (theNav) {
        // get the element in the nav that we'll insert before
        var insertBeforeTarget = theNav.querySelector('h2');

        // make the WordPress link to insert into the nav
        var accountLink = document.createElement('a');
        accountLink.innerText = 'Log in';
        accountLink.href = '/login/';
        accountLink.classList.add('wordpress-link');

        // add the account link to the nav
        theNav.insertBefore(accountLink, insertBeforeTarget);

        if(ebMCQsWordPressUserId()) {
            // change the button text and href
            accountLink.innerText = 'My account';
            accountLink.href = '/account/';
        }
    }
}

// Send a bit of JSON for eacn question submission
var ebMCQsSendtoWordPress = function(quizId, score) {
    // if we don't have a user id, early exit
    var userId = ebMCQsWordPressUserId();
    if (!ebMCQsWordPressUserId()) return;

    // make the object to send
    var data = {
        "action" : "quiz_score", // existing action name
        "book_id" : 1,
        "quiz_id" : quizId,
        "user_id" : userId,
        "score" : score,
    };

    // set url to send json to
    var wordPressURL = '/wp-admin/admin-ajax.php';

    // send the data
    // first build the data structure into a string
    var query = [];
    for (var key in data) // make an array of 'key=value' with special characters encoded
       query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    var dataText=query.join('&'); // join the array into 'key=value1&key2=value2...'
    // now send the data
    var req=new XMLHttpRequest(); // create the request
    req.open('POST', wordPressURL, true); // put in the target url here!
    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    req.send(dataText); // so we send the encoded data not the original data structure
}

var ebMCQsButtonClicks = function() {
    // get all the buttons
    var answerCheckingButtons = document.querySelectorAll('.check-answer-button');

    // for each button
    answerCheckingButtons.forEach(function(answerCheckingButton){
        // listen for clicks on the buttons
        answerCheckingButton.addEventListener('click', function(){
            // get the mcq and it's ID
            var mcqsToCheck = this.parentNode;
            var mcqsToCheckName = mcqsToCheck.getAttribute('data-question');
            var mcqsToCheckCode = mcqsToCheck.getAttribute('data-question-code');

            // reset the styles
            ebMCQsHideAllFeedback(mcqsToCheck);

            // get the selected options (the checked ones)
            var selectedOptions = ebMCQsGetAllSelected(mcqsToCheck);

            // get the correct answers for this mcq
            var ebMCQsCorrectAnswersForPage = ebMCQsGetAllCorrectAnswers();
            var correctAnswersForThisMCQs = ebMCQsCorrectAnswersForPage[mcqsToCheckName];

            mcqsToCheck.classList.remove('mcq-incorrect');
            mcqsToCheck.classList.remove('mcq-partially-correct');
            mcqsToCheck.classList.remove('mcq-correct');

            // set score
            var score = 0;

            // if exactly right, mark it so, show options
            if(ebMCQsExactlyRight(correctAnswersForThisMCQs, selectedOptions)) {
                mcqsToCheck.classList.add('mcq-correct');
                ebMCQsShowSelectedOptions(mcqsToCheck, selectedOptions);

                // set score
                score = 1;
            } else if(ebMCQsNotAllTheCorrectAnswers(correctAnswersForThisMCQs, selectedOptions)) {
                mcqsToCheck.classList.add('mcq-partially-correct');
                ebMCQsShowSelectedIncorrectOptions(mcqsToCheck, selectedOptions, correctAnswersForThisMCQs);
            } else {
                // show the feedback for the incorrect options
                mcqsToCheck.classList.add('mcq-incorrect');
                ebMCQsShowSelectedIncorrectOptions(mcqsToCheck, selectedOptions, correctAnswersForThisMCQs);
            }

            // now send it all to WordPress
            var quizNumber = mcqsToCheckName.replace('question-', '');
            ebMCQsSendtoWordPress(quizNumber, score);
        });
    });
}

var ebMCQs = function() {
    // early exit for lack of browser support or no mcqs
    if (!ebMCQsInit()) return;

    // add the WordPress account button
    ebMCQsAddWordPressAccountButton();

    // mark the document, to use the class in CSS
    document.documentElement.classList.add('js-mcq');

    // get all the questions
    var questions = document.querySelectorAll('.question');

    // loop over questions
    questions.forEach(function(question) {
        // add the interactive stuff: the checkboxes and the buttons
        ebMCQsMakeOptionCheckboxes(question);
        ebMCQsAddButton(question);
        // add the extra elements needed for accessibility
        ebMCQsMakeQuestionAccessible(question);
    });

    // mark the checked ones more clearly
    ebMCQsMarkSelectedOptions();

    // listen for button clicks and show results
    ebMCQsButtonClicks();
}

ebMCQs();
