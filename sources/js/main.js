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
    let fileURL = "sources/cv-data/cv-data.json"; // fallback default
    const urlParams = new URLSearchParams(window.location.search);
    const fileParam = urlParams.get('file');
    
    if (fileParam) {
        fileURL = fileParam;
    } else {
        // Try to read default filename from default.txt if no param provided
        try {
            const defaultResp = await fetch("sources/cv-data/default.txt", { cache: 'no-cache' });
            if (defaultResp.ok) {
                const defaultName = (await defaultResp.text()).trim();
                // Check if the default file actually exists
                if (defaultName) {
                    const checkResp = await fetch("sources/cv-data/" + defaultName, { method: 'HEAD' });
                    if (checkResp.ok) {
                        fileURL = "sources/cv-data/" + defaultName;
                    } else {
                        console.warn(`Default file '${defaultName}' not found (HTTP ${checkResp.status}), falling back to cv-data.json`);
                    }
                }
            } else {
                console.warn("Could not load default.txt (HTTP " + defaultResp.status + "), using fallback cv-data.json");
            }
        } catch (e) {
            console.warn("Could not load default.txt, using fallback cv-data.json", e);
        }
    }

    function handleLoadError(error) {
        console.error('Failed to load CV data:', error);
        
        // Update Title
        const title = document.getElementById('title');
        if (title) title.textContent = "Erreur de chargement du CV";

        const cvContainer = document.getElementById('cv-container');
        if (cvContainer) {
            // Check if #cv exists inside, if so, hide it.
            const cvElem = document.getElementById('cv');
            if (cvElem) cvElem.style.display = 'none';
            
            // Build error UI
            const errorWrapper = document.createElement('div');
            errorWrapper.style.textAlign = 'center';
            errorWrapper.style.padding = '50px';
            errorWrapper.style.fontFamily = '"Kanit", sans-serif';

            const userMsg = document.createElement('h2');
            userMsg.style.color = '#e74c3c';
            userMsg.style.display = 'flex';
            userMsg.style.alignItems = 'center';
            userMsg.style.justifyContent = 'center';
            userMsg.style.gap = '15px';
            
            const icon = document.createElement('i');
            icon.className = 'fas fa-exclamation-triangle';
            // icon.style.fontSize = '48px'; // inherit from h2
            userMsg.appendChild(icon);
            
            userMsg.appendChild(document.createTextNode("Oups ! Impossible de charger le CV."));
            errorWrapper.appendChild(userMsg);

            const userDesc = document.createElement('p');
            userDesc.innerHTML = "Une erreur est survenue lors de la récupération des données.<br>Veuillez vérifier l'URL ou réessayer plus tard.";
            errorWrapper.appendChild(userDesc);

            // Technical details
            const details = document.createElement('details');
            details.style.marginTop = '20px';
            details.style.textAlign = 'left';
            details.style.color = '#555';
            details.style.cursor = 'pointer';
            
            // Align with body text padding from css
            details.style.paddingInline = 'min(100px, 10%)';
            details.style.maxWidth = '800px'; 
            details.style.marginInline = 'auto';

            const summary = document.createElement('summary');
            summary.textContent = "Voir les détails techniques";
            summary.style.outline = 'none';
            summary.style.textAlign = 'center';
            details.appendChild(summary);

            const pre = document.createElement('pre');
            pre.style.backgroundColor = '#f8f8f8';
            pre.style.padding = '15px';
            pre.style.marginTop = '10px';
            pre.style.border = '1px solid #ddd';
            pre.style.borderRadius = '4px';
            pre.style.overflowX = 'auto';
            pre.style.fontSize = '0.9em';
            pre.style.textAlign = 'left'; 
            
            let errorDetails = `Attempted to load: "${fileURL}"\n\n`;
            errorDetails += error.toString() + "\n\n";
            if (error.stack) {
                errorDetails += "Stack Trace:\n" + error.stack;
            }
            pre.textContent = errorDetails;
            
            details.appendChild(pre);

            cvContainer.appendChild(errorWrapper);
            
            // Append details outside of error wrapper (or inside, but it's part of the error display)
            // It's cleaner to keep it separate or at least visually distinct?
            // User asked for same margin as body text.
            errorWrapper.appendChild(details);
        }
        
        // Disable print button
        const printBtn = document.getElementById('print-btn');
        if (printBtn) {
            printBtn.classList.add('disabled');
            printBtn.classList.add('print-hidden'); 
            printBtn.disabled = true;
        }
    }

    try {
        const response = await fetch(fileURL, { cache: 'no-cache' });
        if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText} while fetching "${fileURL}"`);
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

        displayCV(cvData, meta);

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
        handleLoadError(error);
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
