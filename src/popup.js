const container = document.getElementById('container');

function render() {
    chrome.storage.local.get(['features'], function (result) {
        const features = result.features;

        for (const feature of Object.keys(features)) {
            container.innerHTML = '';
            const wrapper = document.createElement('div');
            const el = document.createElement('input');
            el.setAttribute('type', 'checkbox');
            el.setAttribute('id', feature);
            el.setAttribute('checked', `${features[feature].enabled}`);
            el.addEventListener('change', function (event) {
                features[event.target.id].enabled = event.target.checked;

                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {event: 'featureToggled', 'feature': event.target.id, value: features[event.target.id] });
                });
            });
            const label = document.createElement('label');
            label.setAttribute('for', feature);
            label.innerText = features[feature].name;
            wrapper.appendChild(el);
            wrapper.appendChild(label);

            container.appendChild(wrapper);
        }
    });
}

chrome.storage.onChanged.addListener(function (change) {
    if (change.hasOwnProperty('features')) {
        render();
    }
})

window.onload = render;