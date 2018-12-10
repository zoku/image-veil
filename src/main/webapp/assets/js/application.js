$(document).ready(function () {
    // Configuration
    var maxAllowedFileSizeMB = 5;

    // Elements
    var $upload = {
        module: $('.m-upload'),
        text: $('.m-upload .m-upload--text'),
        fileInput: $('#imageFile')
    };

    var $preview = {
        module: $('.m-preview'),
        image: $('.m-preview .m-preview--image'),
        shadow: $('.m-preview .m-preview--shadow'),
        areas: $('.m-preview .m-preview--areas')
    };

    var $form = {
        module: $('#uploadform'),
        inputs: {
            areas: $('#areasInput'),
            mode: $('#modeInput'),
            imageData: $('#imageDataInput')
        }
    };

    var $progress = {
        module: $('#progress'),
        bar: $('.m-progress--bar')
    };

    var $modeContainer = $('.m-mode');
    var $startButton = $('#startButton');

    // App-global variables
    var startX = null;
    var startY = null;
    var endX = null;
    var endY = null;
    var x = null;
    var y = null;
    var width = null;
    var height = null;
    var lastMove = null;

    // Event handling
    $upload.fileInput.on('change', function() {
        var file = this.files[0];

        $modeContainer.hide();
        $startButton.hide();
        $upload.text.removeClass('m-upload--text_small');

        $preview.areas.empty();

        if (file.size > maxAllowedFileSizeMB * 1024 * 1024) {
            $upload.text.text($upload.module.data('i18n--file-size-hint').replace('[size1]', (file.size / 1024 / 1024).toFixed(2)).replace('[size2]', maxAllowedFileSizeMB));
            $preview.module.hide();
            return;
        }

        $upload.text.addClass('m-upload--text_small').html(file.name + '<br>' + $upload.module.data('i18n--new-file-hint'));

        previewImage(this);
        $modeContainer.show();
        $startButton.show();
    });

    $startButton.on('click', function (e) {
        e.preventDefault();

        $startButton.prop('disabled', true);

        $progress.bar.css({ width: 0 });
        $progress.module.show();

        var areas = [];
        $preview.areas.find('.m-preview--areas--area').each(function (i, elem) {
            areas.push({
                x: $(elem).position().left.toFixed(0),
                y: $(elem).position().top.toFixed(0),
                width: $(elem).width().toFixed(0),
                height: $(elem).height().toFixed(0)
            });
        });
        $form.inputs.areas.val(JSON.stringify(areas));

        var imageData = {
            width: $preview.image.width(),
            height: $preview.image.height()
        };
        $form.inputs.imageData.val(JSON.stringify(imageData));

        $form.inputs.mode.val($('#mode').find(':selected').val());

        $.ajax({
            url: '/imagereceiver',
            type: 'POST',
            data: new FormData($form.module[0]),
            cache: false,
            contentType: false,
            processData: false,
            xhr: function() {
                var myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) {
                    myXhr.upload.addEventListener('progress', function(e) {
                        if (e.lengthComputable) {
                            $progress.bar.css({
                                width: (e.loaded / e.total * 100) + '%'
                            });
                            if (e.loaded === e.total) {
                                $progress.bar.addClass('m-progress--bar_indeterminate');
                            }
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
                $progress.bar.removeClass('m-progress--bar_indeterminate');
                $progress.module.hide();
                $startButton.prop('disabled', false);
            });
    });

    $preview.areas.on('mousedown', buildAreaStart);
    $preview.areas[0].addEventListener('touchstart', buildAreaStart);

    function buildAreaStart(e) {
        e.preventDefault();

        if (isTouchDevice()) {
            var rect = e.target.getBoundingClientRect();
            startX = e.targetTouches[0].pageX - rect.left;
            startY = e.targetTouches[0].pageY - rect.top;
        } else {
            startX = e.offsetX;
            startY = e.offsetY;
        }

        $preview.shadow.show();
    }

    $preview.areas.on('mousemove', buildAreaMove);
    $preview.areas[0].addEventListener('touchmove', buildAreaMove);

    function buildAreaMove(e) {
        e.preventDefault();

        if (startX === null || startY === null || !$preview.shadow.is(':visible')) {
            return;
        }

        var shadowWidth = 0;
        var shadowHeight = 0;
        var shadowX = 0;
        var shadowY = 0;

        var mouseX;
        var mouseY;
        if (isTouchDevice()) {
            var rect = e.target.getBoundingClientRect();
            mouseX = e.targetTouches[0].pageX - rect.left;
            mouseY = e.targetTouches[0].pageY - rect.top;
            lastMove = e;
        } else {
            mouseX = e.offsetX;
            mouseY = e.offsetY;
        }

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
            $preview.shadow.css({
                'transform': 'translateX(' + shadowX + 'px) translateY(' + shadowY + 'px)',
                width: shadowWidth,
                height: shadowHeight
            });
        });
    }

    $preview.areas.on('mouseup', buildAreaEnd);
    $preview.areas[0].addEventListener('touchend', buildAreaEnd);

    function buildAreaEnd(e) {
        e.preventDefault();

        if(isTouchDevice()) {
            var rect = lastMove.target.getBoundingClientRect();
            endX = lastMove.targetTouches[0].pageX - rect.left;
            endY = lastMove.targetTouches[0].pageY - rect.top;

        } else {
            endX = e.offsetX;
            endY = e.offsetY;
        }

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
        $preview.shadow.hide();
    }

    $(window, document).on('resize', function () {
        $('.m-preview--areas--area--image').each(function () {
            $(this).css({
                'background-size': $preview.image.width() + 'px ' + $preview.image.height() + 'px',
                backgroundPositionX: 0 - $(this).parent().position().left + 15,
                backgroundPositionY: 0 - $(this).parent().position().top + 15
            });
        });
    });

    $('.m-download--close').on('click', function (e) {
        e.preventDefault();
        $('.m-download').fadeOut();
    });

    // -- Language selection
    $('.m-language').on('click', function () {
        $('.m-language .m-language--list').fadeToggle();
    });

    $('.m-language .m-language--list').on('mouseout', function () {
        $('.m-language .m-language--list').fadeOut();
    });

    // Functions
    function previewImage(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $preview.image.attr('src', e.target.result);
            };
            reader.readAsDataURL(input.files[0]);
            $preview.module.show();
        }
    }

    function makeArea(x, y, w, h) {
        var $area = $('<div/>')
            .addClass('m-preview--areas--area')
            .css({
                width: w / $preview.image.width() * 100 + '%',
                height: h / $preview.image.height() * 100 + '%',
                top: y / $preview.image.height() * 100 + '%',
                left: x / $preview.image.width() * 100 + '%'
            })
            .append($('<div/>').addClass('m-preview--areas--area--image').css({
                backgroundImage: 'url(' + $preview.image.attr('src') + ')',
                backgroundPositionX: 0 - x + 15,
                backgroundPositionY: 0 - y + 15,
                'background-size': $preview.image.width() + 'px ' + $preview.image.height() + 'px'
            }))
            .on('mouseup', function (e) {
                e.stopPropagation();
                $(this).remove();
            }).on('mousedown mousemove', function (e) {
                e.stopPropagation();
            });

        $preview.areas.append($area);
    }

    function isTouchDevice() {
        var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
        var mq = function(query) {
            return window.matchMedia(query).matches;
        };

        if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
            return true;
        }

        // include the 'heartz' as a way to have a non matching MQ to help terminate the join
        // https://git.io/vznFH
        var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
        return mq(query);
    }
});