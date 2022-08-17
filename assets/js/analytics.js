/*jslint browser */
/*global locales gtag console pageLanguage */

// ----------------
// USEFUL VARIABLES
// ----------------

// pageLanguage is declared in locales.js
var languageSignifier = pageLanguage.toUpperCase();
var bookTitle = locales[pageLanguage].project.name;
var chapterTitle, titlePieces, chapterNumber;
if (document.querySelector("h1 strong")) {
    chapterTitle = document.querySelector("h1 strong").innerHTML;
    titlePieces = chapterTitle.split(" ");
    chapterNumber = titlePieces[titlePieces.length - 1];
} else {
    if (document.querySelector("h1")) {
        chapterTitle = document.querySelector("h1").innerHTML;
    } else if (document.querySelector("h2")) {
        chapterTitle = document.querySelector("h2").innerHTML;
    } else if (document.querySelector("h3")) {
        chapterTitle = document.querySelector("h3").innerHTML;
    } else {
        chapterTitle = "";
    }
}

// --------------
// BASE FUNCTIONS
// --------------

// Base function to send info to Google Analytics
function ebTrackSendEventToGoogle (eventAction, eventCategory, eventLabel) {
    if (typeof gtag === "function") {
        gtag("event", eventAction, {
            "event_category": eventCategory,
            "event_label": eventLabel
        });
    }
}

// Base function to send analytics upon triggering an event
function ebTrackEvent (target, event, eventAction, eventCategory, eventLabel) {
    target.addEventListener(event, function () {
        // Inform Google Analytics when this event is triggered
        ebTrackSendEventToGoogle(eventAction, eventCategory, eventLabel);
    });
}

// --------------
// VIDEO TRACKING
// --------------

function ebVideoGetVideoDescription (video) {
    var optionLinks = video.querySelectorAll(".video-options-content a");

    var videoDescription;
    var urlPieces;

    if (optionLinks.length > 0) {
        optionLinks.forEach(function (link) {
            if (link.href.indexOf(".mp4") != -1) {
                urlPieces = link.href.split("/");
                videoDescription = urlPieces[urlPieces.length - 1];
                videoDescription = videoDescription.slice(0, -4);
            }
        });
    } else {
        videoDescription = video.getAttribute("data-title");
    }


    return videoDescription;
}


function ebTrackYoutubeVideoPlay (video) {
    // This one is called in videos.js

    var videoClassList = video.classList;

    var eventAction = "Play video";
    var eventCategory = "Videos - ";
    var eventLabel = null;

    var videoDescription = ebVideoGetVideoDescription(video);

    if (videoClassList.contains("walk-through")) {
        var fullChapterTitle;
        if (document.querySelector("h1")) {
            fullChapterTitle = document.querySelector("h1").innerHTML;
        } else if (document.querySelector("h2")) {
            fullChapterTitle = document.querySelector("h2").innerHTML;
        } else {
            fullChapterTitle = "";
        }
        eventCategory += "Walk-through";

        if (fullChapterTitle.includes("Excel")) {
            eventLabel = bookTitle + " " + languageSignifier
                + " Excel Project " + chapterNumber + " - " + videoDescription;
        } else if (fullChapterTitle.includes("Google")) {
            eventLabel = bookTitle + " " + languageSignifier
                + " Google Sheets Project " + chapterNumber + " - " + videoDescription;
        } else {
            eventLabel = bookTitle + " " + languageSignifier
                + " R Project " + chapterNumber + " - " + videoDescription;
        }
    } else if (videoClassList.contains("economist-in-action")) {
        eventCategory += "EiA";
        eventLabel =
            bookTitle + " " + languageSignifier + " " + chapterTitle +
            " - " + videoDescription;
    }

    if (eventLabel !== null) {
        ebTrackSendEventToGoogle(eventAction, eventCategory, eventLabel);
    }

}

function ebTrackVideoOptionClicks (video) {
    // This one is called in videos.js
    var eventCategory;
    var eventAction;

    var optionLinks = video.querySelectorAll(".video-options-content a");
    var videoDescription = ebVideoGetVideoDescription(video);

    var eventLabel =
        bookTitle + " " + languageSignifier + " " + chapterTitle +
        " - " + videoDescription;

    optionLinks.forEach(function (link) {
        var linkURL = link.href;

        if (linkURL.includes(".mp4")) {
            eventCategory = "Video options - Download";
            eventAction = "Download video";
        } else if (linkURL.includes("bilibili")) {
            eventCategory = "Video options - BiliBili";
            eventAction = "Play video";
        } else if (linkURL.includes(".txt")) {
            eventCategory = "Video options - Transcript";
            eventAction = "Download transcript";
        } else {
            eventCategory = "Video options - Misc";
            eventAction = "Play video";
        }

        ebTrackEvent(link, "click", eventAction, eventCategory, eventLabel);
        ebTrackEvent(link, "contextmenu", eventAction, eventCategory, eventLabel);
    });
}

// ---------------
// BUTTON TRACKING
// ---------------

function ebTrackOwidButtonClicks () {
    var owidButtons = document.querySelectorAll(".figure-more a");

    var eventAction = "Click on OWiD";
    var eventCategory = "Button - OWiD";

    owidButtons.forEach(function (owidButton) {
        var figureNumber = owidButton.parentNode.parentNode.parentNode
            .querySelector(".figure-reference").innerHTML.trim();
        var eventLabel = bookTitle + " " + languageSignifier
            + " " + figureNumber;

        ebTrackEvent(owidButton, "click", eventAction, eventCategory, eventLabel);
        ebTrackEvent(owidButton, "contextmenu", eventAction, eventCategory, eventLabel);
    });
}
ebTrackOwidButtonClicks();


function ebTrackCheckAnswerButtonClicks () {
    var checkAnswerButtons = document.querySelectorAll(".check-answer-button");

    var eventAction = "Click on Answer";
    var eventCategory = "Button - Check Answer";

    checkAnswerButtons.forEach(function(button){
        var questionNumber = button.parentNode.querySelector("h3 strong").innerHTML;
        var eventLabel = bookTitle + " " + languageSignifier
            + " " + questionNumber;
        ebTrackEvent(button, "click", eventAction, eventCategory, eventLabel);
    });
}
ebTrackCheckAnswerButtonClicks();


// --------------------------
// EMPIRICAL PROJECT TRACKING
// --------------------------

function ebTrackEmpiricalProjectViews () {
    var fullChapterTitle;
    if (document.querySelector("h1")) {
        fullChapterTitle = document.querySelector("h1").innerHTML;
    } else if (document.querySelector("h2")) {
        fullChapterTitle = document.querySelector("h2").innerHTML;
    } else {
        fullChapterTitle = "";
    }
    var thisIsAProjectPage = document.querySelector("body.project");
    var eventAction = "View project";
    var eventCategory;
    var eventLabel;

    if (thisIsAProjectPage) {
        if (fullChapterTitle.includes("Excel")) {
            eventCategory = "Empirical Project - Excel";
            eventLabel = bookTitle + " " + languageSignifier
                + " - Excel Project " + chapterNumber;
        } else if (fullChapterTitle.includes("Google")) {
            eventCategory = "Empirical Project - Google Sheets";
            eventLabel = bookTitle + " " + languageSignifier
                + " - Google Sheets Project " + chapterNumber;
        } else {
            eventCategory = "Empirical Project - R";
            eventLabel = bookTitle + " " + languageSignifier
                + " - R Project " + chapterNumber;
        }

        ebTrackSendEventToGoogle(eventAction, eventCategory, eventLabel);
    }
}
ebTrackEmpiricalProjectViews();

function ebTrackRCodeDownloads () {
    var rDownloadLink = document.querySelector(".js-code-download-link");

    if (rDownloadLink) {
        var eventAction = "Download code";
        var eventCategory = "Code download - R";
        var eventLabel = bookTitle + " " + languageSignifier
            + " - R Project " + chapterNumber;
        ebTrackEvent(rDownloadLink, "click", eventAction, eventCategory, eventLabel);
        ebTrackEvent(rDownloadLink, "contextmenu", eventAction, eventCategory, eventLabel);
    }
}
ebTrackRCodeDownloads();

function ebTrackExpandableBoxOpen (h3) {
    // This one is called in expandable-box.js
    var eventAction = "Expand walk-through";
    var eventCategory = "";
    var eventLabel = "";

    var headingPieces = h3.split(" ");
    var boxNumber = headingPieces[headingPieces.length - 1];

    if (h3.includes("excel")) {
        eventCategory = "Walk-through - Excel";
        eventLabel = "Excel Walk-through " + boxNumber;
    } else if (h3.includes("google")) {
        eventCategory = "Walk-through - Google Sheets";
        eventLabel = "Google Sheets Walk-through " + boxNumber;
    } else {
        eventCategory = "Walk-through - R";
        eventLabel = "R Walk-through " + boxNumber;
    }

    ebTrackSendEventToGoogle(eventAction, eventCategory, eventLabel);
}
