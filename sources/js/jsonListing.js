// jsonListing.js - populate the JSON select and handle loading selection

document.addEventListener('DOMContentLoaded', function () {
    const jsonSelect = document.getElementById('json-select');

    if (!jsonSelect) return;

    jsonSelect.onchange = () => {
        if (!jsonSelect.value) return;
        hidePlaceholderIfSelected();
        const url = new URL(window.location.href);
        url.searchParams.set('file', jsonSelect.value);
        window.location.href = url.href;
    };

    function hidePlaceholderIfSelected() {
        if (!jsonSelect.value) return;
        const placeholder = Array.from(jsonSelect.options).find(opt => opt.value === '');
        if (placeholder) {
            placeholder.remove();
        }
    }

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

        function parseLenientJson(text) {
            const withoutComments = text
                .replace(/\/\*[\s\S]*?\*\//g, '')
                .replace(/(^|[^:\\])\/\/.*$/gm, '$1');
            const withoutTrailingCommas = withoutComments.replace(/,\s*([}\]])/g, '$1');
            return JSON.parse(withoutTrailingCommas);
        }

        async function enrichFilesWithMeta(files) {
            const pageUrl = new URL(window.location.href);
            const fileParam = pageUrl.searchParams.get('file');
            let currentFileAbs = null;
            if (fileParam) {
                try {
                    currentFileAbs = fileParam.includes('://')
                        ? fileParam
                        : new URL(fileParam, window.location.href).href;
                } catch (_) {
                    currentFileAbs = fileParam;
                }
            }

            const enriched = await Promise.all(files.map(async ({ path, label }) => {
                const abs = new URL(path, new URL(BASE_DIR, window.location.href)).href;
                try {
                    const response = await fetch(abs, { cache: 'no-cache' });
                    if (!response.ok) return { path, label, hidden: false, abs };

                    const text = await response.text();
                    const jsonData = parseLenientJson(text);
                    const title = jsonData?.meta?.title;
                    const hidden = Boolean(jsonData?.meta?.hidden);

                    return {
                        path,
                        label: title || label,
                        hidden,
                        abs,
                    };
                } catch (error) {
                    return { path, label, hidden: false, abs };
                }
            }));

            return enriched.filter(item => !item.hidden || item.abs === currentFileAbs);
        }

        function populateOptions(files) {
            while (jsonSelect.firstChild) {
                jsonSelect.removeChild(jsonSelect.firstChild);
            }

            const placeholderOption = document.createElement('option');
            placeholderOption.value = '';
            placeholderOption.textContent = 'Choisir un CV...';
            placeholderOption.selected = true;
            jsonSelect.appendChild(placeholderOption);

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
                targetAbs = new URL(DEFAULT_FILE, new URL(BASE_DIR, window.location.href)).href;
            }

            let found = false;
            for (let i = 0; i < jsonSelect.options.length; i++) {
                if (jsonSelect.options[i].value === targetAbs) {
                    jsonSelect.selectedIndex = i;
                    found = true;
                    break;
                }
            }
            
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

            if (!found) {
                jsonSelect.selectedIndex = 0;
            } else {
                hidePlaceholderIfSelected();
            }
        }

        try {
            const files = await getFilesByDirectoryScrape();
            const visibleFiles = await enrichFilesWithMeta(files);
            populateOptions(visibleFiles);
            selectDefault(visibleFiles);
        } catch (err) {
            console.error('Failed to list sources:', err);
            const list = [{ path: DEFAULT_FILE, label: DEFAULT_FILE }];
            populateOptions(list);
            selectDefault(list);
        }
    })();
});
