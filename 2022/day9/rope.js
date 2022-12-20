class Rope {
    constructor (knots) {
        this.rootKnot = new RopeKnot();
        for (var i = 0; i < knots - 1; i++) {
            this.addKnot();
        }
    }

    addKnot() {
        const nextKnot = new RopeKnot();
        this.rootKnot.addKnot(nextKnot);
    }

    moveHead(direction) {
        this.rootKnot.move(direction);
    }

    getTailPosition() {
        var nextknot = this.rootKnot;
        while (!nextknot.isTail) {
            nextknot = nextknot.nextKnot;
        }

        return {
            x: nextknot.x,
            y: nextknot.y
        };
    }
}

class RopeKnot {
    constructor () {
        this.x = 0;
        this.y = 0;
        this.nextKnot = undefined;
        this.isTail = true;
    }

    addKnot(knot) {
        if (this.nextKnot) {
            this.nextKnot.addKnot(knot);
        } else {
            this.nextKnot = knot;
            this.isTail = false;
        }
    }

    move(direction) {
        switch(direction) {
            case 'U':
                this.y ++;
                break;
            case 'R':
                this.x ++;
                break;
            case 'D':
                this.y --;
                break;
            case 'L':
                this.x --;
                break;
        }

        if (!this.isTail) {
            this.nextKnot.propagateMovement(this.x, this.y);
        }
    }

    propagateMovement(prevKnotX, prevKnotY) {
        const xDiff = prevKnotX - this.x;
        const yDiff = prevKnotY - this.y;
        const shouldMoveDiagonally = xDiff !== 0 && yDiff !== 0 && (Math.abs(xDiff) > 1 || Math.abs(yDiff) > 1);

        if (xDiff === 0 && yDiff === 0) {
            return;
        }

        if (xDiff === 2) {
            this.x ++;
            if (shouldMoveDiagonally) {
                yDiff > 0 ? this.y ++ : this.y --;
            }
        } else if (xDiff === -2) {
            this.x --;
            if (shouldMoveDiagonally) {
                yDiff > 0 ? this.y ++ : this.y --;
            }
        } else if (yDiff === 2) {
            this.y ++;
            if (shouldMoveDiagonally) {
                xDiff > 0 ? this.x ++ : this.x --;
            }
        } else if (yDiff === -2) {
            this.y --;
            if (shouldMoveDiagonally) {
                xDiff > 0 ? this.x ++ : this.x --;
            }
        }

        if (!this.isTail) {
            this.nextKnot.propagateMovement(this.x, this.y);
        }
    }
}

exports.Rope = Rope;