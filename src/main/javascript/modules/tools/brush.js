onTouchDrag($canvasContainer, function (coordinates) {
    $ctx.save();
    $ctx.beginPath();
    $ctx.arc(coordinates.x / zoomFactor, coordinates.y / zoomFactor, brushSize / 2, 0, Math.PI * 2);
    $ctx.closePath();
    $ctx.clip();

    $ctx.drawImage(
        isErasing? $originalImg : $pixelatedImg,
        coordinates.x / zoomFactor - brushSize / 2,
        coordinates.y / zoomFactor - brushSize / 2,
        brushSize,
        brushSize,
        coordinates.x / zoomFactor - brushSize / 2,
        coordinates.y / zoomFactor - brushSize / 2,
        brushSize,
        brushSize
    );

    $ctx.restore();
});

let startBrush = function () {
    isBrushing = true;
};

let stopBrush = function () {
    isBrushing = false;
};

let doBrush = function (e) {
    if (documentTouched) return;

    let x = e.offsetX;
    let y = e.offsetY;

    brushOutline_canvas.style.display = 'block';
    brushOutline_canvas.style.left = (x - brushSize * zoomFactor / 2) + 'px';
    brushOutline_canvas.style.top = (y - brushSize * zoomFactor / 2) + 'px';

    if (!isBrushing && e.type !== 'click') {
        return;
    }

    $ctx.save();
    $ctx.beginPath();
    $ctx.arc(x / zoomFactor, y / zoomFactor, brushSize / 2, 0, Math.PI * 2);
    $ctx.closePath();
    $ctx.clip();

    $ctx.drawImage(
        e.shiftKey || isErasing? $originalImg : $pixelatedImg,
        x / zoomFactor - brushSize / 2,
        y / zoomFactor - brushSize / 2,
        brushSize,
        brushSize,
        x / zoomFactor - brushSize / 2,
        y / zoomFactor - brushSize / 2,
        brushSize,
        brushSize
    );

    $ctx.restore();
};

let brushLeaves = function (e) {
    brushOutline_canvas.style.display = 'none';
};

function setBrushable(element, activate) {
    let _activate = activate !== false;

    if (element.getAttribute('data-is-brushable') === 'true' && _activate) {
        return element;
    }

    if (!_activate) {
        element.setAttribute('data-is-brushable', false);
        element.classList.remove('is-brushable');

        $canvas.removeEventListener('mousedown', startBrush);
        $canvas.removeEventListener('mouseup', stopBrush);
        $canvas.removeEventListener('mousemove', doBrush);
        $canvas.removeEventListener('click', doBrush);
        $canvas.removeEventListener('mouseleave', brushLeaves);

        brushOutline_canvas.style.display = 'none';

        return element;
    }

    element.setAttribute('data-is-brushable', true);
    element.classList.add('is-brushable');

    $canvas.addEventListener('mousedown', startBrush);
    $canvas.addEventListener('mouseup', stopBrush);
    $canvas.addEventListener('mousemove', doBrush);
    $canvas.addEventListener('click', doBrush);
    $canvas.addEventListener('mouseleave', brushLeaves);

    toolSettings.setAttribute('data-tool', 'brush');

    return element;
}

// -- Brush size
function setBrushSize(size) {
    brushSize = size;
    brushOutline_setSize(size);
}