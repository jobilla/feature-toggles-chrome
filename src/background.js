const tabs = new Map();

function renderFeatures(tabId) {
  if (tabs.has(tabId)) {
    chrome.storage.local.set({ features: tabs.get(tabId) });
  } else {
    chrome.storage.local.set({ features: null });
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
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
});

chrome.tabs.onActivated.addListener(async (tab) => {
  const { tabId } = tab;
  if (tab && tab.hasOwnProperty("tabId")) {
    renderFeatures(tabId);
  } else {
    renderFeatures(tab);
  }
});
