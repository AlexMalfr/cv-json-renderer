// main.js - bootstrap: init i18n, load data, render, wire UI

document.addEventListener('DOMContentLoaded', async function () {
    // Initialize translations
    try {
        const translations = await loadI18n();
        initI18n(translations);
    } catch (error) {
        console.error('Failed to load translations:', error);
    }

    // Load JSON data from file or query string
    let fileURL = "sources/cv-data/cv-data.json"; // default
    const urlParams = new URLSearchParams(window.location.search);
    const fileParam = urlParams.get('file');
    if (fileParam) fileURL = fileParam;

    try {
        const response = await fetch(fileURL, { cache: 'no-cache' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const rawJson = await response.text();
        const jsonData = parseLenientJson(rawJson);

        const cvData = jsonData.data;
        const meta = jsonData.meta;

        // Select locale from CV meta (preferred), with common fallbacks
        let locale = (meta?.locale || meta?.lang || meta?.language || '').toString().slice(0, 2).toLowerCase();
        const supported = ['en', 'fr'];
        if (!supported.includes(locale)) {
            // fallback to previously saved or browser language if meta is missing/unsupported
            const savedLang = (typeof localStorage !== 'undefined' && localStorage.getItem('lang')) || '';
            const browserLang = (navigator.language || '').slice(0, 2).toLowerCase();
            locale = supported.includes(savedLang) ? savedLang : supported.includes(browserLang) ? browserLang : 'fr';
        }

        // Apply locale to document and i18n before rendering
        try { document.documentElement.lang = locale; } catch {}
        if (typeof i18next !== 'undefined' && i18next.language !== locale) {
            try { await i18next.changeLanguage(locale); } catch {}
        }
        try { localStorage.setItem('lang', locale); } catch {}

        displayCV(cvData);

        // Update title and favicon from the JSON data
        document.title = `${cvData.name} - CV ${meta?.title ?? ''}`.trim();
        const favicon = document.getElementById('favicon');
        if (favicon) favicon.href = cvData.profile_picture;

        // Update page title heading
        const title = document.getElementById('title');
        if (title) title.textContent = `${cvData.name} - CV`;

        // Fit rendered CV to page
        if (typeof fitToPage === 'function') {
            // small delay to ensure layout is computed
            requestAnimationFrame(() => fitToPage());
        }
    } catch (error) {
        console.error('Failed to load CV data:', error);
    }

    // Bind print button
    const printBtn = document.getElementById('print-btn');
    if (printBtn) {
        printBtn.addEventListener('click', () => window.print());
    }
});

function parseLenientJson(text) {
    const withoutComments = text
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/(^|[^:\\])\/\/.*$/gm, '$1');
    const withoutTrailingCommas = withoutComments.replace(/,\s*([}\]])/g, '$1');
    return JSON.parse(withoutTrailingCommas);
}
