// ==UserScript==
// @name         Green Steam
// @namespace    http://tampermonkey.net/
// @author       FerNikoMF & Muxammadaziz04
// @version      0.1
// @description  Just adding a pirated link to all the games in the Steam store
// @match        https://store.steampowered.com/app/*
// @homepage     https://github.com/FerNikoMF/Green-Steam
// @homepageURL  https://github.com/FerNikoMF/Green-Steam
// @downloadURL  hhttps://raw.githubusercontent.com/FerNikoMF/Green-Steam/main/dist/Green-Steam.js
// @updateURL    https://raw.githubusercontent.com/FerNikoMF/Green-Steam/main/dist/Green-Steam.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        none
// @license      MIT
// @match        https://store.steampowered.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @grant        none
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    const btnList = [
    { url: "https://steamrip.com/?s=", title: "SteamRIP" },
    { url: "https://www.playground.ru/", title: "Playground", withSlug: true },
    { url: "https://rutracker.net/forum/tracker.php?nm=", title: "Rutracker" },
];

const siteUrls = [
    { url: "https://store.steampowered.com/app/*", title: "Steam" },
];

let siteResult = "";

siteUrls.forEach((el) => {
    if (document.URL.match(el.url)) siteResult = el.title;
});

let appName = "";

if(siteResult == 'Steam'){
    appName = document.querySelector(".apphub_AppName").textContent.trim();
    document.querySelector(".game_purchase_action_bg:first-child").style.cssText = "height: 50px; max-width: 500px; text-wrap: wrap";

    btnList.forEach((el) => {
        const url = el?.withSlug ? el.url + textToSlug(appName) : el.url + appName
        document.querySelector(".apphub_OtherSiteInfo").insertAdjacentElement("afterend", furnishSteamLink(url, el.title));
    });
}

function textToSlug(text) {
    if(typeof text !== 'string') return ''
    return text?.toLowerCase()?.split(' ')?.join('_')
}

function furnishSteamLink(href, text) {
    const element = document.createElement("a");
    element.target = "_blank";
    element.classList.add("apphub_OtherSiteInfo");
    element.style.cssText = "padding: 1px 15px; line-height: 30px; font-size: 15px; color: #67c1f5; background-color: rgba(103, 193, 245, 0.2); margin-right: 10px; border-radius: 2px;";
    element.href = href;
    element.innerText = text;
    return element;
}
})()
