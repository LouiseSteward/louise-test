/*jslint browser */

function ebFormatTranscripts() {
    "use strict";
    // Rearrange the elements in the transcript files for ease of styling

    // Only transcript files contain the timestamp class
    if (document.querySelector(".timestamp")) {
        var speechParagraphs = document.querySelectorAll("#content p");
        speechParagraphs.forEach(function (para) {

            var timestamp = para.querySelector("em.timestamp");
            var linebreak = document.createElement("br");

            // Encapsulate speaker name and timestamp in a span for CSS
            var wrapperSpan = document.createElement("span");
            wrapperSpan.classList.add("name-and-timestamp");

            // Monologue transcripts don't have speaker names
            if (para.querySelector("strong")) {
                var speakerName = para.querySelector("strong");
                wrapperSpan.appendChild(speakerName);
            }

            wrapperSpan.appendChild(timestamp);
            wrapperSpan.appendChild(linebreak);

            para.prepend(wrapperSpan);
        });
    }
}

ebFormatTranscripts();
