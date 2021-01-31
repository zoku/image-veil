
    // Variables
    // -- Image and canvas
    var canvasContainer = document.getElementById('canvasContainer');
    var canvas = document.getElementById('imageCanvas');
    var ctx = canvas.getContext('2d');
    var originalImg = new Image();
    var crystallizedImg = new Image();
    var originalImageDimensions = { width: 0, height: 0 };

    // Toolbox
    var tools = document.getElementById('tools');

    // Helpers
    var brushOutline_canvas = document.getElementById('brushOutline');
    var brushOutline_ctx = brushOutline_canvas.getContext('2d');
    var brushOutline_setSize = function (size) {
        var _size = size * zoomFactor;
        brushOutline_canvas.width = _size;
        brushOutline_canvas.height = _size;

        brushOutline_ctx.strokeStyle =  'rgb(0,0,0)';
        brushOutline_ctx.beginPath();
        brushOutline_ctx.arc(_size / 2, _size / 2, _size / 2, 0, Math.PI * 2, true);
        brushOutline_ctx.stroke();
    };

    // -- Tool helpers
    // -- -- Zooming
    var zoomFactor = 1;
    var mouseZoom = false;
    var wheelZoomDone = false;

    // -- -- Brush
    var isBrushing = false;
    var wasBrushing = false;
    var isErasing = false;
    var brushSize = 100;
    brushOutline_setSize(brushSize);

    // -- Tool Settings
    var toolSettings = document.getElementById('tool-settings');
    var toolSettingsRail = document.getElementById('tool-settings-rail');
    var toolSettingsKnob = document.getElementById('tool-settings-knob');
    var toolSettingsLabel = document.getElementById('tool-settings-label');
    var toolSettingsCallback = function (value) {};

    // -- Menus
    var menuIsOpen = false;

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
        tools.style.display = 'block';

        document.getElementById('menu--file--save').classList.remove('menus--items--item--submenu--item_disabled');
        closeAllMenus();
    }

    // Bind menus
    var menuItems = document.getElementsByClassName('menus--items--item');
    var submenus = document.getElementsByClassName('menus--items--item--submenu');
    function closeAllMenus() {
        for (var i=0; i < submenus.length; i++) {
            submenus[i].style.display = 'none';
        }
    }

    for (var i=0; i<menuItems.length; i++) {
        var menuItem = menuItems[i];

        menuItem.addEventListener('click', function(e) {
            e.stopPropagation();

            if (this.getElementsByClassName('menus--items--item--submenu')[0].style.display === 'block') {
                this.getElementsByClassName('menus--items--item--submenu')[0].style.display = 'none';
                menuIsOpen = false;
            } else {
                closeAllMenus();
                this.getElementsByClassName('menus--items--item--submenu')[0].style.display = 'block';
                menuIsOpen = true;
            }
        });
        menuItem.addEventListener('mouseenter', function() {
            if (!menuIsOpen) {
                return;
            }

            if (this.getElementsByClassName('menus--items--item--submenu')[0].style.display !== 'block') {
                closeAllMenus();
                this.getElementsByClassName('menus--items--item--submenu')[0].style.display = 'block';
            }
        });
    }
    document.getElementsByTagName('body')[0].addEventListener('click', function () {
        closeAllMenus();
        menuIsOpen = false;
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

        var $download = document.createElement('a');

        $download.setAttribute('href', canvas.toDataURL('image/jpeg', .8));
        $download.setAttribute('target', '_blank');
        $download.setAttribute('download', 'anonymous-image.jpg');

        $download.click();
    });

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
            if (canvasContainer.getAttribute('data-is-brushable') === 'true') {
                setBrushable(canvasContainer, false);
                wasBrushing = true;
            }

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

            if (wasBrushing) {
                wasBrushing = false;
                setBrushable(canvasContainer);
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
    // -- Tool settings
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();

        if (toolSettings.getAttribute('data-tool') === 'none') {
            return;
        }

        if (toolSettings.getAttribute('data-tool') === 'brush') { // Also eraser
            toolSettingsCallback = function() {
                setBrushSize(toolSettings.getAttribute('data-value-log'));
                brushOutline_canvas.style.left = e.offsetX - brushSize * zoomFactor / 2;
                brushOutline_canvas.style.top = e.offsetY - brushSize * zoomFactor / 2;
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
    toolSettingsKnob.addEventListener('mousedown', function () {
        document.addEventListener('mousemove', moveToolSettingsKnob);
        document.addEventListener('mouseup', unmoveToolSettingsKnob);
        toolSettingsLabel.style.display = 'block';
    });
    function unmoveToolSettingsKnob() {
        document.removeEventListener('mousemove', moveToolSettingsKnob);
        document.removeEventListener('mouseup', unmoveToolSettingsKnob);
        toolSettingsLabel.style.display = 'none';
        toolSettings.style.display = 'none';

        toolSettingsCallback();
    }
    function moveToolSettingsKnob(e) {
        var settingsOffset = offset(toolSettingsRail).left;
        var settingsMinPx = 0 - (toolSettingsKnob.clientWidth / 2);
        var settingsMaxPx = toolSettingsRail.clientWidth - (toolSettingsKnob.clientWidth / 2);
        var newSettingsPositionPx = e.clientX - settingsOffset - (toolSettingsKnob.clientWidth / 2);

        if (newSettingsPositionPx < settingsMinPx) { newSettingsPositionPx = settingsMinPx; }
        if (newSettingsPositionPx > settingsMaxPx) { newSettingsPositionPx = settingsMaxPx; }

        var settingsPercent = (newSettingsPositionPx + (toolSettingsKnob.clientWidth / 2)) / (settingsMaxPx + (toolSettingsKnob.clientWidth / 2));
        var settingsLog = getLogValues(settingsPercent, 1, 3000);

        toolSettingsKnob.style.left = newSettingsPositionPx;

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
        var minP = 0;
        var maxP = 100;
        var minV = Math.log(min);
        var maxV = Math.log(max);
        var scale = (maxV - minV) / (maxP - minP);
        return Math.exp(minV + scale * (position * 100 - minP));
    }

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

            toolSettings.setAttribute('data-tool', 'zoom');
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

        brushOutline_setSize(brushSize);
        brushOutline_canvas.style.left = mouseEvent.offsetX - brushSize * zoomFactor / 2;
        brushOutline_canvas.style.top = mouseEvent.offsetY - brushSize * zoomFactor / 2;

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

        toolSettings.setAttribute('data-tool', 'none');

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
        var x = e.offsetX;
        var y = e.offsetY;

        brushOutline_canvas.style.display = 'block';
        brushOutline_canvas.style.left = x - brushSize * zoomFactor / 2;
        brushOutline_canvas.style.top = y - brushSize * zoomFactor / 2;

        if (!isBrushing && e.type !== 'click') {
            return;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(x / zoomFactor, y / zoomFactor, brushSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

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

        ctx.restore();
    };

    var brushLeaves = function (e) {
        brushOutline_canvas.style.display = 'none';
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
            canvas.removeEventListener('click', doBrush);
            canvas.removeEventListener('mouseleave', brushLeaves);

            brushOutline_canvas.style.display = 'none';

            return element;
        }

        element.setAttribute('data-is-brushable', true);
        element.classList.add('is-brushable');

        canvas.addEventListener('mousedown', startBrush);
        canvas.addEventListener('mouseup', stopBrush);
        canvas.addEventListener('mousemove', doBrush);
        canvas.addEventListener('click', doBrush);
        canvas.addEventListener('mouseleave', brushLeaves);

        toolSettings.setAttribute('data-tool', 'brush');

        return element;
    }

    // -- Brush size
    function setBrushSize(size) {
        brushSize = size;
        brushOutline_setSize(size);
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