const Direction = {
    Up: 'up',
    Right: 'right',
    Down: 'down',
    Left: 'left'
}

class Chamber {
    constructor (chamberWidth) {
        // State of chamber is saved as a set of '<x>,<y>': [x,y] pairs
        this.chamber = {};
        for (var i = 0; i < chamberWidth; i++) {
            this.chamber[`${i},0`] = [i, 0];
        }
        this.knownStates = {};

        this.jetIndex = 0;
        this.highestPoint = 0;
        this.ySkipped = 0;
        this.chamberWidth = chamberWidth;
    }

    addJetStreams(jetData) {
        this.jetStream = jetData;
    }

    dropRocks(count) {
        var steps = 0;

        while(steps < count) {
            const currentRock = new Rock(steps % 5, this.highestPoint + 4, this.chamberWidth);

            while(true) {
                switch(this.jetStream[this.jetIndex]) {
                    case '>':
                        currentRock.move(Direction.Right);
                        if (currentRock.overlaps(this.chamber)) {
                            currentRock.move(Direction.Left);
                        }
                        break;
                    case '<':
                        currentRock.move(Direction.Left);
                        if (currentRock.overlaps(this.chamber)) {
                            currentRock.move(Direction.Right);
                        }
                        break;
                }

                this.jetIndex = (this.jetIndex + 1) % this.jetStream.length;

                currentRock.move(Direction.Down);
                if (currentRock.overlaps(this.chamber)) {
                    currentRock.move(Direction.Up);
                    this.chamber = {
                        ...this.chamber,
                        ...currentRock.squares
                    };
                    this.highestPoint = Math.max(this.highestPoint, currentRock.maxY);
                    const stateKey = this.generateStatesKey(steps, this.jetIndex, this.highestPoint);
                    if (this.knownStates[stateKey] !== undefined) {
                        const [knownSteps, knownMaxY] = this.knownStates[stateKey];
                        const yDiff = this.highestPoint - knownMaxY;
                        const stepsDiff = steps - knownSteps;
                        const repetitions = Math.floor((count - steps) / stepsDiff);
                        steps += repetitions * stepsDiff;
                        this.ySkipped += repetitions * yDiff;
                    }
                    this.knownStates[stateKey] = [steps, this.highestPoint];
                    break;
                }
                
            }
            steps ++;
        }

        return this.highestPoint + this.ySkipped;
    }

    addStateToKnown(steps, jetIndex, maxY) {
        const key = this.generateStatesKey(steps, jetIndex, maxY);
        this.knownStates[key] = [steps, maxY];
    }

    generateStatesKey(steps, jetIndex, maxY) {
        return `${this.generatePattern(maxY)}-${steps % 5}-${jetIndex}`;
    }

    generatePattern(maxY) {
        const pattern = [];
        for (const [key, [x,y]] of Object.entries(this.chamber)) {
            if (maxY - y < 100) {
                pattern.push(`${x},${maxY - y}`);
            }
        }
        return pattern;
    }
}

class Rock {
    constructor(sequence, bottomY, rightLimit) {
        this.rightLimit = rightLimit;
        this.squares = {};
        this.generatePiece(sequence, bottomY)
    }

    generatePiece(seq, y) {
        switch(seq) {
            case 0:
                for (var i = 2; i < 6; i ++) {
                    this.squares[`${i},${y}`] = [i, y];
                }
                this.maxY = y;
                break;
            case 1:
                this.squares[`${2},${y + 1}`] = [2, y + 1];
                this.squares[`${3},${y}`] = [3, y];
                this.squares[`${3},${y + 1}`] = [3, y + 1];
                this.squares[`${3},${y + 2}`] = [3, y + 2];
                this.squares[`${4},${y + 1}`] = [4, y + 1];
                this.maxY = y + 2;
                break;
            case 2:
                this.squares[`${2},${y}`] = [2, y];
                this.squares[`${3},${y}`] = [3, y];
                this.squares[`${4},${y}`] = [4, y];
                this.squares[`${4},${y + 1}`] = [4, y + 1];
                this.squares[`${4},${y + 2}`] = [4, y + 2];
                this.maxY = y + 2;
                break;
            case 3:
                for (var i = 0; i < 4; i ++) {
                    this.squares[`${2},${y + i}`] = [2, y + i];
                }
                this.maxY = y + 3;
                break;
            case 4:
                this.squares[`${2},${y}`] = [2, y];
                this.squares[`${2},${y + 1}`] = [2, y + 1];
                this.squares[`${3},${y}`] = [3, y];
                this.squares[`${3},${y + 1}`] = [3, y + 1];
                this.maxY = y + 1;
                break;
        }
    }

    move(direction) {
        const newSquares = {};
        switch(direction) {
            case Direction.Down:
                for (const [x, y] of Object.values(this.squares)) {
                    newSquares[`${x},${y - 1}`] = [x, y - 1];
                }
                this.maxY --;
                break;
            case Direction.Left:
                for (const [x, y] of Object.values(this.squares)) {
                    if (x === 0) {
                        return;
                    }
                    newSquares[`${x - 1},${y}`] = [x - 1, y];
                }
                break;
            case Direction.Up:
                for (const [x, y] of Object.values(this.squares)) {
                    newSquares[`${x},${y + 1}`] = [x, y + 1];
                }
                this.maxY ++;
                break;
            case Direction.Right:
                for (const [x, y] of Object.values(this.squares)) {
                    if (x === this.rightLimit - 1) {
                        return;
                    }
                    newSquares[`${x + 1},${y}`] = [x + 1, y];
                }
                break;
        }
        this.squares = newSquares;
    }

    overlaps(state) {
        for (const [key, ] of Object.entries(this.squares)) {
            if (state[key] !== undefined) {
                return true;
            }
        }

        return false;
    }
}

exports.Chamber = Chamber;
exports.Rock = Rock;