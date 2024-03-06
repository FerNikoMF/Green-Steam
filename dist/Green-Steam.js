// ==UserScript==
// @name         Stream IMDB
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the Streaming world!
// @author       FerNikoMF
// @match        https://www.imdb.com/title/*
// @grant        none
// ==/UserScript==

(function() {
    const btnList = [
    { url: "https://steamrip.com/?s=", title: "SteamRIP" },
    { url: "https://www.playground.ru/", title: "Playground", withSlug: true },
    { url: "https://rutracker.net/forum/tracker.php?nm=", title: "Rutracker" },
];

const siteUrls = [
    { url: "https://store.steampowered.com/app/*", title: "Steam" },
];

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
})();
