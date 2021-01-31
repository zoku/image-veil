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