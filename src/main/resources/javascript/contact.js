(function () {
    var $form = $('.m-contact--form');
    var $email = $('#mailAddress');
    var $subject = $('#subject');
    var $message = $('#message');
    var $token = $('#token');
    var $language = $('#language');
    var $send = $('#send');
    var $finish = $('.m-contact--finish');

    $send.on('click', function () {
        $send.prop('disabled', true);

        var messageData = {
            email: $email.val(),
            subject: $subject.val(),
            message: $message.val(),
            token: $token.val(),
            l: $language.val()
        };

        $.post(window.location.href, messageData, function (response) {
            if (response.success) {
                $finish.addClass('m-contact--finish_success')
            } else {
                $finish.addClass('m-contact--finish_error')
            }

            $form.fadeOut(function () {
                $finish.text(response.message).fadeIn();
            });
        }, 'json');
    })
})();
