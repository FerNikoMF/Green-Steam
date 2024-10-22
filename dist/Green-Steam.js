// ==UserScript==
// @name         Green Steam
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @author       FerNikoMF & Muxammadaziz04
// @description  Adds pirated links to all games on the Steam store pages.
// @match        https://store.steampowered.com/app/*
// @homepage     https://github.com/FerNikoMF/Green-Steam
// @downloadURL  https://raw.githubusercontent.com/FerNikoMF/Green-Steam/main/dist/Green-Steam.js
// @updateURL    https://raw.githubusercontent.com/FerNikoMF/Green-Steam/main/dist/Green-Steam.js
// @license      MIT
// @icon         https://raw.githubusercontent.com/FerNikoMF/Green-Steam/main/green.png
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // List of buttons to be added
    // url - the link to the pirated game site
    // title - the name of the site to display on the button
    // withSlug - flag indicating whether a slug (game name) should be appended to the URL
    const btnList = [
        { url: "https://www.playground.ru/", title: "Playground", withSlug: true },
        { url: "https://rutracker.net/forum/tracker.php?nm=", title: "Rutracker" }
    ];

    // Array of site URLs where the script will work
    const siteUrls = [
        { url: "https://store.steampowered.com/app/*", title: "Steam" }
    ];

    // Function to convert text into a slug
    // Converts the text to lowercase, removes special characters, and replaces spaces with underscores
    const textToSlug = (text) => {
        if (typeof text !== 'string') return '';
        return text
            .toLowerCase()
            .replace(/[\u2019':]/g, '') // Removes special characters like ’ and :
            .replace(/\s+/g, '_'); // Replaces spaces with underscores
    };

    // Function to convert Roman numerals to Arabic numbers
    const romanToArabic = (roman) => {
        const romanNumerals = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
        let result = 0;
        let prevValue = 0;

        // Traverse the string from end to start and apply appropriate arithmetic operation
        for (let i = roman.length - 1; i >= 0; i--) {
            const value = romanNumerals[roman[i]];
            result += (value < prevValue) ? -value : value;
            prevValue = value;
        }

        return result;
    };

    // Function to create a button linking to a pirate game site
    const createPirateLink = (href, text) => {
        const link = document.createElement('a');
        link.target = '_blank';
        link.classList.add('apphub_OtherSiteInfo');
        link.style.cssText = `
            padding: 1px 15px;
            line-height: 30px;
            font-size: 15px;
            color: #67c1f5;
            background-color: rgba(103, 193, 245, 0.2);
            margin-right: 10px;
            border-radius: 2px;
        `;
        link.href = href;
        link.innerText = text;
        return link;
    };

    // Function to check if the current site matches one of the allowed URLs (Steam in this case)
    const isMatchingSite = () => {
        return siteUrls.some(site => document.URL.match(site.url));
    };

    // Function to retrieve the name of the game from the Steam page
    const getAppName = () => {
        const appNameElement = document.querySelector('.apphub_AppName');
        return appNameElement ? appNameElement.textContent.trim() : '';
    };

    // Function to insert the buttons into the correct location on the page
    const insertButtons = (appName) => {
        const container = document.querySelector('.game_purchase_action_bg:first-child');

        // If the container is found, start adding buttons
        if (container) {
            container.style.cssText = 'height: 32px; max-width: 500px; text-wrap: wrap;';

            btnList.forEach(btn => {
                // Remove Roman numerals from the game name and convert them to Arabic numbers
                const appNameWithoutRomanNumerals = appName.replace(/\b([IVXLCDM]+)\b/g, (match, roman) => romanToArabic(roman));

                // Form the URL for the pirate game site, adding the slug if necessary
                const url = btn.withSlug ? `${btn.url}${textToSlug(appNameWithoutRomanNumerals)}` : `${btn.url}${appNameWithoutRomanNumerals}`;

                // Create the link button and insert it
                const linkElement = createPirateLink(url, btn.title);

                // Insert the button next to existing elements
                const targetElement = document.querySelector('.apphub_OtherSiteInfo');
                if (targetElement) {
                    targetElement.insertAdjacentElement('afterend', linkElement);
                }
            });
        }
    };

    // Function to retry inserting buttons if the game name wasn't found
    const tryInsertButtons = () => {
        const appName = getAppName();

        if (appName) {
            // If game name is found, insert the buttons
            insertButtons(appName);
        } else {
            // If game name isn't found, retry after 2 seconds
            console.log('App name not found, retrying in 2 seconds...');
            setTimeout(tryInsertButtons, 2000);
        }
    };

    // If on the correct site, start the process of inserting buttons
    if (isMatchingSite()) {
        // Wait for 3 seconds before running the script to ensure the DOM is fully loaded
        setTimeout(() => {
            tryInsertButtons();
        }, 3000);
    }
})();
