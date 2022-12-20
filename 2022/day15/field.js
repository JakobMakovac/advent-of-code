class Field {
    constructor() {
        this.pairs = [];
    }

    addPair(pair) {
        this.pairs.push(pair);
    }

    isOverlapping(point) {
        for (const pair of this.pairs) {
            if (pair.isWithinBounds(point)) {
                return true;
            }
        }
        return false;
    }
}

class SensorBeaconPair {
    constructor (line, limit) {
        const parts = line.replace('Sensor at ', '').replace(' closest beacon is at ', '').split(':');
        const sensor = parts[0].replace('x=', '').replace(' y=', '').split(',');
        const beacon = parts[1].replace('x=', '').replace(' y=', '').split(',');
        this.sensorPos = {
            'x': parseInt(sensor[0]),
            'y': parseInt(sensor[1])
        };
        this.beaconPos = {
            'x': parseInt(beacon[0]),
            'y': parseInt(beacon[1])
        };
        this.manhattanDist = Math.abs(this.beaconPos.y - this.sensorPos.y) + Math.abs(this.beaconPos.x - this.sensorPos.x);
        this.outerPerimeter = [];
        this.limit = limit;
        this.generateOuterPerimeter();
    }

    generateOuterPerimeter() {
        const maxDist = this.manhattanDist + 1;
        this.outerPerimeter.push([this.sensorPos.x + maxDist, this.sensorPos.y]);
        this.outerPerimeter.push([this.sensorPos.x - maxDist, this.sensorPos.y]);
        this.outerPerimeter.push([this.sensorPos.x, this.sensorPos.y + maxDist]);
        this.outerPerimeter.push([this.sensorPos.x, this.sensorPos.y - maxDist]);
        for (var i = 1; i <= this.manhattanDist; i++) {
            // Top left
            this.outerPerimeter.push([this.sensorPos.x - maxDist + i, this.sensorPos.y - i]);
            // Top right
            this.outerPerimeter.push([this.sensorPos.x + maxDist - i, this.sensorPos.y - i]);
            // Bottom left
            this.outerPerimeter.push([this.sensorPos.x - maxDist + i, this.sensorPos.y + i]);
            // Bottom right
            this.outerPerimeter.push([this.sensorPos.x + maxDist - i, this.sensorPos.y + i]);
        }
        this.outerPerimeter = this.outerPerimeter.filter((point) => point[0] >= 0 && point[0] <= this.limit && point[1] >= 0 && point[1] <= this.limit);
    }

    isWithinBounds(point) {
        const sensorDist = Math.abs(point[0] - this.sensorPos.x) + Math.abs(point[1] - this.sensorPos.y);
        return sensorDist <= this.manhattanDist;
    }
}

exports.Pair = SensorBeaconPair;
exports.Field = Field;