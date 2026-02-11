// i18n.js - translation loading and initialization

function loadI18n() {
    const langs = ['en', 'fr'];
    const translations = {};
    const promises = langs.map(lang => {
        return new Promise((resolve, reject) => {
            const fileURL = "sources/i18n/" + lang + ".json";
            const request = new XMLHttpRequest();
            request.open("GET", fileURL, true);
            request.responseType = "json";
            request.onload = function () {
                if (request.status >= 200 && request.status < 300) {
                    translations[lang] = { translation: request.response };
                    resolve();
                } else {
                    reject(new Error('Request failed: ' + request.statusText));
                }
            };
            request.onerror = function () {
                reject(new Error('Network error'));
            };
            request.send();
        });
    });

    return Promise.all(promises).then(() => translations);
}

function initI18n(translations, lang = 'fr') {
    i18next.init({
        lng: lang,
        resources: translations,
        // debug: true,
    });
}
