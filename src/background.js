const tabs = new Map();

function renderFeatures(tabId) {
    if (tabs.has(tabId)) {
        chrome.storage.local.set({ features: tabs.get(tabId) });
    } else {
        chrome.storage.local.set({ features: null });
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.event) {
        case "usesFeatureToggle":
            if (!tabs.has(sender.tab.id)) {
                tabs.set(sender.tab.id, {});
            }
            if (sender.tab.active) {
                renderFeatures(sender.tab.id);
            }
            sendResponse(true);
            break;
        case "featureDiscovery":
            tabs.set(sender.tab.id, request.features);
            renderFeatures(sender.tab.id);
            break;
    }
    return true;
});

chrome.action.onClicked.addListener((tab) => {
    renderFeatures(tab.id);
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    const {tabId} = activeInfo;
    renderFeatures(tabId);
});
