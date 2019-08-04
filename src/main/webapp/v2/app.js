(function () {
    // Variables
    // -- Image and canvas
    var canvasContainer = document.getElementById('canvasContainer');
    var canvas = document.getElementById('imageCanvas');
    var ctx = canvas.getContext('2d');
    var originalImg = new Image();
    var crystallizedImg = new Image();
    var originalImageDimensions = { width: 0, height: 0 };

    // -- Tool helpers
    // -- -- Zooming
    var zoomFactor = 1;
    var mouseZoom = false;
    var wheelZoomDone = false;

    // -- -- Brush
    var isBrushing = false;
    var isErasing = false;
    var brushSize = 20;

    // Open a file on fileInput change
    function openFile(file) { // TODO: Make available through open dialog (trigger click on element)
        var input = file.target;
        var reader = new FileReader();
        reader.onload = function() {
            // noinspection JSValidateTypes (it IS compatible, stop bugging me!)
            originalImg.src = reader.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
    document.getElementById('canvas-file-input').addEventListener('change', openFile);

    // Image init
    originalImg.onload = function () {
        loadImage(this);
    };
    // originalImg.src = 'demo.png';

    function loadImage(_this) {
        canvasContainer.style.display = 'none';
        // TODO: Resize image before doing anything... Everything bigger than 2000x2000 px is bogus!

        // Reset status bar and set to new image's data
        zoomFactor = 1;
        document.getElementById('status--zoom').innerHTML = '100%';
        document.getElementById('status--size').innerHTML = _this.width + '&times;' + _this.height;

        // Set new image's data
        originalImageDimensions.width = _this.width;
        originalImageDimensions.height = _this.height;
        canvasContainer.width = _this.width;
        canvasContainer.height = _this.height;
        canvasContainer.style.left = document.body.clientWidth / 2 - _this.width / 2;
        canvasContainer.style.top = document.body.clientHeight / 2 - _this.height / 2;
        canvas.width = _this.width;
        canvas.height = _this.height;
        canvasContainer.style.width = _this.width;
        canvasContainer.style.height = _this.height;

        // Draw image to canvas and get canvas data for image
        ctx.drawImage(_this, 0, 0, _this.width, _this.height);
        imageData = ctx.getImageData(0, 0, _this.width, _this.height);

        // Prepare original image buffer
        var originalBuf = new ArrayBuffer(imageData.data.length);
        var originalImage = new Uint8ClampedArray(originalBuf);
        // var originalImage32 = new Uint32Array(originalBuf);

        for (var i=0; i < imageData.data.length; i++) {
            originalImage[i] = imageData.data[i];
        }

        // Prepare crystallized image buffer
        var crystalBuf = new ArrayBuffer(imageData.data.length);
        var crystalImage = new Uint8ClampedArray(crystalBuf);
        var crystalImage32 = new Uint32Array(crystalBuf);

        for (var j=0; j < imageData.data.length; j++) {
            crystalImage[j] = imageData.data[j];
        }

        crystallize(crystalImage32, _this.width, _this.height);

        // Prepare crystallized image
        drawBuffer(crystalImage);
        crystallizedImg.src = canvas.toDataURL();
        drawBuffer(originalImage);

        // This should be the default tool!
        setBrushable(canvasContainer);
        document.getElementById('tools--tool--brush').classList.add('is-active');

        canvasContainer.style.display = 'block';
    }

    // Bind toolbox
    // -- Move
    document.getElementById('tools--tool--move').addEventListener('click', function (e) {
        e.preventDefault();
        setZoomable(canvasContainer, false);
        document.getElementById('tools--tool--zoom').classList.remove('is-active');

        setBrushable(canvasContainer, false);
        document.getElementById('tools--tool--brush').classList.remove('is-active');

        isErasing = false;
        document.getElementById('tools--tool--eraser').classList.remove('is-active');

        setDraggable(canvasContainer);
        document.getElementById('tools--tool--move').classList.add('is-active');
    });

    // -- Zoom
    document.getElementById('tools--tool--zoom').addEventListener('click', function (e) {
        e.preventDefault();
        setDraggable(canvasContainer, false);
        document.getElementById('tools--tool--move').classList.remove('is-active');

        setBrushable(canvasContainer, false);
        document.getElementById('tools--tool--brush').classList.remove('is-active');

        isErasing = false;
        document.getElementById('tools--tool--eraser').classList.remove('is-active');

        setZoomable(canvasContainer);
        document.getElementById('tools--tool--zoom').classList.add('is-active');
    });

    // -- Brush
    document.getElementById('tools--tool--brush').addEventListener('click', function (e) {
        e.preventDefault();
        setDraggable(canvasContainer, false);
        document.getElementById('tools--tool--move').classList.remove('is-active');

        setZoomable(canvasContainer, false);
        document.getElementById('tools--tool--zoom').classList.remove('is-active');

        isErasing = false;
        document.getElementById('tools--tool--eraser').classList.remove('is-active');

        setBrushable(canvasContainer);
        document.getElementById('tools--tool--brush').classList.add('is-active');
    });

    // -- Eraser
    document.getElementById('tools--tool--eraser').addEventListener('click', function (e) {
        e.preventDefault();
        setDraggable(canvasContainer, false);
        document.getElementById('tools--tool--move').classList.remove('is-active');

        setZoomable(canvasContainer, false);
        document.getElementById('tools--tool--zoom').classList.remove('is-active');

        document.getElementById('tools--tool--brush').classList.remove('is-active');

        setBrushable(canvasContainer, true);
        isErasing = true;
        document.getElementById('tools--tool--eraser').classList.add('is-active');
    });

    // -- Shortcuts
    document.addEventListener('keydown', function (e) {
        e.stopPropagation();
        if (e.code === 'Space') {
            setDraggable(canvasContainer);
            canvasContainer.classList.remove('zoom');
        }

        if (e.code === 'KeyY') {
            mouseZoom = true;
            canvasContainer.classList.add('zoom');
        }
    });

    document.addEventListener('keyup', function (e) {
        if (e.code === 'Space') {
            setDraggable(canvasContainer, false);
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

    canvasContainer.addEventListener('mousewheel', function (e) {
        if (mouseZoom) {
            wheelZoomDone = true;
            changeZoom(canvasContainer, e.deltaY > 0? '-' : '+', e);
        }
    });

    canvasContainer.addEventListener('mousemove', function (e) {
        if(e.shiftKey && this.getAttribute('data-is-zoomable') === 'true') {
            this.classList.add('is-zoomable_out');
        } else {
            this.classList.remove('is-zoomable_out');
        }
    });

    // Tool functions
    // -- Zooming
    var zoomClickHelper = function (e) {
        if (this.getAttribute('data-is-draggable') === 'true') return;
        changeZoom(this, e.shiftKey? '-' : '+', e)
    };

    function setZoomable(element, activate) {
        var _activate = activate !== false;

        if (element.getAttribute('data-is-zoomable') === 'true' && _activate) {
            return element;
        }

        if (_activate) {
            element.addEventListener('click', zoomClickHelper);
            element.setAttribute('data-is-zoomable', true);
            element.classList.add('is-zoomable');
        } else {
            element.removeEventListener('click', zoomClickHelper);
            element.setAttribute('data-is-zoomable', false);
            element.classList.remove('is-zoomable');
        }

        return element;
    }

    function changeZoom(element, inOut, mouseEvent, reset) {
        var zoomMagnitude = .1;
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

        var deltaWidth = element.offsetWidth - originalImageDimensions.width * zoomFactor;
        var deltaHeight = element.offsetHeight - originalImageDimensions.height * zoomFactor;

        var deltaOffsetX = mouseEvent.offsetX - mouseEvent.offsetX * zoomMagnitude;
        var deltaOffsetY = mouseEvent.offsetY - mouseEvent.offsetY * zoomMagnitude;

        element.style.width = originalImageDimensions.width * zoomFactor;
        element.style.height = originalImageDimensions.height * zoomFactor;

        element.style.left = offset(element).left + deltaWidth * (deltaOffsetX / (originalImageDimensions.width * zoomFactor));
        element.style.top = offset(element).top + deltaHeight * (deltaOffsetY / (originalImageDimensions.height * zoomFactor));

        document.getElementById('status--zoom').innerHTML = (zoomFactor * 100).toFixed(0) + '%';
    }

    // -- Dragging
    var activateDrag = function (e) {
        this.setAttribute('data-is-dragged', true);
        this.setAttribute('data-drag-offset-x', e.offsetX);
        this.setAttribute('data-drag-offset-y', e.offsetY);
    };

    var deactivateDrag = function () {
        this.setAttribute('data-is-dragged', false);
    };

    var doDrag = function (e) {
        if (this.getAttribute('data-is-dragged') === 'true') {
            this.style.left = (e.clientX - this.getAttribute('data-drag-offset-x')) + 'px';
            this.style.top = (e.clientY - this.getAttribute('data-drag-offset-y')) + 'px';
        }
    };

    function setDraggable(element, activate) {
        var _activate = activate !== false;

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

        return element;
    }

    // -- Brush
    var startBrush = function () {
        isBrushing = true;
    };

    var stopBrush = function () {
        isBrushing = false;
    };

    var doBrush = function (e) {
        if (!isBrushing) {
            return;
        }

        var x = e.offsetX;
        var y = e.offsetY;

        ctx.drawImage(
            e.shiftKey || isErasing? originalImg : crystallizedImg,
            x / zoomFactor - brushSize / 2,
            y / zoomFactor - brushSize / 2,
            brushSize,
            brushSize,
            x / zoomFactor - brushSize / 2,
            y / zoomFactor - brushSize / 2,
            brushSize,
            brushSize
        );
    };

    function setBrushable(element, activate) {
        var _activate = activate !== false;

        if (element.getAttribute('data-is-brushable') === 'true' && _activate) {
            return element;
        }

        if (!_activate) {
            element.setAttribute('data-is-brushable', false);
            element.classList.remove('is-brushable');

            canvas.removeEventListener('mousedown', startBrush);
            canvas.removeEventListener('mouseup', stopBrush);
            canvas.removeEventListener('mousemove', doBrush);

            return element;
        }

        element.setAttribute('data-is-brushable', true);
        element.classList.add('is-brushable');

        canvas.addEventListener('mousedown', startBrush);
        canvas.addEventListener('mouseup', stopBrush);
        canvas.addEventListener('mousemove', doBrush);

        return element;
    }

    // Helper functions
    // -- Element offset
    function offset(el) {
        var rect = el.getBoundingClientRect(),
            scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
    }

    // -- Distance between two points
    function distSq(x1, x2, y1, y2) {
        return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
    }

    // -- Crystallize an image (Int32Array, Int, Int)
    function crystallize(imageData, width, height) {
        // Prepare crystallize
        var cells = 60;
        var cellWidth = width / cells;
        var cellHeight = height / cells;

        var xs = [];
        var ys = [];

        // Generate cells
        for (var y=0; y < cells; y++) {
            for (var x=0; x < cells; x++) {
                xs[y * cells + x] = Math.round(x * cellWidth + (Math.random() * cellWidth));
                ys[y * cells + x] = Math.round(y * cellHeight + (Math.random() * cellHeight));
            }
        }

        // Draw
        for (var a=0; a < height; a++) {
            for (var b=0; b < width; b++) {
                var currentCellX = Math.round(Math.min(Math.floor(b / cellWidth), cells - 1));
                var currentCellY = Math.round(Math.min(Math.floor(a / cellHeight), cells - 1));

                var nearestPoint = currentCellY * cells + currentCellX;

                var displacements = [
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

                var adjacentPoints = [];
                for (var i=0; i < displacements.length; i++) {
                    var it = displacements[i];
                    if (it >= 0 && it <= xs.length - 1) {
                        adjacentPoints.push(it);
                    }
                }

                var n = 0;
                for (var j=0; j < adjacentPoints.length; j++) {
                    var jt = adjacentPoints[j];
                    if (distSq(xs[jt], b, ys[jt], a) < distSq(xs[n], b, ys[n], a)) n = jt
                }

                imageData[a * width + b] = imageData[ys[n] * width + xs[n]];
            }
        }
    }

    function drawBuffer(buffer) {
        imageData.data.set(buffer);
        ctx.putImageData(imageData, 0, 0);
    }
})();