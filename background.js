"use strict";

/**
 * Maintains a global persistent variable.
 */
let targets = [];
getData({targets: ""})
.then(storage => {
    if(targets.length) return; //< in case that runtime.onInstalled has updated it.
    targets = storage.targets.split("\n");
});


/**
 * On installation and update
 */
proxy.runtime.onInstalled.addListener(() => {
    getData({targets: ""})
    .then(storage => {
        const defaultList = "fbclid,utm_source,utm_medium,utm_campaign,utm_term,utm_content".split(",");
        const currentList = storage.targets.split("\n");
        targets = currentList.concat(defaultList)
            .filter((value, index, self) => value && self.indexOf(value) === index)
        ;
        setData({targets: targets.join("\n")});
    });
});


/**
 * Redirect requests.
 */
const listener = details => {
    const url = new URL(details.url);
    const params = url.searchParams;
    let match = false;
    console.log("haha", proxy.storage.local.get);
    targets.forEach(name => {
        if(!params.has(name)) return;
        params.delete(name);
        match = true;
    });
    return match ? {redirectUrl: url.href} : {cancel: false};
};
proxy.webRequest.onBeforeRequest.addListener(
    listener,
    {urls: ["*://*/*"], types: ["main_frame"]},
    ["blocking"]
);


/**
 * It's very different for Chrome to block requests asynchronously.
 * The options_ui shall send a message after updating the list
 * and therefore here in background we can update variable `targets`,
 * which is used to check the URL synchronously.
 */
proxy.runtime.onMessage.addListener(message => {
    if(message === "targetListUpdated") {
        getData("targets").then(storage => targets = storage.targets.split("\n"));
    }
});
