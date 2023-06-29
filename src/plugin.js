if (
    localStorage.getItem("_feature._enabled") !== null &&
    JSON.parse(localStorage.getItem("_feature._enabled")) === true
) {
    chrome.runtime.sendMessage({event: "usesFeatureToggle"}).then((response) => {
        console.log("Feature toggle message sent", response);
    });
}

const features = {};
const broadcastFeatures = () => {
    Object.keys(localStorage)
        .filter((key) => key.startsWith("_feature.") && key !== "_feature._enabled")
        .forEach((feature) => {
            console.log('found feature', feature);
            let feat = localStorage.getItem(feature);
            if (typeof feat === "string") {
                features[feature] = JSON.parse(feat);
            } else {
                features[feature] = feat;
            }
        });
    chrome.runtime.sendMessage({event: "featureDiscovery", features});
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.event === "featureToggled") {
        localStorage.setItem(message.feature, JSON.stringify(message.value));
        sendResponse(true);
        broadcastFeatures();
    }
    return true;
});

broadcastFeatures();
