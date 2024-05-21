// ==UserScript==
// @name         Green Steam
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @author       FerNikoMF & Muxammadaziz04
// @description  Just adding a pirated link to all the games in the Steam store
// @match        https://store.steampowered.com/app/*
// @homepage     https://github.com/FerNikoMF/Green-Steam
// @downloadURL  https://raw.githubusercontent.com/FerNikoMF/Green-Steam/main/dist/Green-Steam.js
// @updateURL    https://raw.githubusercontent.com/FerNikoMF/Green-Steam/main/dist/Green-Steam.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @license      MIT
// @icon         https://raw.githubusercontent.com/FerNikoMF/Green-Steam/main/green.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const btnList = [
        { url: "https://www.playground.ru/", title: "Playground", withSlug: true },
        { url: "https://rutracker.net/forum/tracker.php?nm=", title: "Rutracker" }
    ];

    const siteUrls = [
        { url: "https://store.steampowered.com/app/*", title: "Steam" }
    ];

    const textToSlug = (text) => {
        if (typeof text !== 'string') return '';
        return text
            .toLowerCase()
            .replace(/[\u2019':]/g, '') // Remove special characters like ’ and :
            .replace(/\s+/g, '_'); // Replace spaces with underscores
    };

    const romanToArabic = (roman) => {
        const romanNumerals = {
            I: 1,
            V: 5,
            X: 10,
            L: 50,
            C: 100,
            D: 500,
            M: 1000
        };

        let result = 0;
        let prevValue = 0;

        for (let i = roman.length - 1; i >= 0; i--) {
            const value = romanNumerals[roman[i]];
            if (value < prevValue) {
                result -= value;
            } else {
                result += value;
            }
            prevValue = value;
        }

        return result;
    };

    const furnishSteamLink = (href, text) => {
        const element = document.createElement('a');
        element.target = '_blank';
        element.classList.add('apphub_OtherSiteInfo');
        element.style.cssText = 'padding: 1px 15px; line-height: 30px; font-size: 15px; color: #67c1f5; background-color: rgba(103, 193, 245, 0.2); margin-right: 10px; border-radius: 2px;';
        element.href = href;
        element.innerText = text;
        return element;
    };

    const isMatchingSite = (url) => {
        return siteUrls.some(site => document.URL.match(site.url));
    };

    const getAppName = () => {
        const appNameElement = document.querySelector('.apphub_AppName');
        return appNameElement ? appNameElement.textContent.trim() : '';
    };

    const insertButtons = (appName) => {
        const container = document.querySelector('.game_purchase_action_bg:first-child');
        if (container) {
            container.style.cssText = 'height: 32px; max-width: 500px; text-wrap: wrap';

            btnList.forEach(btn => {
                const appNameWithoutRomanNumerals = appName.replace(/\b([IVXLCDM]+)\b/g, (match, roman) => romanToArabic(roman));
                const url = btn.withSlug ? `${btn.url}${textToSlug(appNameWithoutRomanNumerals)}` : `${btn.url}${appNameWithoutRomanNumerals}`;
                const linkElement = furnishSteamLink(url, btn.title);
                const targetElement = document.querySelector('.apphub_OtherSiteInfo');
                if (targetElement) {
                    targetElement.insertAdjacentElement('afterend', linkElement);
                }
            });
        }
    };

    if (isMatchingSite(document.URL)) {
        const appName = getAppName();
        if (appName) {
            insertButtons(appName);
        }
    }
})();
