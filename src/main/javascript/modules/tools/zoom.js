const clickZoomChange = .1;

let zoomClickHelper = function (e) {
    if (this.getAttribute('data-is-draggable') === 'true') return;
    changeZoom(this, e.pageX, e.pageY, e.layerX, e.layerY, e.shiftKey? -clickZoomChange : clickZoomChange);
};

onPinch($canvasContainer, function (pinch) {
    let delta = 0;
    if (pinch.delta > 0) {
        delta = .02;
    }

    if (pinch.delta < 0) {
        delta = -.02;
    }

    changeZoom($canvasContainer, pinch.pageX, pinch.pageY, pinch.elementX, pinch.elementY, delta);
});

function setZoomable(element, activate) {
    let _activate = activate !== false;

    if (element.getAttribute('data-is-zoomable') === 'true' && _activate) {
        return element;
    }

    if (_activate) {
        element.addEventListener('click', zoomClickHelper);
        element.setAttribute('data-is-zoomable', true);
        element.classList.add('is-zoomable');

        toolSettings.setAttribute('data-tool', 'zoom');
    } else {
        element.removeEventListener('click', zoomClickHelper);
        element.setAttribute('data-is-zoomable', false);
        element.classList.remove('is-zoomable');
    }

    return element;
}

function changeZoom(element, cursorPageX, cursorPageY, cursorElementX, cursorElementY, factor, absolute) {
    if (absolute) {
        zoomFactor = factor;
    } else {
        zoomFactor = zoomFactor + factor;
    }

    if (zoomFactor < .1) zoomFactor = .1;
    if (zoomFactor > 40) zoomFactor = 40;

    let width = $originalImg.width;
    let newWidth = width * zoomFactor;


    let originalCursorX = cursorElementX / zoomFactor;
    let originalCursorY = cursorElementY / zoomFactor;

    $canvasContainer.style.left = (cursorPageX - cursorElementX - originalCursorX * factor) + 'px';
    $canvasContainer.style.top = (cursorPageY - cursorElementY - originalCursorY * factor) + 'px';


    element.style.width = newWidth + 'px';

    let height = $originalImg.height;
    let newHeight = height * zoomFactor;

    element.style.height = newHeight + 'px';

    brushOutline_setSize(brushSize);
    brushOutline_canvas.style.left = cursorPageX - brushSize * zoomFactor / 2 + 'px';
    brushOutline_canvas.style.top = cursorPageY - brushSize * zoomFactor / 2 + 'px';

    document.getElementById('status--zoom').innerHTML = (zoomFactor * 100).toFixed(0) + '%';
}

function changeZoom_old(element, inOut, x, y, reset, factor) {
    let zoomMagnitude = .1;
    let _factor = factor || null;
    let _x = x || document.width / 2;
    let _y = y || document.height / 2;

    if (reset === true) {
        zoomFactor = 1;
    } else {
        if (inOut === '-') {
            zoomFactor -= zoomMagnitude;
        } else {
            zoomFactor += zoomMagnitude;
        }
        if (zoomFactor < zoomMagnitude) zoomFactor = zoomMagnitude;
        if (zoomFactor > 40) zoomFactor = 40;
    }

    if (_factor != null) zoomFactor = _factor

    let scaledWidth = originalImageDimensions.width * zoomFactor;
    let scaledHeight = originalImageDimensions.height * zoomFactor;

    let deltaWidth = element.offsetWidth - scaledWidth;
    let deltaHeight = element.offsetHeight - scaledHeight;

    let deltaOffsetX = _x - _x * zoomMagnitude;
    let deltaOffsetY = _y - _y * zoomMagnitude;

    element.style.width = scaledWidth + 'px';
    element.style.height = scaledHeight + 'px';

    element.style.left = offset(element).left + deltaWidth * (deltaOffsetX / scaledWidth) + 'px';
    element.style.top = offset(element).top + deltaHeight * (deltaOffsetY / scaledHeight) + 'px';

    brushOutline_setSize(brushSize);
    brushOutline_canvas.style.left = _x - brushSize * zoomFactor / 2 + 'px';
    brushOutline_canvas.style.top = _y - brushSize * zoomFactor / 2 + 'px';

    document.getElementById('status--zoom').innerHTML = (zoomFactor * 100).toFixed(0) + '%';
}