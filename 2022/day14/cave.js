class Cave {
    constructor() {
        this.blocked = {};
        this.lowestPoint = 0;
        this.grains = 0;
        this.sandOrigin = [500,0];
    }

    addWall(path) {
        const points = path.split(' -> ');
        var prevPoint;

        while (points.length > 0) {
            const nextPoint = points.pop().split(',').map((x) => parseInt(x));
            this.addBlockage(nextPoint[0], nextPoint[1]);

            if (!prevPoint) {
                prevPoint = nextPoint;
                continue;
            }

            var xDiff = prevPoint[0] - nextPoint[0];
            var yDiff = prevPoint[1] - nextPoint[1];

            if (xDiff > 0) {
                for (var i = 0; i < xDiff; i++) {
                    this.addBlockage(nextPoint[0] + i, nextPoint[1]);
                }
            } else if (xDiff < 0) {
                for (var i = 0; i < -xDiff; i++) {
                    this.addBlockage(nextPoint[0] - i, nextPoint[1]);
                }
            } else if (yDiff > 0) {
                for (var i = 0; i < yDiff; i++) {
                    this.addBlockage(nextPoint[0], nextPoint[1] + i);
                }
            } else if (yDiff < 0) {
                for (var i = 0; i < -yDiff; i++) {
                    this.addBlockage(nextPoint[0], nextPoint[1] - i);
                }
            }

            xDiff = yDiff = 0;
            prevPoint = nextPoint;
        }
    }

    addBlockage(x, y, isSand = false) {
        if (!this.blocked[y]) {
            this.blocked[y] = {};
        }
        this.blocked[y][x] = 1;

        if (!isSand) {
            this.lowestPoint = y > this.lowestPoint ? y : this.lowestPoint;
        }
    }

    isBlocked(x, y) {
        if (y === this.lowestPoint + 2) {
            return true;
        }

        if (!this.blocked[y]) {
            return false;
        } 
        
        return this.blocked[y][x];
    }

    fillSand() {
        var isCaveFilled = false;

        while(!isCaveFilled) {
            var grainPos = [this.sandOrigin[0], this.sandOrigin[1]];
            var isAtRest = false;
            while(!isAtRest) {
                // Move down
                if (!this.isBlocked(grainPos[0], grainPos[1] + 1)) {
                    grainPos[1] ++;
                } 
                // Move left down
                else if (!this.isBlocked(grainPos[0] - 1, grainPos[1] + 1)){
                    grainPos[0] --;
                    grainPos[1] ++;
                } 
                // Move right down
                else if (!this.isBlocked(grainPos[0] + 1, grainPos[1] + 1)) {
                    grainPos[0] ++;
                    grainPos[1] ++;
                } 
                // Is at rest
                else {
                    this.grains ++;
                    isAtRest = true;
                    this.addBlockage(grainPos[0], grainPos[1], true);
                }
            }

            isCaveFilled = this.isBlocked(this.sandOrigin[0], this.sandOrigin[1]);
        }
    }
}

exports.Cave = Cave;