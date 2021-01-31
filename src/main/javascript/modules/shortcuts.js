// -- Shortcuts
document.addEventListener('keydown', function (e) {
    e.stopPropagation();
    if (e.code === 'Space') {
        if ($canvasContainer.getAttribute('data-is-brushable') === 'true') {
            setBrushable($canvasContainer, false);
            wasBrushing = true;
        }

        setDraggable($canvasContainer);
        $canvasContainer.classList.remove('zoom');
    }

    if (e.code === 'KeyY') {
        mouseZoom = true;
        $canvasContainer.classList.add('zoom');
    }
});

document.addEventListener('keyup', function (e) {
    if (e.code === 'Space') {
        setDraggable($canvasContainer, false);

        if (wasBrushing) {
            wasBrushing = false;
            setBrushable($canvasContainer);
        }
    }

    if (e.code === 'KeyY') {
        if (!wheelZoomDone) {
            document.getElementById('tools--tool--zoom').click();
        }
        wheelZoomDone = false;
        mouseZoom = false;
    }

    if (e.code === 'KeyM') {
        document.getElementById('tools--tool--move').click();
    }

    if (e.code === 'KeyB') {
        document.getElementById('tools--tool--brush').click();
    }

    if (e.code === 'KeyE') {
        document.getElementById('tools--tool--eraser').click();
    }
});

$canvasContainer.addEventListener('mousewheel', function (e) {
    if (mouseZoom) {
        wheelZoomDone = true;
        changeZoom($canvasContainer, e.deltaY > 0? '-' : '+', e.offsetX, e.offsetY);
    }
});

$canvasContainer.addEventListener('mousemove', function (e) {
    if(e.shiftKey && this.getAttribute('data-is-zoomable') === 'true') {
        this.classList.add('is-zoomable_out');
    } else {
        this.classList.remove('is-zoomable_out');
    }
});