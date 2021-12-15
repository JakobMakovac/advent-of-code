const fs = require('fs');

class Fold {
    constructor(axis, value) {
        this.axis = axis;
        this.value = value;
    }
    
    getAxis() {
        return this.axis;
    }

    getValue() {
        return this.value;
    }
}

class Point {
    constructor(x, y) {
        this.coordinates = {
            'x': x,
            'y': y
        };
    }

    get x() {
        return this.coordinates['x'];
    }

    get y() {
        return this.coordinates['y'];
    }

    foldAlong(fold) {
        if (this.coordinates[fold.getAxis()] < fold.getValue()) {
            return;
        } else {
            let diff = this.coordinates[fold.getAxis()] - fold.getValue();
            this.coordinates[fold.getAxis()] = fold.getValue() - diff;
        }
    }
}

function performFold(fold, points, maxX, maxY) {
    let occupiedSpaces = new Array(maxY + 1).fill(-1).map(() => new Array(maxX + 1).fill(-1));
    let newPoints = [];

    for (const p of points) {
        p.foldAlong(fold);

        if (occupiedSpaces[p.y][p.x] < 0) {
            occupiedSpaces[p.y][p.x] = 1;
            newPoints.push(p);
        }
    }

    return newPoints;
}

function printPoints(points, maxX, maxY) {
    let occupiedSpaces = new Array(maxY + 1).fill('.').map(() => new Array(maxX + 1).fill('.'));

    for (const p of points) {
        occupiedSpaces[p.y][p.x] = '#';
    }

    for (const row of occupiedSpaces) {
        console.log(row.join(''));
    }
}

fs.readFile('./input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    let lines = data.split('\r\n');
    let maxX = 0;
    let maxY = 0;
    let points = [];
    let folds = [];
    let pointsAfter1Fold = 0;

    for (const line of lines) {
        let _line = line.trim().split(',');
        if (_line[0] === '') {
            continue;
        }

        if (_line.length === 2) {
            let x = parseInt(_line[0]);
            let y = parseInt(_line[1]);

            maxX = (x > maxX ? x : maxX);
            maxY = (y > maxY ? y : maxY);

            points.push(new Point(x, y));
        } else {
            let foldParts = _line[0].split('=');
            folds.push(new Fold(foldParts[0][foldParts[0].length - 1], parseInt(foldParts[1])));
        }
    }

    for (var i = 0; i < folds.length; i++) {
        if (folds[i].getAxis() === 'x') {
            maxX = folds[i].getValue() - 1;
        } else {
            maxY = folds[i].getValue() - 1;
        }

        points = performFold(folds[i], points, maxX, maxY);

        if (i === 0) {
            pointsAfter1Fold = points.length;
        }
    }

    console.log(`Solution for Part One: ${pointsAfter1Fold}`);
    console.log(`Solution for Part Two:`);
    printPoints(points, maxX, maxY);
});