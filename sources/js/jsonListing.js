// jsonListing.js - populate the JSON select and handle loading selection

document.addEventListener('DOMContentLoaded', function () {
    const jsonSelect = document.getElementById('json-select');
    const jsonInput = document.getElementById('json-input');
    const loadBtn = document.getElementById('load-btn');

    if (!jsonSelect || !jsonInput || !loadBtn) return;

    jsonSelect.onchange = () => {
        jsonInput.value = jsonSelect.value;
        if (jsonSelect.value) {
            // any json selected
            jsonInput.hidden = true;
        } else {
            // "Autre" selected
            jsonInput.hidden = false;
        }
    };

    loadBtn.addEventListener('click', () => {
        const url = new URL(window.location.href);
        // if the "Autre" option is selected, use the input value
        if (jsonInput.hidden === false) {
            url.searchParams.set('file', jsonInput.value);
        } else {
            // else use the select value
            url.searchParams.set('file', jsonSelect.value);
        }
        window.location.href = url.href;
    });

    // Populate select with available CV JSON files in a cleaner, robust way
    (async function loadOptions() {
        const BASE_DIR = 'sources/cv-data/';
        const DEFAULT_FILE = 'cv-data.json';

        const toAbsFromBase = (p) => new URL(p, new URL(BASE_DIR, window.location.href)).href;
        const toAbsFromPage = (p) => new URL(p, window.location.href).href;

        async function getFilesByDirectoryScrape() {
            // Fallback: parse simple directory listing HTML
            const res = await fetch(BASE_DIR);
            if (!res.ok) throw new Error(`HTTP ${res.status} for ${BASE_DIR}`);
            const text = await res.text();
            const parser = new DOMParser();
            const html = parser.parseFromString(text, 'text/html');
            const links = Array.from(html.querySelectorAll('a'));
            const baseAbs = new URL(BASE_DIR, window.location.href);
            const list = [];
            for (const link of links) {
                const href = link.getAttribute('href') || '';
                // Resolve relative to the directory page
                const absHref = new URL(href, baseAbs).href;
                if (absHref.toLowerCase().endsWith('.json')) {
                    const label = absHref.split('/').pop();
                    // Convert to a path relative to BASE_DIR for consistency
                    list.push({ path: label, label });
                }
            }
            return list;
        }

        function populateOptions(files) {
            const frag = document.createDocumentFragment();
            const seen = new Set();
            files.forEach(({ path, label }) => {
                const abs = toAbsFromBase(path);
                if (seen.has(abs)) return; // dedupe
                seen.add(abs);
                const opt = document.createElement('option');
                opt.value = abs;
                opt.textContent = label || path;
                frag.appendChild(opt);
            });
            jsonSelect.appendChild(frag);

            const optionOther = document.createElement('option');
            optionOther.value = '';
            optionOther.textContent = 'Autre';
            jsonSelect.appendChild(optionOther);
        }

        function selectDefault(files) {
            const params = new URL(window.location.href).searchParams;
            const fileParam = params.get('file');

            let targetAbs;
            if (fileParam) {
                try { targetAbs = toAbsFromPage(fileParam); } catch (_) { targetAbs = fileParam; }
            } else {
                targetAbs = toAbsFromBase(DEFAULT_FILE);
            }

            // If target not in options, pick first available
            const values = Array.from(jsonSelect.options).map(o => o.value);
            if (values.includes(targetAbs)) {
                jsonSelect.value = targetAbs;
            } else if (values.length) {
                jsonSelect.value = values[0];
            }
            jsonSelect.dispatchEvent(new Event('change'));
        }

        try {
            const files = await getFilesByDirectoryScrape();
            populateOptions(files);
            selectDefault(files);
        } catch (err) {
            console.error('Failed to list sources:', err);
        }
    })();
});
