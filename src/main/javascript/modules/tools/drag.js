onTwoFingerDrag($canvasContainer, function (coordinates) {
    $canvasContainer.style.left = offset($canvasContainer).left - coordinates.dx + 'px';
    $canvasContainer.style.top = offset($canvasContainer).top - coordinates.dy + 'px';
});

let activateDrag = function (e) {
    this.setAttribute('data-is-dragged', true);
    this.setAttribute('data-drag-offset-x', e.offsetX);
    this.setAttribute('data-drag-offset-y', e.offsetY);
};

let deactivateDrag = function () {
    this.setAttribute('data-is-dragged', false);
};

let doDrag = function (e) {
    if (this.getAttribute('data-is-dragged') === 'true') {
        this.style.left = (e.clientX - this.getAttribute('data-drag-offset-x')) + 'px';
        this.style.top = (e.clientY - this.getAttribute('data-drag-offset-y')) + 'px';
    }
};

function setDraggable(element, activate) {
    let _activate = activate !== false;

    if (element.getAttribute('data-is-draggable') === 'true' && _activate) {
        return element;
    }

    if (!_activate) {
        element.setAttribute('data-is-draggable', false);
        element.setAttribute('data-is-dragged', false);
        element.classList.remove('is-draggable');

        element.removeEventListener('mousedown', activateDrag);
        element.removeEventListener('mouseup', deactivateDrag);
        element.removeEventListener('mouseout', deactivateDrag);
        element.removeEventListener('mousemove', doDrag);

        return element;
    }

    element.setAttribute('data-is-draggable', true);
    element.setAttribute('data-is-dragged', false);
    element.classList.add('is-draggable');

    element.addEventListener('mousedown', activateDrag);
    element.addEventListener('mouseup', deactivateDrag);
    element.addEventListener('mouseout', deactivateDrag);
    element.addEventListener('mousemove', doDrag);

    toolSettings.setAttribute('data-tool', 'none');

    return element;
}