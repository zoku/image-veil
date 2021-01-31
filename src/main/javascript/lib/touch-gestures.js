function onTouchDrag(element, onDragCallback) {
    const eventCountToActivation = 5;
    let eventCount = 0;

    element.addEventListener('touchstart', function (e) {
        eventCount = 0;
    });

    element.addEventListener('touchmove', function (e) {
        eventCount++;

        if (e.touches.length !== 1) eventCount = 0;
        if (eventCount < eventCountToActivation) return;

        if (e.touches.length === 1) {
            let relativeX = e.touches[0].pageX - offset(element).left;
            let relativeY = e.touches[0].pageY - offset(element).top;

            onDragCallback({ x: relativeX, y: relativeY });
        }
    });
}

function onTwoFingerDrag(element, onDragCallback) {
    let previousCoordinates = null;

    element.addEventListener('touchmove', function (e) {
        if (e.touches.length === 2) {
            let absoluteX = (Math.max(e.touches[0].pageX, e.touches[1].pageX) - Math.min(e.touches[0].pageX, e.touches[1].pageX)) / 2 + Math.min(e.touches[0].pageX, e.touches[1].pageX);
            let absoluteY = (Math.max(e.touches[0].pageY, e.touches[1].pageY) - Math.min(e.touches[0].pageY, e.touches[1].pageY)) / 2 + Math.min(e.touches[0].pageY, e.touches[1].pageY);

            let deltaX = previousCoordinates.x - absoluteX;
            let deltaY = previousCoordinates.y - absoluteY;

            previousCoordinates = {
                x: absoluteX,
                y: absoluteY
            };

            onDragCallback({ dx: deltaX, dy: deltaY });
        }
    });

    element.addEventListener('touchstart', function (e) {
        if (e.touches.length === 2) {
            previousCoordinates = {
                x: (Math.max(e.touches[0].pageX, e.touches[1].pageX) - Math.min(e.touches[0].pageX, e.touches[1].pageX)) / 2 + Math.min(e.touches[0].pageX, e.touches[1].pageX),
                y: (Math.max(e.touches[0].pageY, e.touches[1].pageY) - Math.min(e.touches[0].pageY, e.touches[1].pageY)) / 2 + Math.min(e.touches[0].pageY, e.touches[1].pageY)
            };
        }
    });

    element.addEventListener('touchend', function (e) {
        if (e.touches.length === 2) {
            previousCoordinates = null;
        }
    });
}

function onPinch(element, onPinchCallback) {
    let initialPinchDistance = null;
    element.addEventListener('touchstart', function (e) {
        if (e.touches.length === 2) {
            // e.stopPropagation();
            let deltas = getDeltas(e);

            initialPinchDistance = { dx: deltas.dx, dy: deltas.dy };
        }
    });

    element.addEventListener('touchend', function (e) {
        initialPinchDistance = null;
    });

    element.addEventListener('touchmove', function (e) {
        let pinchThreshold = 4.5;
        if (e.touches.length === 2 && initialPinchDistance !== null) {
            let deltas = getDeltas(e);

            let deltaDx = initialPinchDistance.dx > deltas.dx? initialPinchDistance.dx - deltas.dx : deltas.dx - initialPinchDistance.dx;
            let deltaDy = initialPinchDistance.dy > deltas.dy? initialPinchDistance.dy - deltas.dy : deltas.dy - initialPinchDistance.dy;

            let delta = Math.sqrt(deltaDx + deltaDy);

            if (deltas.dx < initialPinchDistance.dx) {
                delta = -delta;
            }

            if (delta < pinchThreshold && delta > -pinchThreshold) return;

            initialPinchDistance = getDeltas(e);

            let absoluteX = (e.touches[0].pageX > e.touches[1].pageX? e.touches[0].pageX - e.touches[1].pageX : e.touches[1].pageX - e.touches[0].pageX) / 2;
            let absoluteY = (e.touches[0].pageY > e.touches[1].pageY? e.touches[0].pageY - e.touches[1].pageY : e.touches[1].pageY - e.touches[0].pageY) / 2;

            let relativeX = absoluteX - offset(this).left;
            let relativeY = absoluteY - offset(this).top;

            onPinchCallback({delta: delta, pageX: absoluteX, pageY: absoluteY, elementX: relativeX, elementY: relativeY});
        }
    });
}

function getDeltas(event) {
    let x1 = event.touches[0].pageX;
    let y1 = event.touches[0].pageY;
    let x2 = event.touches[1].pageX;
    let y2 = event.touches[1].pageY;

    let dx = (x1 > x2)? x1 - x2 : x2 - x1;
    let dy = (y1 > y2)? y1 - y2 : y2 - y1;

    return { dx: dx, dy: dy };
}