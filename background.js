chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get({targets: ""})
    .then(storage => {
        if(storage.targets) return;
        chrome.storage.local.set({targets: "fbclid\nutm_source\nutm_medium\nutm_campaign\nutm_term\nutm_content"});
    });
});

Promise.all([
    chrome.storage.local.get({targets: ""}),
    chrome.declarativeNetRequest.getSessionRules()
]).then(([storage, rules]) => {
    const removeParams = storage.targets.split("\n");
    const removeRuleIds = rules.map(rule => rule.id);
    chrome.declarativeNetRequest.updateSessionRules({
        addRules: [{
            id: 1,
            priority: 1,
            condition: {
                resourceTypes: ["main_frame"]
            },
            action: {
                type: "redirect",
                redirect: {
                    transform: {
                        queryTransform: {
                            removeParams
                        }
                    }
                }
            }
        }],
        removeRuleIds
    });
    console.debug(removeParams);
});
