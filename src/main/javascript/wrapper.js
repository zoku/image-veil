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

/***CONTENT***/