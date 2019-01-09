tabs = new Map();

function renderFeatures(tabId) {
    if (tabs.has(tabId)) {
        chrome.storage.local.set({ features: tabs.get(tabId) });
    } else {
        chrome.storage.local.set({ features: null });
    }

}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.event) {
        case 'usesFeatureToggle':
            tabs.set(sender.tab.id, {});
            chrome.pageAction.show(sender.tab.id);
            if (sender.tab.active) {
                renderFeatures(sender.tab.id);
            }
            sendResponse(true);
            break;
        case 'featureDiscovery':
            tabs.set(sender.tab.id, request.features);
            renderFeatures(sender.tab.id);
    }
});

chrome.tabs.onActivated.addListener(function (tab) {
    renderFeatures(tab);
});
