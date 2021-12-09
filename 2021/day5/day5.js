const fs = require('fs');

class Diagram {
    constructor() {
        this.grid = {};
    }

    addLine(_line) {
        var endPoints = _line.split(' -> ').map((point) => point.split(',').map((value) => parseInt(value)));
        var line = new Line(endPoints[0][0], endPoints[1][0], endPoints[0][1], endPoints[1][1]);

        this.markHitsOnGrid(line.points);
    }

    markHitsOnGrid(points) {
        for(var i = 0; i < points.length; i++) {
            if (!this.grid[points[i].x]) {
                this.grid[points[i].x] = {};
            }

            if (!this.grid[points[i].x][points[i].y]) {
                this.grid[points[i].x][points[i].y] = 1;
            } else {
                this.grid[points[i].x][points[i].y] ++
            }
        }
    }

    countOverlaps() {
        var total = 0;
        
        for (const [columnIndex, column] of Object.entries(this.grid)) {
            for (const [rowIndex, field] of Object.entries(column)) {
                if (field > 1) {
                    total ++;
                }
            }
        }

        return total;
    }
}

class Line {
    constructor(x1, x2, y1, y2) {
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
        this.points = [];
        this.isDiagonalLine = false;
        this.markPoints();
    }

    markPoints() {
        if (this.x1 === this.x2) {
            this.createVerticalLine(this.x1, this.y1, this.y2);
        } else if (this.y1 === this.y2) {
            this.createHorizontalLine(this.y1, this.x1, this.x2);
        } else {
            this.createDiagonalLine(this.x1, this.x2, this.y1, this.y2);
        }
    }

    createHorizontalLine(y, x1, x2) {
        if (x1 < x2) {
            for (var i = x1; i <= x2; i++) {
                this.points.push(new Point(i, y));
            }
        } else {
            for (var i = x2; i <= x1; i++) {
                this.points.push(new Point(i, y));
            }
        }
    }

    createVerticalLine(x, y1, y2) {
        if (y1 < y2) {
            for (var i = y1; i <= y2; i++) {
                this.points.push(new Point(x, i));
            }
        } else {
            for (var i = y2; i <= y1; i++) {
                this.points.push(new Point(x, i));
            }
        }
    }

    createDiagonalLine(x1, x2, y1, y2) {
        var delta = Math.abs(x2-x1);

        for (var i = 0; i <= delta; i++) {
            var _x = (x1 < x2
                ? x1 + i
                : x1 - i);
            var _y = (y1 < y2
                ? y1 + i
                : y1 - i);

            this.points.push(new Point(_x, _y));
        }
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

fs.readFile('./input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    var inputLines = data.split('\r\n');

    var diagram = new Diagram();

    for (var i = 0; i < inputLines.length; i++) {
        diagram.addLine(inputLines[i]);
    }

    console.log(diagram.countOverlaps());
});