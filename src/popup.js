const container = document.getElementById("container");
container.innerHTML =
  "<p>No features found.</p><p>You can try to refresh this page</p>";

function render() {
  chrome.storage.local.get(["features"], (result) => {
    let features;
    if (result.hasOwnProperty("features")) {
      features = result.features;
    } else {
      return;
    }

    if (features) {
      container.innerHTML = "";
      for (const feature of Object.keys(features)) {
        const wrapper = document.createElement("div");
        const el = document.createElement("input");
        el.setAttribute("type", "checkbox");
        el.setAttribute("id", feature);
        if (features[feature].enabled) {
          el.setAttribute("checked", features[feature].enabled);
        }
        el.addEventListener("change", (event) => {
          features[event.target.id].enabled = event.target.checked;
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
              event: "featureToggled",
              feature: event.target.id,
              value: features[event.target.id],
            });
          });
        });

        const label = document.createElement("label");
        label.setAttribute("for", feature);
        label.setAttribute("class", "switch");

        const toggleText = document.createElement("div");
        toggleText.innerText = features[feature].name;
        toggleText.setAttribute("class", "switchText");

        const span = document.createElement("span");
        span.setAttribute("class", "slider round");

        label.appendChild(el);
        label.appendChild(span);

        wrapper.setAttribute("class", "toggleContainer");
        wrapper.appendChild(label);
        wrapper.appendChild(toggleText);

        container.appendChild(wrapper);
      }
    }
  });
}

chrome.storage.onChanged.addListener((change) => {
  if (change.hasOwnProperty("features")) {
    render();
  }
});

window.onload = render;
