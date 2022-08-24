chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get({removeParams: ""})
    .then(storage => {
        if(storage.removeParams) return;
        chrome.storage.local.set({removeParams: "fbclid\nutm_source\nutm_medium\nutm_campaign\nutm_term\nutm_content"});
    });
});

chrome.runtime.onMessage.addListener((request, _, callback) => {
    if(request.command !== "loadRemoveParams")
        return console.error("unknown command " + request.command);
    loadRemoveParams(request.removeParams).then(callback);
    return true;
});

Promise.all([
    chrome.storage.local.get({removeParams: ""}),
    chrome.declarativeNetRequest.getSessionRules()
]).then(([storage, rules]) => {
    const removeParams = storage.removeParams.split("\n");
    loadRemoveParams(removeParams, rules);
});


/**
 * Functions
 */

/**
 * Reload redirecting rule by removing all and adding new one.
 * @param {string[]} removeParams
 * @param {Rule} currentRules
 */
async function loadRemoveParams(removeParams, currentRules = null) {
    if(!currentRules)
        currentRules = await chrome.declarativeNetRequest.getSessionRules();

    const removeRuleIds = currentRules.map(rule => rule.id);
    await chrome.declarativeNetRequest.updateSessionRules({
        addRules: [{
            id: 1,
            priority: 1,
            condition: {resourceTypes: ["main_frame"]},
            action: {
                type: "redirect",
                redirect: {
                    transform: {
                        queryTransform: {removeParams}
                    }
                }
            }
        }],
        removeRuleIds
    });
}
