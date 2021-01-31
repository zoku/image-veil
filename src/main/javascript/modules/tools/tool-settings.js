document.addEventListener('contextmenu', function (e) {
    e.preventDefault();

    if (documentTouched) return;

    if (toolSettings.getAttribute('data-tool') === 'none') {
        return;
    }

    if (toolSettings.getAttribute('data-tool') === 'brush') { // Also eraser
        toolSettingsCallback = function() {
            setBrushSize(toolSettings.getAttribute('data-value-log'));
            brushOutline_canvas.style.left = e.offsetX - brushSize * zoomFactor / 2 + 'px';
            brushOutline_canvas.style.top = e.offsetY - brushSize * zoomFactor / 2 + 'px';
        };
    }

    if (toolSettings.getAttribute('data-tool') === 'zoom') {
        // toolSettings.setAttribute('data-value-percent', (settingsPercent * 100).toFixed(2));
    }

    toolSettings.style.left = e.clientX + 'px';
    toolSettings.style.top = e.clientY + 'px';
    toolSettings.style.display = 'block';
});

document.addEventListener('click', function () {
    toolSettings.style.display = 'none';
});

toolSettingsKnob.addEventListener('touchstart', function (e) {
    if (toolSettings.getAttribute('data-tool') === 'none') {
        return;
    }

    if (toolSettings.getAttribute('data-tool') === 'brush') { // Also eraser
        toolSettingsCallback = function() {
            setBrushSize(toolSettings.getAttribute('data-value-log'));
            brushOutline_canvas.style.left = e.touches[0].offsetX - brushSize * zoomFactor / 2 + 'px';
            brushOutline_canvas.style.top = e.touches[0].offsetY - brushSize * zoomFactor / 2 + 'px';
        };
    }

    document.addEventListener('touchmove', moveToolSettingsKnob);
    document.addEventListener('touchend', unmoveToolSettingsKnob);

    toolSettingsLabel.style.display = 'block';
});

toolSettingsKnob.addEventListener('mousedown', function () {
    document.addEventListener('mousemove', moveToolSettingsKnob);
    document.addEventListener('mouseup', unmoveToolSettingsKnob);

    toolSettingsLabel.style.display = 'block';
});

function unmoveToolSettingsKnob() {
    document.removeEventListener('mousemove', moveToolSettingsKnob);
    document.removeEventListener('mouseup', unmoveToolSettingsKnob);

    document.removeEventListener('touchmove', unmoveToolSettingsKnob);
    document.removeEventListener('touchend', unmoveToolSettingsKnob);

    toolSettingsLabel.style.display = 'none';
    toolSettings.style.display = 'none';

    toolSettingsCallback();
}

function moveToolSettingsKnob(e) {
    let clientX = e.clientX || e.touches[0].clientX;

    let settingsOffset = offset(toolSettingsRail).left;
    let settingsMinPx = 0 - (toolSettingsKnob.clientWidth / 2);
    let settingsMaxPx = toolSettingsRail.clientWidth - (toolSettingsKnob.clientWidth / 2);
    let newSettingsPositionPx = clientX - settingsOffset - (toolSettingsKnob.clientWidth / 2);

    if (newSettingsPositionPx < settingsMinPx) { newSettingsPositionPx = settingsMinPx; }
    if (newSettingsPositionPx > settingsMaxPx) { newSettingsPositionPx = settingsMaxPx; }

    let settingsPercent = (newSettingsPositionPx + (toolSettingsKnob.clientWidth / 2)) / (settingsMaxPx + (toolSettingsKnob.clientWidth / 2));
    let settingsLog = getLogValues(settingsPercent, 1, 3000);

    toolSettingsKnob.style.left = newSettingsPositionPx + 'px';

    if (toolSettings.getAttribute('data-label-mode') === '%') {
        toolSettingsLabel.innerHTML = (settingsPercent * 100).toFixed(0) + ' %';
    } else if (toolSettings.getAttribute('data-label-mode') === 'log') {
        toolSettingsLabel.innerHTML = settingsLog.toFixed(0) + ' px';
    } else {
        toolSettingsLabel.innerHTML = settingsPercent.toFixed(2);
    }

    toolSettings.setAttribute('data-value-percent', (settingsPercent * 100).toFixed(2));
    toolSettings.setAttribute('data-value-log', settingsLog.toFixed(2));
}

function getLogValues(position, min, max) {
    let minP = 0;
    let maxP = 100;
    let minV = Math.log(min);
    let maxV = Math.log(max);
    let scale = (maxV - minV) / (maxP - minP);
    return Math.exp(minV + scale * (position * 100 - minP));
}