chrome.runtime.onInstalled.addListener(async() => {
    console.debug("runtime.onInstalled");
    let {removeParams} = await chrome.storage.local.get({removeParams: null});
    if(removeParams?.forEach) return;

    if(removeParams === null) {
        // new installed
        const defaultRP = await fetch(chrome.runtime.getURL("defaultRemoveParams.txt")).then(res => res.text());
        removeParams = defaultRP.split(/\s+/);
    }
    else if(typeof removeParams === "string") {
        // updated from v0.1
        removeParams = removeParams.split(/\s+/);
    }
    chrome.storage.local.set({removeParams});
});

chrome.storage.onChanged.addListener(async(changes) => {
    console.debug("storage.onChanged");
    if(!changes.removeParams) return;
    const removeParams = changes.removeParams.newValue ?? [];
    const currentRules = await chrome.declarativeNetRequest.getDynamicRules();
    const removeRuleIds = currentRules.map(rule => rule.id);
    chrome.declarativeNetRequest.updateDynamicRules({
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
});
