if (localStorage.getItem('_feature._enabled') !== null && JSON.parse(localStorage.getItem('_feature._enabled')) === true) {
    chrome.runtime.sendMessage({ event: 'usesFeatureToggle' });
}