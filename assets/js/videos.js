/*jslint browser */
/*globals window, gtag, console */

function ebVideoInit() {
    'use strict';
    return document.querySelectorAll('.videowrapper');
}

var ebVideoHosts = {
    youtube: 'https://www.youtube.com/embed/',
    vimeo: 'https://player.vimeo.com/video/'
};

function ebGetVideoHost(videoElement) {
    'use strict';
    var videoHost;
    var classes = videoElement.classList;

    classes.forEach(function (currentClass) {
        if (ebVideoHosts.hasOwnProperty(currentClass)) {
            videoHost = currentClass;
        }
    });

    return videoHost;
}

function ebVideoSubtitles(videoElement) {
    'use strict';
    var subtitles = videoElement.getAttribute('data-video-subtitles');
    if (subtitles === 'true') {
        subtitles = 1;
        return subtitles;
    }
}

function ebVideoLanguage(videoElement) {
    'use strict';
    var language = videoElement.getAttribute('data-video-language');
    return language;
}

function ebVideoGetTitle(videoElement) {
    'use strict';
    var videoTitle = videoElement.getAttribute('data-title');
    return videoTitle;
}

function ebVideoMakeIframe(videoElement, host, videoId, videoLanguage, videoSubtitles, videoTitle) {
    'use strict';
    var hostURL = ebVideoHosts[host];

    var parametersString = '?autoplay=0';

    if (videoLanguage) {
        if (host === 'youtube') {
            parametersString += '&cc_lang_pref=' + videoLanguage;
        }
    }
    if (videoSubtitles) {
        if (host === 'youtube') {
            parametersString += '&cc_load_policy=' + videoSubtitles;
        }
    }

    var iframe = document.createElement('iframe');
    iframe.setAttribute('frameborder', 0);
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('src', hostURL + videoId + parametersString);
    iframe.setAttribute('title', videoTitle);

    // now that the title is in the iframe, remove it from the video div
    videoElement.removeAttribute('data-title');

    return iframe;
}

function onYouTubeIframeAPIReady () {
    // This is called by the youtube iframe API
    // and initiates the YT object
    return;
}

function ebVideoUseTheYoutubeIFrameAPI (videoId, videoLanguage, videoSubtitles,
        videoTitle, currentVideo) {

    function onPlayerStateChange (event) {
        var playerStatus = event.data;
        // Watch for the video to start playing
        if (playerStatus === 1) {
            // call the tracking function from analytics.js
            ebTrackYoutubeVideoPlay(currentVideo);
        }
    }

    var player;
    YT.ready(function () {
        player = new YT.Player(videoId, {
            videoId: videoId,
            playerVars: {
                cc_lang_pref: videoLanguage,
                cc_load_policy: videoSubtitles,
                enablejsapi: 1
            },
            events: {
                "onStateChange": onPlayerStateChange.bind(currentVideo)
            }
        });

        // Add a useful title for accessibility
        var iframe = player.getIframe();
        iframe.setAttribute("title", videoTitle);
    });
}

// Only show video options on button click
function videoOptionsDropdown(video) {
    'use strict';

    var videoOptions = video.querySelector('.video-options');
    if (videoOptions) {
        var button = videoOptions.querySelector('button');
        var options = videoOptions.querySelector('.video-options-content');
        options.classList.add('js-video-options-content');
        button.addEventListener('click', function () {
            options.classList.toggle('js-video-options-content-visible');
        });
        button.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                options.classList.toggle('js-video-options-content-visible');
            }
        });
        // Close the dropdown when you press Escape
        videoOptions.addEventListener('keydown', function (event) {
            if (options.classList.contains('js-video-options-content-visible')
                && event.key === "Escape") {
                options.classList.remove('js-video-options-content-visible');
                button.focus();
            }
        });

        // Call the tracking function from analytics.js
        if (settings.site.output === "web") {
            ebTrackVideoOptionClicks(video);
        }
    }
}

// videoShow is called from accordions.js,
// when a section is opened, for the videos in that section.
function videoShow(section) {
    'use strict';
    // early exit for unsupported browsers
    if (!ebVideoInit()) {
        return;
    }

    // get all the videos
    var videos = section.querySelectorAll('.video');

    videos.forEach(function (currentVideo) {
        // first check whether it is necessary to run the video builder
        if (!currentVideo.classList.contains("video-embedded")) {
            var videoHost = ebGetVideoHost(currentVideo);
            var videoId = currentVideo.getAttribute("data-video-id");
            var videoLanguage = ebVideoLanguage(currentVideo);
            var videoSubtitles = ebVideoSubtitles(currentVideo);
            var videoTitle = ebVideoGetTitle(currentVideo);

            var videowrapper = currentVideo.querySelector(".video-wrapper");
            currentVideo.classList.add("video-embedded");

            // Remove unnecessary anchor element
            if (videowrapper.querySelector("a")) {
                videowrapper.removeChild(videowrapper.querySelector("a"));
            }

            if (videoHost === "youtube" 
                && settings.site.output === "web") {
                // Use the youtube iframe api for youtube videos
                // There is a holder div with id=videoId that will be replaced
                // with an iframe by the API
                ebVideoUseTheYoutubeIFrameAPI(
                    videoId, videoLanguage, videoSubtitles, videoTitle, currentVideo
                );
            } else {
                var iframe = ebVideoMakeIframe(
                    currentVideo, videoHost, videoId, videoLanguage, videoSubtitles, videoTitle
                );
                videowrapper.appendChild(iframe);
            }

            // Scriptify the options dropdown
            videoOptionsDropdown(currentVideo);
        } 
    });
}
