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

        $startButton.hide();

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
                $startButton.show();
            });
    });

    $preview.areas.on('click', function (e) {
        makeArea(e.offsetX, e.offsetY, 100, 100);
    });

    $(window, document).on('resize', function () {
        $('.m-preview--areas--area--image').each(function () {
            positionToPercent(this);
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
    function positionToPercent(area, alsoConvertPosition) {
        var $area = $(area);
        var $areaBG = $area.find('.m-preview--areas--area--image');

        $areaBG.css({
            'background-size': $preview.image.width() + 'px ' + $preview.image.height() + 'px',
            backgroundPositionX: 0 - $area.position().left + 15,
            backgroundPositionY: 0 - $area.position().top + 15
        });

        if(alsoConvertPosition) {
            var pX = $area.position().left / $preview.image.width() * 100;
            var pY = $area.position().top / $preview.image.height() * 100;
            var pW = $area.outerWidth() / $preview.image.width() * 100;
            var pH = $area.outerHeight() / $preview.image.height() * 100;

            $area.css({
                left: pX + '%',
                top: pY + '%',
                width: pW + '%',
                height: pH + '%'
            });
        }
    }

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
        $preview.areas.append($('<div/>')
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
            .append($('<button/>').html('<i class="fas fa-trash-alt"></i>').addClass('m-preview--areas--area--remove').on('click', function (e) {
                e.stopPropagation();
                $(this).parent().remove();
            }))
            .on('click', function (e) {
                e.stopPropagation();
            })
            .draggable({
                containment: 'parent',
                drag: function () {
                    positionToPercent(this);
                },
                stop: function () {
                    positionToPercent(this, true);
                }
            })
            .resizable({
                containment: 'parent',
                handles: 'all',
                minWidth: 60,
                minHeight: 60,
                resize: function () {
                    positionToPercent(this);
                },
                stop: function () {
                    positionToPercent(this, true);
                }
            })
        );
    }
});