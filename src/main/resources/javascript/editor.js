(function () {
    var canvas = document.getElementById('m-editor--canvas');

    if (typeof canvas.getContext === 'undefined') {
        console.error('This browser has no idea how to canvas :(');
        return;
    }

    var ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgb(255, 0, 255)';
    ctx.fillRect(20, 20, 50, 50);
})();