(function () {
    $('.m-language').on('click',function() {
        $('.m-language .m-language--list').toggleClass('m-language--list_is-active');
    });

    $('.m-language .m-language--list').on('mouseleave',function() {
        $('.m-language .m-language--list').removeClass('m-language--list_is-active');
    });
})();
