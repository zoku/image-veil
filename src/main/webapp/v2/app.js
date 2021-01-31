// ImageVail v1.0.0-SNAPSHOT

// Variables
// -- Image and canvas
let $canvasContainer = document.getElementById('canvasContainer');
let $canvas = document.getElementById('imageCanvas');
let $ctx = $canvas.getContext('2d');
let $originalImg = new Image();
let $pixelatedImg = new Image();
let originalImageDimensions = { width: 0, height: 0 };

// Toolbox
let tools = document.getElementById('tools');

// Helpers
let brushOutline_canvas = document.getElementById('brushOutline');
let brushOutline_ctx = brushOutline_canvas.getContext('2d');
let brushOutline_setSize = function (size) {
    let _size = size * zoomFactor;
    brushOutline_canvas.width = _size;
    brushOutline_canvas.height = _size;

    brushOutline_ctx.strokeStyle =  'rgb(0,0,0)';
    brushOutline_ctx.beginPath();
    brushOutline_ctx.arc(_size / 2, _size / 2, _size / 2, 0, Math.PI * 2, true);
    brushOutline_ctx.stroke();
};

// -- Tool helpers
// -- -- Zooming
let zoomFactor = 1;
let mouseZoom = false;
let wheelZoomDone = false;

// -- -- Brush
let isBrushing = false;
let wasBrushing = false;
let isErasing = false;
let brushSize = 100;
brushOutline_setSize(brushSize);

// -- Tool Settings
let toolSettings = document.getElementById('tool-settings');
let toolSettingsRail = document.getElementById('tool-settings-rail');
let toolSettingsKnob = document.getElementById('tool-settings-knob');
let toolSettingsLabel = document.getElementById('tool-settings-label');
let toolSettingsCallback = function (value) {};

// -- Document has been touched?
let documentTouched = false;

document.addEventListener('touchstart', function () {
    documentTouched = true;
});

document.addEventListener('touchend', function () {
    documentTouched = false;
});

function onTouchDrag(element, onDragCallback) {
    const eventCountToActivation = 5;
    let eventCount = 0;

    element.addEventListener('touchstart', function (e) {
        eventCount = 0;
    });

    element.addEventListener('touchmove', function (e) {
        eventCount++;

        if (e.touches.length !== 1) eventCount = 0;
        if (eventCount < eventCountToActivation) return;

        if (e.touches.length === 1) {
            let relativeX = e.touches[0].pageX - offset(element).left;
            let relativeY = e.touches[0].pageY - offset(element).top;

            onDragCallback({ x: relativeX, y: relativeY });
        }
    });
}

function onTwoFingerDrag(element, onDragCallback) {
    let previousCoordinates = null;

    element.addEventListener('touchmove', function (e) {
        if (e.touches.length === 2) {
            let absoluteX = (Math.max(e.touches[0].pageX, e.touches[1].pageX) - Math.min(e.touches[0].pageX, e.touches[1].pageX)) / 2 + Math.min(e.touches[0].pageX, e.touches[1].pageX);
            let absoluteY = (Math.max(e.touches[0].pageY, e.touches[1].pageY) - Math.min(e.touches[0].pageY, e.touches[1].pageY)) / 2 + Math.min(e.touches[0].pageY, e.touches[1].pageY);

            let deltaX = previousCoordinates.x - absoluteX;
            let deltaY = previousCoordinates.y - absoluteY;

            previousCoordinates = {
                x: absoluteX,
                y: absoluteY
            };

            onDragCallback({ dx: deltaX, dy: deltaY });
        }
    });

    element.addEventListener('touchstart', function (e) {
        if (e.touches.length === 2) {
            previousCoordinates = {
                x: (Math.max(e.touches[0].pageX, e.touches[1].pageX) - Math.min(e.touches[0].pageX, e.touches[1].pageX)) / 2 + Math.min(e.touches[0].pageX, e.touches[1].pageX),
                y: (Math.max(e.touches[0].pageY, e.touches[1].pageY) - Math.min(e.touches[0].pageY, e.touches[1].pageY)) / 2 + Math.min(e.touches[0].pageY, e.touches[1].pageY)
            };
        }
    });

    element.addEventListener('touchend', function (e) {
        if (e.touches.length === 2) {
            previousCoordinates = null;
        }
    });
}

function onPinch(element, onPinchCallback) {
    let initialPinchDistance = null;
    element.addEventListener('touchstart', function (e) {
        if (e.touches.length === 2) {
            // e.stopPropagation();
            let deltas = getDeltas(e);

            initialPinchDistance = { dx: deltas.dx, dy: deltas.dy };
        }
    });

    element.addEventListener('touchend', function (e) {
        initialPinchDistance = null;
    });

    element.addEventListener('touchmove', function (e) {
        let pinchThreshold = 4.5;
        if (e.touches.length === 2 && initialPinchDistance !== null) {
            let deltas = getDeltas(e);

            let deltaDx = initialPinchDistance.dx > deltas.dx? initialPinchDistance.dx - deltas.dx : deltas.dx - initialPinchDistance.dx;
            let deltaDy = initialPinchDistance.dy > deltas.dy? initialPinchDistance.dy - deltas.dy : deltas.dy - initialPinchDistance.dy;

            let delta = Math.sqrt(deltaDx + deltaDy);

            if (deltas.dx < initialPinchDistance.dx) {
                delta = -delta;
            }

            if (delta < pinchThreshold && delta > -pinchThreshold) return;

            initialPinchDistance = getDeltas(e);

            let absoluteX = (e.touches[0].pageX > e.touches[1].pageX? e.touches[0].pageX - e.touches[1].pageX : e.touches[1].pageX - e.touches[0].pageX) / 2;
            let absoluteY = (e.touches[0].pageY > e.touches[1].pageY? e.touches[0].pageY - e.touches[1].pageY : e.touches[1].pageY - e.touches[0].pageY) / 2;

            let relativeX = absoluteX - offset(this).left;
            let relativeY = absoluteY - offset(this).top;

            onPinchCallback({delta: delta, pageX: absoluteX, pageY: absoluteY, elementX: relativeX, elementY: relativeY});
        }
    });
}

function getDeltas(event) {
    let x1 = event.touches[0].pageX;
    let y1 = event.touches[0].pageY;
    let x2 = event.touches[1].pageX;
    let y2 = event.touches[1].pageY;

    let dx = (x1 > x2)? x1 - x2 : x2 - x1;
    let dy = (y1 > y2)? y1 - y2 : y2 - y1;

    return { dx: dx, dy: dy };
}
// -- Element offset
function offset(el) {
    let rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

// -- Distance between two points
function distSq(x1, x2, y1, y2) {
    return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
}
// Open image file
document.getElementById('canvas-file-input').addEventListener('change', function (e) {
    closeAllMenus();
    loadImage();
});

function loadImage() {
    let maxSizeWidth = 1920;
    let maxSizeHeight = 1920;

    $canvasContainer.style.display = 'none';
    showProgress('Opening image...', 0);

    let imageData = null;
    let crystalImageData = null;

    showProgress('Loading file...', .2);
    let file = URL.createObjectURL(document.getElementById('canvas-file-input').files[0]);

    let image = new Image();

    image.onload = function () {
        URL.revokeObjectURL(file);
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');

        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0, image.width, image.height);

        imageData = ctx.getImageData(0, 0, image.width, image.height);
    }

    image.onerror = function (e) {
        console.log(e);
    }

    showProgress('Loading image...', .4)
    image.src = file;

    // Resize Image
    let awaitImageResize = setInterval(function () {
        if (imageData !== null) {
            clearInterval(awaitImageResize);
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            let blobURL = null;

            let w = imageData.width;
            let h = imageData.height;

            canvas.width = w;
            canvas.height = h;
            ctx.putImageData(imageData, 0, 0);

            let image = new Image();
            image.onload = function () {
                URL.revokeObjectURL(blobURL);

                if (w > maxSizeWidth || h > maxSizeHeight) {
                    let percent;
                    if (w > h) {
                        percent = maxSizeWidth / w;
                    } else {
                        percent = maxSizeHeight / h;
                    }

                    w = w * percent;
                    h = h * percent;
                }

                canvas.width = w;
                canvas.height = h;
                ctx.drawImage(image, 0, 0, imageData.width, imageData.height, 0, 0, w, h);

                imageData = ctx.getImageData(0, 0, w, h);

                // Reset status bar and set to new image's data
                zoomFactor = 1;
                document.getElementById('status--zoom').innerHTML = '100%';
                document.getElementById('status--size').innerHTML = imageData.width + '&times;' + imageData.height;

                // Reset canvas settings
                originalImageDimensions.width = imageData.width;
                originalImageDimensions.height = imageData.height;
                $canvasContainer.width = imageData.width;
                $canvasContainer.height = imageData.height;
                $canvasContainer.style.left = document.body.clientWidth / 2 - imageData.width / 2 + 'px';
                $canvasContainer.style.top = document.body.clientHeight / 2 - imageData.height / 2 + 'px';
                $canvasContainer.style.width = imageData.width + 'px';
                $canvasContainer.style.height = imageData.height + 'px';

                showProgress('Crystallizing image...', .7);
            };

            canvas.toBlob(function (blob) {
                showProgress('Resizing image...', .5);
                blobURL = URL.createObjectURL(blob);
                image.src = blobURL;
            });
        }
    }, 100);

    // Load Image
    let awaitImageDraw1 = setInterval(function () {
        if (imageData !== null && imageData.width <= maxSizeWidth && imageData.height <= maxSizeHeight) {
            clearInterval(awaitImageDraw1);
            drawImage($originalImg, imageData, function () {
                // Draw original image to canvas
                $canvas.width = imageData.width;
                $canvas.height = imageData.height;
                $ctx.drawImage($originalImg, 0, 0);
            });
        }
    }, 100);

    let awaitImageDraw2 = setInterval(function () {
        if (imageData !== null && imageData.width <= maxSizeWidth && imageData.height <= maxSizeHeight) {
            clearInterval(awaitImageDraw2);
            crystalImageData = crystallize(imageData);

            showProgress('Image crystallized...', .8)
        }
    }, 100);

    // Last Step
    let awaitCrystallization = setInterval(function () {
        if (crystalImageData !== null) {
            clearInterval(awaitCrystallization);
            drawImage($pixelatedImg, crystalImageData);
            showProgress('Done...', 1);

            // Show image canvas and tools
            // -- Center image
            $canvasContainer.style.left = ((document.width / 2) - ($canvasContainer.width / 2)) + 'px';
            $canvasContainer.style.top = ((document.height / 2) - ($canvasContainer.height / 2)) + 'px';

            // -- Zoom image
            // TODO changeZoom($canvasContainer, 0, 0, .5, true);
            $canvasContainer.style.display = 'block';
            tools.style.display = 'block';

            // Set default tool as selected
            setBrushable($canvasContainer);
            document.getElementById('tools--tool--brush').classList.add('is-active');

            // Prepare menu for further actions
            document.getElementById('menu--file--save').classList.remove('menus--items--item--submenu--item_disabled');
        }
    }, 100);
}

function drawImage(element, image, callback) { // : Unit
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;
    context.putImageData(image, 0, 0);

    canvas.toBlob(function (blob) {
        let blobURL = URL.createObjectURL(blob);
        element.onload = function () {
            URL.revokeObjectURL(blobURL);
            if (typeof callback === 'function') callback();
        }
        element.src = blobURL;
    });
}
let menuIsOpen = false;

// Bind menus
let menuItems = document.querySelectorAll('.menus--items--item');
let submenus = document.querySelectorAll('.menus--items--item--submenu');

function closeAllMenus() {
    for (let i=0; i < submenus.length; i++) {
        submenus[i].style.display = 'none';
    }
}

for (let i=0; i < menuItems.length; i++) {
    let menuItem = menuItems[i];

    menuItem.addEventListener('click', function(e) {
        e.stopPropagation();

        if (this.querySelector('.menus--items--item--submenu').style.display === 'block') {
            this.querySelector('.menus--items--item--submenu').style.display = 'none';
            menuIsOpen = false;
        } else {
            closeAllMenus();
            this.querySelector('.menus--items--item--submenu').style.display = 'block';
            menuIsOpen = true;
        }
    });
    menuItem.addEventListener('mouseenter', function() {
        if (!menuIsOpen) return;

        if (this.querySelector('.menus--items--item--submenu').style.display !== 'block') {
            closeAllMenus();
            this.querySelector('.menus--items--item--submenu').style.display = 'block';
        }
    });
}

document.addEventListener('click', function () {
    closeAllMenus();
    menuIsOpen = false;
});

// Open
document.getElementById('menu-open').addEventListener('touchend', function () {
    document.querySelector('.menus').classList.add('menus_is-active');
});

// Close
document.getElementById('menu-close').addEventListener('touchend', function (e) {
    e.preventDefault();
    document.querySelector('.menus').classList.remove('menus_is-active');
});

// -- File
// -- -- Open
document.getElementById('menu--file--open').addEventListener('click', function () {
    closeAllMenus();
    document.getElementById('canvas-file-input').click();
});

// -- -- Save as
document.getElementById('menu--file--save').addEventListener('click', function () {
    if (this.classList.contains('menus--items--item--submenu--item_disabled')) {
        return;
    }

    closeAllMenus();

    let $download = document.createElement('a');

    $download.setAttribute('href', $canvas.toDataURL('image/jpeg', .8));
    $download.setAttribute('target', '_blank');
    $download.setAttribute('download', 'anonymous-image.jpg');

    $download.click();
});
let progress = document.querySelector('.progress');

function showProgress(message, percent) {
    console.log(message + ' (' + (percent * 100).toFixed(0) + '%)');

    if (percent === 0) {
        progress.style.display = 'block';
        progress.classList.remove('progress_hidden');
    }

    progress.querySelector('.progress--message').innerHTML = message;
    progress.querySelector('.progress--bar-container--bar').style.width = (percent * 100).toFixed(0) + '%';

    if (percent === 1) {
        progress.classList.add('progress_hidden');
        setTimeout(function () {
            progress.style.display = 'none';
        }, 600);
    }
}
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
function crystallize(imageData) { // : ImageData
    return filter(imageData, function (buffer, width, height) {
        // Prepare crystallize
        let cells = 60;
        let cellWidth = width / cells;
        let cellHeight = height / cells;

        let xs = [];
        let ys = [];

        // Generate cells
        for (let y = 0; y < cells; y++) {
            for (let x=0; x < cells; x++) {
                xs[y * cells + x] = Math.round(x * cellWidth + (Math.random() * cellWidth));
                ys[y * cells + x] = Math.round(y * cellHeight + (Math.random() * cellHeight));
            }
        }

        // Draw
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let currentCellX = Math.round(Math.min(Math.floor(x / cellWidth), cells - 1));
                let currentCellY = Math.round(Math.min(Math.floor(y / cellHeight), cells - 1));

                let nearestPoint = currentCellY * cells + currentCellX;

                let displacements = [
                    nearestPoint - cells - 1,
                    nearestPoint - cells,
                    nearestPoint - cells + 1,
                    nearestPoint - 1,
                    nearestPoint,
                    nearestPoint + 1,
                    nearestPoint + cells - 1,
                    nearestPoint + cells,
                    nearestPoint + cells + 1
                ];

                let adjacentPoints = [];
                for (let i=0; i < displacements.length; i++) {
                    let it = displacements[i];
                    if (it >= 0 && it <= xs.length - 1) {
                        adjacentPoints.push(it);
                    }
                }

                let n = 0;
                for (let j=0; j < adjacentPoints.length; j++) {
                    let jt = adjacentPoints[j];
                    if (distSq(xs[jt], x, ys[jt], y) < distSq(xs[n], x, ys[n], y)) n = jt
                }

                buffer[y * width + x] = buffer[ys[n] * width + xs[n]];
            }
        }
    });
}
function filter(imageData, callback) { // : ImageData
    let _imageData = new ImageData(
        new Uint8ClampedArray(imageData.data),
        imageData.width,
        imageData.height
    );

    let buf = _imageData.data.buffer;
    let buf32 = new Uint32Array(buf);

    callback(buf32, _imageData.width, _imageData.height);

    return _imageData;
}
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
onTwoFingerDrag($canvasContainer, function (coordinates) {
    $canvasContainer.style.left = offset($canvasContainer).left - coordinates.dx + 'px';
    $canvasContainer.style.top = offset($canvasContainer).top - coordinates.dy + 'px';
});

let activateDrag = function (e) {
    this.setAttribute('data-is-dragged', true);
    this.setAttribute('data-drag-offset-x', e.offsetX);
    this.setAttribute('data-drag-offset-y', e.offsetY);
};

let deactivateDrag = function () {
    this.setAttribute('data-is-dragged', false);
};

let doDrag = function (e) {
    if (this.getAttribute('data-is-dragged') === 'true') {
        this.style.left = (e.clientX - this.getAttribute('data-drag-offset-x')) + 'px';
        this.style.top = (e.clientY - this.getAttribute('data-drag-offset-y')) + 'px';
    }
};

function setDraggable(element, activate) {
    let _activate = activate !== false;

    if (element.getAttribute('data-is-draggable') === 'true' && _activate) {
        return element;
    }

    if (!_activate) {
        element.setAttribute('data-is-draggable', false);
        element.setAttribute('data-is-dragged', false);
        element.classList.remove('is-draggable');

        element.removeEventListener('mousedown', activateDrag);
        element.removeEventListener('mouseup', deactivateDrag);
        element.removeEventListener('mouseout', deactivateDrag);
        element.removeEventListener('mousemove', doDrag);

        return element;
    }

    element.setAttribute('data-is-draggable', true);
    element.setAttribute('data-is-dragged', false);
    element.classList.add('is-draggable');

    element.addEventListener('mousedown', activateDrag);
    element.addEventListener('mouseup', deactivateDrag);
    element.addEventListener('mouseout', deactivateDrag);
    element.addEventListener('mousemove', doDrag);

    toolSettings.setAttribute('data-tool', 'none');

    return element;
}
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
