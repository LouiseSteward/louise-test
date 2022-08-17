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

function ebVideoGetTitle(videoElement) {
    'use strict';
    var videoTitle = videoElement.getAttribute('data-title');
    return videoTitle;
}

function ebVideoRemoveTitle(videoElement) {
    'use strict';
    videoElement.removeAttribute('data-title');
}

function ebVideoMakeIframe(videoElement, host, videoId, videoTitle) {
    'use strict';
    var hostURL = ebVideoHosts[host];

    var iframe = document.createElement('iframe');
    iframe.setAttribute('frameborder', 0);
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('src', hostURL + videoId);
    iframe.setAttribute('title', videoTitle);

    // now that the title is in the iframe, remove it from the video div
    videoElement.removeAttribute('data-title');

    return iframe;
}

function videoShow(section) {
    'use strict';
    // early exit for unsupported browsers
    if (!ebVideoInit()) {
        return;
    }

    // get all the videos
    var videos = section.querySelectorAll('.video');

    videos.forEach(function (currentVideo) {
        // make the iframe
        var videoHost = ebGetVideoHost(currentVideo);
        var videoId = currentVideo.id;
        var videoTitle = ebVideoGetTitle(currentVideo);
        var iframe = ebVideoMakeIframe(currentVideo, videoHost, videoId, videoTitle);
        var videowrapper = currentVideo.querySelector('.video-wrapper');

        currentVideo.classList.add('video-embedded');
        videowrapper.innerHTML = '';
        videowrapper.appendChild(iframe);
    });
}
