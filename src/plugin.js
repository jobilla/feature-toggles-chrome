const features = {};
function broadcastFeatures() {
    Object.keys(localStorage).filter(key => key.startsWith('_feature.') && (key !== '_feature._enabled'))
        .forEach(feature => {
            let feat = localStorage.getItem(feature);
            if (typeof feat === "string") {
                features[feature] = JSON.parse(feat);
            } else {
                features[feature] = feat;
            }
        })
    chrome.runtime.sendMessage({event: 'featureDiscovery', features});
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.event === 'featureToggled') {
        localStorage.setItem(message.feature, JSON.stringify(message.value));
        sendResponse(true);
        broadcastFeatures();
    }
})

broadcastFeatures();