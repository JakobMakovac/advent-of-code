const fs = require('fs');

class Simulation {
    constructor(minX, minY, maxX, maxY) {
        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
        this.validPairs = 0;
    }

    findSolutions() {
        let vx = getMinVX(this.minX);
        let vy = this.minY;

        while (vy < Math.abs(this.minY)) {

            while (vx <= this.maxX) {
                this.isValidPair(vx, vy);
                vx ++;
            }

            vx = getMinVX(this.minX);
            vy ++;
        }
    }

    isValidPair(vx, vy) {
        let x = 0;
        let y = 0;
        let _vx = vx;
        let _vy = vy;

        while (true) {
            x += _vx;
            y += _vy;

            if (this.isInTargetArea(x, y)) {
                this.validPairs ++;
                break;
            } else if (this.isBeyondTargetArea(x, y)) {
                break;
            }

            _vx === 0 ? _vx = 0 : _vx--;
            _vy--;
        }
    }

    isInTargetArea(x, y) {
        return x >= this.minX && x <= this.maxX && y >= this.minY && y <= this.maxY;
    }

    isBeyondTargetArea(x, y) {
        return x > this.maxX || y < this.minY;
    }
}

function getMinVX(x) {
    let d = 8 * x + 1;
    return Math.ceil((Math.sqrt(d) - 1) / 2);
}

fs.readFile('E:/workspace/advent-of-code/2021/day17/input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    let dataPoints = data.split('\r\n');
    dataPoints = dataPoints[0].replace('target area: ', '');

    let targetArea = dataPoints.split(', ');
    let xRestrictions = targetArea[0].replace('x=', '').split('..');
    let yRestrictions = targetArea[1].replace('y=', '').split('..');

    const minX = parseInt(xRestrictions[0]);
    const minY = parseInt(yRestrictions[0]);
    const maxX = parseInt(xRestrictions[1]);
    const maxY = parseInt(yRestrictions[1]);

    let sim = new Simulation(minX, minY, maxX, maxY);
    sim.findSolutions();

    console.log(`Solution for Part One: ${Math.abs((minY * (minY + 1)) / 2)}`)
    console.log(`Solution for Part Two: ${sim.validPairs}`);
});
