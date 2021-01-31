let progress = document.querySelector('.progress');

function showProgress(message, percent) {
    console.log(message + ' (' + (percent * 100).toFixed(0) + '%)');

    if (percent === 0) {
        progress.style.display = 'block';
        progress.classList.remove('progress_hidden');
    }

    progress.querySelector('.progress--message').innerHTML = message;
    progress.querySelector('.progress--bar-container--bar').style.width = (percent * 100).toFixed(0) + '%';

    if (percent === 1) {
        progress.classList.add('progress_hidden');
        setTimeout(function () {
            progress.style.display = 'none';
        }, 600);
    }
}