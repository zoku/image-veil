let menuIsOpen = false;

// Bind menus
let menuItems = document.querySelectorAll('.menus--items--item');
let submenus = document.querySelectorAll('.menus--items--item--submenu');

function closeAllMenus() {
    for (let i=0; i < submenus.length; i++) {
        submenus[i].style.display = 'none';
    }
}

for (let i=0; i < menuItems.length; i++) {
    let menuItem = menuItems[i];

    menuItem.addEventListener('click', function(e) {
        e.stopPropagation();

        if (this.querySelector('.menus--items--item--submenu').style.display === 'block') {
            this.querySelector('.menus--items--item--submenu').style.display = 'none';
            menuIsOpen = false;
        } else {
            closeAllMenus();
            this.querySelector('.menus--items--item--submenu').style.display = 'block';
            menuIsOpen = true;
        }
    });
    menuItem.addEventListener('mouseenter', function() {
        if (!menuIsOpen) return;

        if (this.querySelector('.menus--items--item--submenu').style.display !== 'block') {
            closeAllMenus();
            this.querySelector('.menus--items--item--submenu').style.display = 'block';
        }
    });
}

document.addEventListener('click', function () {
    closeAllMenus();
    menuIsOpen = false;
});

// Open
document.getElementById('menu-open').addEventListener('touchend', function () {
    document.querySelector('.menus').classList.add('menus_is-active');
});

// Close
document.getElementById('menu-close').addEventListener('touchend', function (e) {
    e.preventDefault();
    document.querySelector('.menus').classList.remove('menus_is-active');
});

// -- File
// -- -- Open
document.getElementById('menu--file--open').addEventListener('click', function () {
    closeAllMenus();
    document.getElementById('canvas-file-input').click();
});

// -- -- Save as
document.getElementById('menu--file--save').addEventListener('click', function () {
    if (this.classList.contains('menus--items--item--submenu--item_disabled')) {
        return;
    }

    closeAllMenus();

    let $download = document.createElement('a');

    $download.setAttribute('href', $canvas.toDataURL('image/jpeg', .8));
    $download.setAttribute('target', '_blank');
    $download.setAttribute('download', 'anonymous-image.jpg');

    $download.click();
});