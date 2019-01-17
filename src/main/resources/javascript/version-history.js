(function () {
    if ($('.m-versions').length === 0) { return; }

    $('.m-versions--version--details--simple--switch').on('click', function (e) {
        e.preventDefault();

        var $details = $(this).parent().parent();

        if ($details.hasClass('m-versions--version--details_show-tech')) {
            $details.removeClass('m-versions--version--details_show-tech');
        } else {
            $details.addClass('m-versions--version--details_show-tech');
        }
    });

    $('.m-versions--version--title').on('click', function (e) {
        e.preventDefault();

        var $details = $(this).parent().find('.m-versions--version--details');

        $('.m-versions--version--details').removeClass('m-versions--version--details_show');
        $('.m-versions--version--details').removeClass('m-versions--version--details_show-tech');

        if ($details.hasClass('m-versions--version--details_show')) {
            $details.removeClass('m-versions--version--details_show');
        } else {
            $details.addClass('m-versions--version--details_show');
        }
    })
})();