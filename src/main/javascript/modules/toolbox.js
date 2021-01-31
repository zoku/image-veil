// -- Move
document.getElementById('tools--tool--move').addEventListener('click', function (e) {
    e.preventDefault();
    setZoomable($canvasContainer, false);
    document.getElementById('tools--tool--zoom').classList.remove('is-active');

    setBrushable($canvasContainer, false);
    document.getElementById('tools--tool--brush').classList.remove('is-active');

    isErasing = false;
    document.getElementById('tools--tool--eraser').classList.remove('is-active');

    setDraggable($canvasContainer);
    document.getElementById('tools--tool--move').classList.add('is-active');

    document.getElementById('tools--tool--brush-size').classList.remove('is-active');
});

// -- Zoom
document.getElementById('tools--tool--zoom').addEventListener('click', function (e) {
    e.preventDefault();
    setDraggable($canvasContainer, false);
    document.getElementById('tools--tool--move').classList.remove('is-active');

    setBrushable($canvasContainer, false);
    document.getElementById('tools--tool--brush').classList.remove('is-active');

    isErasing = false;
    document.getElementById('tools--tool--eraser').classList.remove('is-active');

    setZoomable($canvasContainer);
    document.getElementById('tools--tool--zoom').classList.add('is-active');

    document.getElementById('tools--tool--brush-size').classList.remove('is-active');
});

// -- Brush
document.getElementById('tools--tool--brush').addEventListener('click', function (e) {
    e.preventDefault();
    setDraggable($canvasContainer, false);
    document.getElementById('tools--tool--move').classList.remove('is-active');

    setZoomable($canvasContainer, false);
    document.getElementById('tools--tool--zoom').classList.remove('is-active');

    isErasing = false;
    document.getElementById('tools--tool--eraser').classList.remove('is-active');

    setBrushable($canvasContainer);
    document.getElementById('tools--tool--brush').classList.add('is-active');

    document.getElementById('tools--tool--brush-size').classList.remove('is-active');
});

// -- Eraser
document.getElementById('tools--tool--eraser').addEventListener('click', function (e) {
    e.preventDefault();
    setDraggable($canvasContainer, false);
    document.getElementById('tools--tool--move').classList.remove('is-active');

    setZoomable($canvasContainer, false);
    document.getElementById('tools--tool--zoom').classList.remove('is-active');

    document.getElementById('tools--tool--brush').classList.remove('is-active');

    setBrushable($canvasContainer, true);
    isErasing = true;
    document.getElementById('tools--tool--eraser').classList.add('is-active');

    document.getElementById('tools--tool--brush-size').classList.remove('is-active');
});

// -- Brush Size
document.getElementById('tools--tool--brush-size').addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    toolSettings.style.top = 'unset';
    toolSettings.style.left = '50%';
    toolSettings.style.bottom = '40px';
    toolSettings.style.display = 'block';

    document.getElementById('tools--tool--brush-size').classList.add('is-active');
    toolSettings.setAttribute('data-tool', 'brush');

    setDraggable($canvasContainer, false);
    document.getElementById('tools--tool--move').classList.remove('is-active');

    setZoomable($canvasContainer, false);
    document.getElementById('tools--tool--zoom').classList.remove('is-active');

    document.getElementById('tools--tool--brush').classList.remove('is-active');
    setBrushable($canvasContainer, false);
    isErasing = false;

    document.getElementById('tools--tool--eraser').classList.remove('is-active');
});