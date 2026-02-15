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
        let DEFAULT_FILE = 'cv-data.json';

        try {
            const resp = await fetch('sources/cv-data/default.txt');
            if (resp.ok) {
                const txt = await resp.text();
                if (txt.trim()) DEFAULT_FILE = txt.trim();
            }
        } catch (e) {
            console.warn('Could not read default.txt for dropdown selection');
        }

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
            
            const list = [];
            // Use window.location as base to resolve relative paths
            const baseAbs = new URL(BASE_DIR, window.location.href);

            for (const link of links) {
                const href = link.getAttribute('href') || '';
                // Resolve relative to the directory page
                const absHref = new URL(href, baseAbs).href;

                // Skip parent dir link
                if (href === '../' || href === './') continue;

                if (absHref.toLowerCase().endsWith('.json')) {
                    // Extract filename part
                    const label = decodeURIComponent(absHref.split('/').pop());
                    list.push({ path: label, label });
                }
            }
            return list;
        }

        function populateOptions(files) {
            // Clear existing options except maybe a placeholder if present
            while (jsonSelect.firstChild) {
                jsonSelect.removeChild(jsonSelect.firstChild);
            }

            const frag = document.createDocumentFragment();
            const seen = new Set();
            
            files.forEach(({ path, label }) => {
                // Construct absolute URL for value
                const abs = new URL(path, new URL(BASE_DIR, window.location.href)).href;
                if (seen.has(abs)) return; // dedupe
                seen.add(abs);
                
                const opt = document.createElement('option');
                opt.value = abs;
                opt.textContent = label || path;
                frag.appendChild(opt);
            });
            jsonSelect.appendChild(frag);

            // Add "Autre" option
            const optionOther = document.createElement('option');
            optionOther.value = "";
            optionOther.textContent = "Autre...";
            jsonSelect.appendChild(optionOther);
        }

        function selectDefault(files) {
            const params = new URL(window.location.href).searchParams;
            const fileParam = params.get('file');

            let targetAbs;
            if (fileParam) {
                // If param is present, try to match it
                try {
                    // check if absolute or relative
                     if (fileParam.includes('://')) {
                         targetAbs = fileParam;
                     } else {
                         targetAbs = new URL(fileParam, window.location.href).href;
                     }
                } catch (_) { 
                    targetAbs = fileParam; 
                }
            } else {
                // If no param, use the detected DEFAULT_FILE
                targetAbs = new URL(DEFAULT_FILE, new URL(BASE_DIR, window.location.href)).href;
            }

            // Clean up targetAbs to match option values (which are full URLs)
            
            let found = false;
            for (let i = 0; i < jsonSelect.options.length; i++) {
                if (jsonSelect.options[i].value === targetAbs) {
                    jsonSelect.selectedIndex = i;
                    found = true;
                    break;
                }
            }
            
            // If not found, check if it ends with the target file name (looser match)
            if (!found && targetAbs) {
                const targetName = targetAbs.split('/').pop();
                for (let i = 0; i < jsonSelect.options.length; i++) {
                    const optVal = jsonSelect.options[i].value;
                    if (optVal.endsWith('/' + targetName) || optVal === targetName) {
                        jsonSelect.selectedIndex = i;
                        found = true;
                        break;
                    }
                }
            }

            // If still not found but we have options, select the first one? 
            // Better to select nothing or let the user choose, but for now user wants default selected.
            
            jsonSelect.dispatchEvent(new Event('change'));
        }

        try {
            const files = await getFilesByDirectoryScrape();
            populateOptions(files);
            selectDefault(files);
        } catch (err) {
            console.error('Failed to list sources:', err);
            // Fallback if listing fails: just add the default file as an option
            const list = [{ path: DEFAULT_FILE, label: DEFAULT_FILE }];
            populateOptions(list);
            selectDefault(list);
        }
    })();
});
