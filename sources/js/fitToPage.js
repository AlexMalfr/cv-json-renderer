// fitToPage.js - fit #cv to container width on mobile only

let fitTimer = null;

function resetFit(cv, cvContainer) {
    cvContainer.style.setProperty('--cv-scale', '1');
    cvContainer.style.height = 'auto';
}

function fitToPage() {
    const cv = document.getElementById('cv');
    const cvContainer = document.getElementById('cv-container');
    if (!cv || !cvContainer) return;

    if (window.matchMedia('print').matches || !window.matchMedia('(max-width: 900px)').matches) {
        resetFit(cv, cvContainer);
        return;
    }

    const containerStyle = getComputedStyle(cvContainer);
    const paddingX = parseFloat(containerStyle.paddingLeft || '0') + parseFloat(containerStyle.paddingRight || '0');
    const paddingY = parseFloat(containerStyle.paddingTop || '0') + parseFloat(containerStyle.paddingBottom || '0');
    const availableWidth = Math.max(1, cvContainer.clientWidth - paddingX);

    const currentScale = parseFloat(getComputedStyle(cvContainer).getPropertyValue('--cv-scale')) || 1;
    const renderedWidth = cv.getBoundingClientRect().width || 1;
    const renderedHeight = cv.getBoundingClientRect().height || 1;

    const baseWidth = renderedWidth / currentScale;
    const baseHeight = renderedHeight / currentScale;

    const scale = Math.min(1, availableWidth / baseWidth);
    cvContainer.style.setProperty('--cv-scale', String(scale));

    const scaledHeight = baseHeight * scale;
    if (scaledHeight > 0) {
        cvContainer.style.height = `${Math.ceil(scaledHeight + paddingY)}px`;
    }
}

function scheduleFit() {
    if (fitTimer) {
        clearTimeout(fitTimer);
    }

    requestAnimationFrame(() => fitToPage());
    fitTimer = setTimeout(() => fitToPage(), 50);
}

window.addEventListener('resize', scheduleFit);
window.addEventListener('orientationchange', scheduleFit);
window.addEventListener('load', scheduleFit);

window.addEventListener('beforeprint', () => {
    const cv = document.getElementById('cv');
    const cvContainer = document.getElementById('cv-container');
    if (!cv || !cvContainer) return;
    resetFit(cv, cvContainer);
});

window.addEventListener('afterprint', scheduleFit);

if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', scheduleFit);
}

const fitObserver = new ResizeObserver(() => scheduleFit());
window.addEventListener('DOMContentLoaded', () => {
    const cvContainer = document.getElementById('cv-container');
    if (cvContainer) {
        fitObserver.observe(cvContainer);
    }
});
