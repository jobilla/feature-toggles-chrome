const features = {};

function broadcastFeatures() {
    Object.keys(localStorage).filter(key => key.startsWith('_feature.') && key !== '_feature._enabled')
        .forEach(feature => features[feature] = JSON.parse(localStorage.getItem(feature)))

    chrome.runtime.sendMessage({event: 'featureDiscovery', features});
}

chrome.runtime.onMessage.addListener(function (message, sendResponse) {
    if (message.event === 'featureToggled') {
        localStorage.setItem(message.feature, JSON.stringify(message.value));

        sendResponse(true);
        broadcastFeatures();
    }
})

broadcastFeatures();