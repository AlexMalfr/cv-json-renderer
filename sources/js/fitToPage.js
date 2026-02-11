// fitToPage.js - scale #cv to fit container width

function fitToPage() {
    const cv = document.getElementById('cv');
    const cvContainer = document.getElementById('cv-container');
    if (!cv || !cvContainer) return;
    const cvContainerWidth = cvContainer.offsetWidth;
    const cvWidth = cv.offsetWidth || 1; // avoid divide by zero before layout
    const scaleRaw = cvContainerWidth / cvWidth;
    const scale = Math.min(Math.max(scaleRaw, 0.5), 1);
    cv.style.transform = `scale(${scale})`;
}

window.addEventListener('resize', fitToPage);
