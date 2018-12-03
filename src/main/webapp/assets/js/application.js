$(document).ready(function () {
    var $progressBar = $('#progress');
    var $fileInput = $('#imageFile');
    var $previewImage = $('.m-preview--image');
    var $previewShadow = $('.m-preview--shadow');
    var $startButton = $('#startButton');
    var $uploadText = $('.m-upload--text');
    var $areas = $('.m-preview--areas');
    var $areasInput = $('#areasInput');
    var $imageDataInput = $('#imageDataInput');


    var maxAllowedFileSizeMB = 5;

    $fileInput.on('change', function() {
        var file = this.files[0];

        if (file.size > maxAllowedFileSizeMB * 1024 * 1024) {
            $uploadText.text('Filesize is ' + (file.size / 1024 / 1024).toFixed(2) + 'MB (maximum allowed: ' + maxAllowedFileSizeMB + 'MB)');
            return;
        }

        $uploadText.text(file.name + ' (Click or drop another file here to change)');

        previewImage(this);
    });

    function previewImage(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $previewImage.attr('src', e.target.result);
            };
            reader.readAsDataURL(input.files[0]);
            $('.m-preview').show();
        }
    }

    $startButton.on('click', function (e) {
        e.preventDefault();

        $progressBar.find('.m-progress--bar').css({ width: 0 });
        $progressBar.show();

        var areas = [];
        $areas.find('.m-preview--areas--area').each(function (i, elem) {
            areas.push($(elem).data('area'));
        });
        $areasInput.val(JSON.stringify(areas));

        var imageData = {
            width: $previewImage.outerWidth(),
            height: $previewImage.outerHeight()
        };
        $imageDataInput.val(JSON.stringify(imageData));

        $.ajax({
            url: '/imagereceiver',
            type: 'POST',
            data: new FormData($('#uploadform')[0]),
            cache: false,
            contentType: false,
            processData: false,
            xhr: function() {
                var myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) {
                    myXhr.upload.addEventListener('progress', function(e) {
                        if (e.lengthComputable) {
                            $('#progress').find('.m-progress--bar').css({
                                width: (e.loaded / e.total * 100) + '%'
                            });
                        }
                    } , false);
                }
                return myXhr;
            }
        })
            .done(function (response) {
                $('#downloadLink').attr('href', response);
                $('#downloadLink').download = 'testimageanonymous.jpg';

                $('#downloadLink').find('img').attr('src', response);
            })
            .always(function () {
            $progressBar.hide();
        });
    });

    var startX = null;
    var startY = null;
    var endX = null;
    var endY = null;
    var x = null;
    var y = null;
    var width = null;
    var height = null;

    $areas.on('mousedown', function (e) {
        e.preventDefault();

        startX = e.offsetX;
        startY = e.offsetY;
        $previewShadow.show();
    });

    $areas.on('mousemove', function (e) {
        e.preventDefault();

        if (startX === null || startY === null || !$previewShadow.is(':visible')) {
            return;
        }

        var shadowWidth = 0;
        var shadowHeight = 0;
        var mouseX = e.offsetX;
        var mouseY = e.offsetY;
        var shadowX = 0;
        var shadowY = 0;


        if (startX < mouseX) {
            shadowX = startX;
            shadowWidth = mouseX - startX;
        } else {
            shadowX = mouseX;
            shadowWidth = startX - mouseX;
        }

        if (startY < mouseY) {
            shadowY = startY;
            shadowHeight = mouseY - startY;
        } else {
            shadowY = mouseY;
            shadowHeight = startY - mouseY;
        }

        window.requestAnimationFrame(function () {
            $previewShadow.css({
                'transform': 'translateX(' + shadowX + 'px) translateY(' + shadowY + 'px)',
                width: shadowWidth,
                height: shadowHeight
            });
        });
    });

    $areas.on('mouseup', function (e) {
        e.preventDefault();

        endX = e.offsetX;
        endY = e.offsetY;

        if (startX < endX) {
            x = startX;
            width = endX - startX;
        } else {
            x = endX;
            width = startX - endX;
        }

        if (startY < endY) {
            y = startY;
            height = endY - startY;
        } else {
            y = endY;
            height = startY - endY;
        }

        makeArea(x, y, width, height);

        startX = null;
        startY = null;
        endX = null;
        endY = null;
        x = null;
        y = null;
        width = null;
        height = null;
        $previewShadow.hide();
    });

    $(window, document).on('resize', function (e) {
        $areas.empty();
    });

    function makeArea(x, y, w, h) {
        var $area = $('<div/>')
            .addClass('m-preview--areas--area')
            .css({
                width: w,
                height: h,
                top: y,
                left: x
            })
            .append($('<div/>').addClass('m-preview--areas--area--image').css({
                backgroundImage: 'url(' + $previewImage.attr('src') + ')',
                backgroundPositionX: 0 - x + 15,
                backgroundPositionY: 0 - y + 15,
                'background-size': $previewImage.outerWidth() + 'px ' + $previewImage.outerHeight() + 'px'
            })).on('click', function (e) {
                e.preventDefault();
                $(this).remove();
            }).data('area', {
                width: w,
                height: h,
                y: y,
                x: x
            });

        $areas.append($area);
    }
});