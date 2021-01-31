function crystallize(imageData) { // : ImageData
    return filter(imageData, function (buffer, width, height) {
        // Prepare crystallize
        let cells = 60;
        let cellWidth = width / cells;
        let cellHeight = height / cells;

        let xs = [];
        let ys = [];

        // Generate cells
        for (let y = 0; y < cells; y++) {
            for (let x=0; x < cells; x++) {
                xs[y * cells + x] = Math.round(x * cellWidth + (Math.random() * cellWidth));
                ys[y * cells + x] = Math.round(y * cellHeight + (Math.random() * cellHeight));
            }
        }

        // Draw
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let currentCellX = Math.round(Math.min(Math.floor(x / cellWidth), cells - 1));
                let currentCellY = Math.round(Math.min(Math.floor(y / cellHeight), cells - 1));

                let nearestPoint = currentCellY * cells + currentCellX;

                let displacements = [
                    nearestPoint - cells - 1,
                    nearestPoint - cells,
                    nearestPoint - cells + 1,
                    nearestPoint - 1,
                    nearestPoint,
                    nearestPoint + 1,
                    nearestPoint + cells - 1,
                    nearestPoint + cells,
                    nearestPoint + cells + 1
                ];

                let adjacentPoints = [];
                for (let i=0; i < displacements.length; i++) {
                    let it = displacements[i];
                    if (it >= 0 && it <= xs.length - 1) {
                        adjacentPoints.push(it);
                    }
                }

                let n = 0;
                for (let j=0; j < adjacentPoints.length; j++) {
                    let jt = adjacentPoints[j];
                    if (distSq(xs[jt], x, ys[jt], y) < distSq(xs[n], x, ys[n], y)) n = jt
                }

                buffer[y * width + x] = buffer[ys[n] * width + xs[n]];
            }
        }
    });
}