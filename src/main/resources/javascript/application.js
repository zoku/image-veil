(function () {
    // Configuration
    var maxAllowedFileSizeMB = 5;

    // Elements
    var $settings = {
        module: $('.m-settings'),
        toggle: $('.m-settings--toggle')
    };

    var $upload = {
        module: $('.m-upload'),
        text: $('.m-upload .m-upload--text'),
        fileInput: $('#imageFile')
    };

    var $preview = {
        container: $('.m-preview-container'),
        module: $('.m-preview'),
        image: $('.m-preview .m-preview--image'),
        areas: $('.m-preview .m-preview--areas')
    };

    var $form = {
        module: $('#uploadform'),
        options: $('#imageOptions')
    };

    var $progress = {
        module: $('#progress'),
        bar: $('.m-progress--bar'),
        label: $('.m-progress--label')
    };

    var $startButton = $('#startButton');

    // Event handling
    $settings.toggle.on('click', function (e) {
        e.preventDefault();
        if ($settings.module.hasClass('m-settings_is-visible')) {
            $settings.module.removeClass('m-settings_is-visible');
        } else {
            $settings.module.addClass('m-settings_is-visible')
        }
    });

    $upload.fileInput.on('change', function() {
        var file = this.files[0];

        $settings.module.hide();
        $startButton.hide();
        $upload.text.removeClass('m-upload--text_small');

        $preview.areas.empty();

        if (file.size > maxAllowedFileSizeMB * 1024 * 1024) {
            $upload.text.text($upload.module.data('i18n--file-size-hint').replace('[size1]', (file.size / 1024 / 1024).toFixed(2)).replace('[size2]', maxAllowedFileSizeMB));
            $preview.container.hide();
            return;
        }

        if (file.type !== 'image/jpeg') {
            $upload.text.text($upload.module.data('i18n--file-type-hint').replace('[type]', file.type));
            $preview.container.hide();
            return;
        }

        $upload.text.addClass('m-upload--text_small').html(file.name + '<br>' + $upload.module.data('i18n--new-file-hint'));

        previewImage(this);
        $settings.module.show();
        $startButton.show();
    });

    $startButton.on('click', function (e) {
        e.preventDefault();

        $startButton.hide();
        $settings.module.removeClass('m-settings_is-visible');

        $progress.bar.css({ width: 0 });
        $progress.module.show();

        var imageOptions = {};

        var areas = [];
        $preview.areas.find('.m-preview--areas--area').each(function (i, elem) {
            areas.push({
                x: $(elem).position().left.toFixed(0),
                y: $(elem).position().top.toFixed(0),
                width: $(elem).width().toFixed(0),
                height: $(elem).height().toFixed(0)
            });
        });
        imageOptions.areas = areas;

        imageOptions.data = {
            width: $preview.image.width(),
            height: $preview.image.height()
        };

        imageOptions.mode = $('#mode :selected').val();
        imageOptions.addNoise = $('#addNoise').is(':checked');
        imageOptions.resize = $('#resize').is(':checked');

        $form.options.val(JSON.stringify(imageOptions));

        $.ajax({
            url: './imagereceiver',
            type: 'POST',
            data: new FormData($form.module[0]),
            cache: false,
            contentType: false,
            processData: false,
            xhr: function() {
                var xhr = $.ajaxSettings.xhr();
                if (xhr.upload) {
                    xhr.upload.addEventListener('progress', function(e) {
                        if (e.lengthComputable) {
                            $progress.bar.css({
                                width: (e.loaded / e.total * 100) + '%'
                            });
                            $progress.label.text($progress.label.data('i18n--upload').replace('[state]', (e.loaded / e.total * 100).toFixed(0)));
                            if (e.loaded === e.total) {
                                $progress.bar.css({ width: 0 }).addClass('m-progress--bar_indeterminate');
                                $progress.label.text($progress.label.data('i18n--work'));
                            }
                        }
                    } , false);
                }
                xhr.addEventListener('progress', function (e) {
                    if (e.lengthComputable) {
                        $progress.bar.removeClass('m-progress--bar_indeterminate');
                        $progress.bar.css({
                            width: (e.loaded / e.total * 100) + '%'
                        });
                        $progress.label.text($progress.label.data('i18n--download').replace('[state]', (e.loaded / e.total * 100).toFixed(0)));
                    }
                });
                return xhr;
            }
        })
        .done(function (response) {
            var _response = JSON.parse(response);

            if (_response.success) {
                var $download = $('.m-download');
                $download.find('img').attr('src', 'data:image/jpeg;base64,' + _response.image);

                $download.find('.m-download--content--cta').on('click', function (e) {
                    e.preventDefault();
                    var a = document.createElement("a");
                    a.href = window.URL.createObjectURL(base64ToBlob(_response.image));
                    a.download = "anonymous-image.jpg";
                    document.body.appendChild(a);
                    a.click();
                });

                $download.fadeIn();
            } else {
                $upload.text.text(_response.error).removeClass('m-upload--text_small');
                $preview.container.hide();
            }
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

        if ($preview.image.width() < $preview.image.height() && $preview.image.width() >= $preview.container.width()) {
            $preview.areas.css({
                left: '0',
                transform: 'none'
            });
        } else {
            $preview.areas.css({
                left: '',
                transform: ''
            });
        }
    });

    $('.m-download--close').on('click', function (e) {
        e.preventDefault();
        $('.m-download').fadeOut();
    });

    // Functions
    function base64ToBlob(base64) {
        var binary = atob(base64);
        var len = binary.length;
        var buffer = new ArrayBuffer(len);
        var view = new Uint8Array(buffer);
        for ( var i = 0; i < len; i++) {
            view[i] = binary.charCodeAt(i);
        }
        return new Blob([view], { type: 'image/jpeg' });
    }

    function positionToPercent(area, alsoConvertPosition) {
        var $area = $(area);
        var $areaBG = $area.find('.m-preview--areas--area--image-container--image');

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

    // Bind preview image loading
    var animationTime = 800;

    $preview.image.on('load', function () {
        $preview.container.show();

        if ($preview.image.width() < $preview.image.height()) {
            $preview.module.addClass('m-preview_portrait');
            $preview.areas.css({
                width: $preview.image.width(),
                height: $preview.image.height()
            });

            if ($preview.image.width() >= $preview.container.width()) {
                $preview.areas.css({
                    left: '0',
                    transform: 'none'
                });
            } else {
                $preview.areas.css({
                    left: '',
                    transform: ''
                });
            }
        } else {
            $preview.module.removeClass('m-preview_portrait');
            $preview.areas.css({
                width: '',
                height: '',
                left: '',
                transform: ''
            });
        }

        if ($preview.container.width() < $preview.image.width()) {
            $preview.container
                .scrollLeft(($preview.image.width() - $preview.container.width()) / 2)
                .find('.m-preview-container--touch-help').fadeIn(animationTime, function () {
                $preview.container.animate({
                    scrollLeft: $preview.image.width() - $preview.container.width()
                }, animationTime, function () {
                    $preview.container.animate({
                        scrollLeft: 0
                    }, animationTime, function () {
                        $preview.container.animate({
                            scrollLeft: ($preview.image.width() - $preview.container.width()) / 2
                        }, animationTime, function () {
                            $preview.container.find('.m-preview-container--touch-help').fadeOut(animationTime);
                        });
                    });
                });
            });
        }
    });

    function previewImage(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $preview.image.attr('src', e.target.result);
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    function makeArea(x, y, w, h) {
        x = x - w / 2;
        y = y - h / 2;

        if (x < 0) {
            x = 0;
        }

        if (y < 0) {
            y = 0;
        }

        if (x > $preview.areas.width() - w) {
            x = $preview.areas.width() - w
        }

        if (y > $preview.areas.height() - h) {
            y = $preview.areas.height() - h
        }

        $preview.areas.append($('<div/>')
            .addClass('m-preview--areas--area')
            .css({
                width: w / $preview.image.width() * 100 + '%',
                height: h / $preview.image.height() * 100 + '%',
                top: y / $preview.image.height() * 100 + '%',
                left: x / $preview.image.width() * 100 + '%'
            })
            .append($('<div/>').addClass('m-preview--areas--area--image-container').append($('<div/>').addClass('m-preview--areas--area--image-container--image').css({
                backgroundImage: 'url(' + $preview.image.attr('src') + ')',
                backgroundPositionX: 0 - x + 15,
                backgroundPositionY: 0 - y + 15,
                'background-size': $preview.image.width() + 'px ' + $preview.image.height() + 'px'
            })))
            .append($('<button/>').html('<i class="fas fa-times"></i>').addClass('m-preview--areas--area--remove').on('click', function (e) {
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
                handles: 'n,e,s,w,nw,se,sw',
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
})();
