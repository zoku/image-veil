$(document).ready(function () {
    let maxAllowedFileSizeMB = 5;

    let $fileInput = $('#imageFile');
    let $uploadText = $('.m-upload--text');

    let $previewImage = $('.m-preview--image');
    let $previewShadow = $('.m-preview--shadow');
    let $areas = $('.m-preview--areas');
    let $areasInput = $('#areasInput');

    let $modeContainer = $('.m-mode');

    let $startButton = $('#startButton');
    let $progressBar = $('#progress');

    let $imageDataInput = $('#imageDataInput');
    let $modeInput = $('#modeInput');

    $fileInput.on('change', function() {
        let file = this.files[0];

        $modeContainer.hide();
        $startButton.hide();
        $uploadText.removeClass('m-upload--text_small');

        $areas.empty();

        if (file.size > maxAllowedFileSizeMB * 1024 * 1024) {
            $uploadText.text(i18n.js.fileSizeHint.replace('[size1]', (file.size / 1024 / 1024).toFixed(2)).replace('[size2]', maxAllowedFileSizeMB));
            return;
        }

        $uploadText.addClass('m-upload--text_small').html(file.name + '<br>' + i18n.js.newFileHint);

        previewImage(this);
        $modeContainer.show();
        $startButton.show();
    });

    function previewImage(input) {
        if (input.files && input.files[0]) {
            let reader = new FileReader();
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

        let areas = [];
        $areas.find('.m-preview--areas--area').each(function (i, elem) {
            console.log($(elem).position());
            areas.push({
                x: $(elem).position().left.toFixed(0),
                y: $(elem).position().top.toFixed(0),
                width: $(elem).width().toFixed(0),
                height: $(elem).height().toFixed(0)
            });
        });
        $areasInput.val(JSON.stringify(areas));

        let imageData = {
            width: $previewImage.outerWidth(),
            height: $previewImage.outerHeight()
        };
        $imageDataInput.val(JSON.stringify(imageData));

        $modeInput.val($('#mode').find(':selected').val());

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
                var $download = $('.m-download');
                $download.find('img').attr('src', response);
                $download.fadeIn();
            })
            .always(function () {
                $progressBar.hide();
            });
    });

    let startX = null;
    let startY = null;
    let endX = null;
    let endY = null;
    let x = null;
    let y = null;
    let width = null;
    let height = null;

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

        let shadowWidth = 0;
        let shadowHeight = 0;
        let mouseX = e.offsetX;
        let mouseY = e.offsetY;
        let shadowX = 0;
        let shadowY = 0;


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

    $(window, document).on('resize', function () {
        $('.m-preview--areas--area--image').each(function () {
            $(this).css({
                'background-size': $previewImage.width() + 'px ' + $previewImage.height() + 'px',
                backgroundPositionX: 0 - $(this).parent().position().left + 15,
                backgroundPositionY: 0 - $(this).parent().position().top + 15,
            });
        });
    });

    $('.m-download--close').on('click', function (e) {
        e.preventDefault();
        $('.m-download').fadeOut();
    });

    function makeArea(x, y, w, h) {
        let $area = $('<div/>')
            .addClass('m-preview--areas--area')
            .css({
                width: w / $previewImage.width() * 100 + '%',
                height: h / $previewImage.height() * 100 + '%',
                top: y / $previewImage.height() * 100 + '%',
                left: x / $previewImage.width() * 100 + '%'
            })
            .append($('<div/>').addClass('m-preview--areas--area--image').css({
                backgroundImage: 'url(' + $previewImage.attr('src') + ')',
                backgroundPositionX: 0 - x + 15,
                backgroundPositionY: 0 - y + 15,
                'background-size': $previewImage.width() + 'px ' + $previewImage.height() + 'px'
            }))
            .on('mouseup', function (e) {
                e.stopPropagation();
                $(this).remove();
            }).on('mousedown mousemove', function (e) {
                e.stopPropagation();
            });

        $areas.append($area);
    }
});