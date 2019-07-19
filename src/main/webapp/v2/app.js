(function () {
    var canvasContainer = document.getElementById('canvasContainer');
    var canvas = document.getElementById('imageCanvas');
    var ctx = canvas.getContext('2d');
    var img = new Image();

    img.onload = function () {
        canvasContainer.width = this.width;
        canvasContainer.height = this.height;
        canvas.width = this.width;
        canvas.height = this.height;
        ctx.drawImage(this, 0, 0, this.width, this.height);
    };
    img.src = 'demo.png';

    var submenus = document.getElementsByClassName('menus--items--item--submenu');
    for (var k=0; k < submenus.length; k++) {
        submenus[k].addEventListener('mouseleave', function (e) {
            this.style.display = 'none';
        });

        submenus[k].parentElement.addEventListener('click', function (e) {
            e.stopPropagation();
            var mn = this.getElementsByClassName('menus--items--item--submenu')[0];
            if (mn.style.display === 'block') {
                mn.style.display = 'none';
            } else {
                mn.style.display = 'block';
            }
        });

        submenus[k].parentElement.addEventListener('mouseover', function (e) {
            e.stopPropagation();
            if (this.classList.contains('menus--items--item')) { return; }
            var mn = this.getElementsByClassName('menus--items--item--submenu')[0];
            if (mn.style.display === 'block') {
                mn.style.display = 'none';
            } else {
                mn.style.display = 'block';
            }
        });
    }
})();