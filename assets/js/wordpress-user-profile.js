/*jslint browser */

const userDetailUrl = '/?rest_route=/eb/v1/user_details';
const params = {
    headers: {
        "content-type": "application/json; charset=UTF-8"
    }
};


const ebGetWPUserID = function () {
    const cookieName = 'coreproject_sess';

    // get the cookie, split it into bits
    const cookie = document.cookie.split('; ');

    const userIdCookie = cookie.find(function (el) {
        // if it starts with coreproject_sess, it's our WP one
        return el.indexOf(cookieName) === 0;
    });

    if (!userIdCookie) {
        return false;
    }

    return decodeURIComponent(userIdCookie).replace(cookieName + '=', '');
}

function ebUserProfileButtonAppendHash(button) {
    let link = button.getAttribute('href');

    // If url already contains a hash we remove that and append the current hash string
    if (link.includes('#')) {
        link = link.split('#')[0];
    }

    button.setAttribute('href', link + encodeURIComponent(window.location.hash));
}

function ebUserProfileAddListeners(profile) {
    let buttons = profile.querySelectorAll('.buttons a');

    buttons.forEach(function (button) {


        button.addEventListener('click', function (e) {
            ebUserProfileButtonAppendHash(button);
        });

        button.addEventListener('keydown', function (event) {
            if (event.key === "Enter") {
                ebUserProfileButtonAppendHash(button);
            }
        });
    });
}

function ebGetUserDetailsFromWP() {
    if (sessionStorage.getItem("user-details")) {
        const wpUserId = ebGetWPUserID();
        const userDetails = JSON.parse(sessionStorage.getItem("user-details"));

        if (wpUserId != userDetails['id']) {
            // user not logged in or currently loggedin user's id doesn't match cached user details
            // clear the cache item and continue with AJAX call
            sessionStorage.removeItem("user-details");
        } else {
            // user ids match, we can use session cache
            console.log("Cache hit");
            return Promise.resolve(userDetails);
        }
    }

    return fetch(userDetailUrl, params)
        .then(response => response.json())
        .then(json => {
            if (json && json["success"]) {
                sessionStorage.setItem("user-details", JSON.stringify(json["user"]));
            }

            return json["user"];
        })
        .catch(error => console.error(error));
}

function ebDisplayUserProfile() {
    let user = ebGetUserDetailsFromWP();

    user.then(user => {
        let profile = document.querySelector('.menu-user-profile');

        if (user) {
            const initials = user['initials'];
            profile.querySelector('.buttons').classList.add('visuallyhidden');
            profile.querySelector('.avatar').innerHTML = `<a href="/account/"><span>${initials}</span></a>`;
            profile.querySelector('.avatar').classList.remove('visuallyhidden');
            profile.classList.remove('visuallyhidden');

        } else {
            profile.classList.remove('visuallyhidden');
            profile.querySelector('.buttons').classList.remove('visuallyhidden');
            ebUserProfileAddListeners(profile);
        }
    })

}

ebDisplayUserProfile();
