const fs = require('fs');
const MoveDirections = {
    'UP': 'up',
    'DOWN': 'down',
    'FORWARD': 'forward'
};

class Submarine {
    constructor() {
        this.horizontal = 0;
        this.depth = 0;
        this.aim = 0;
    }

    getFinalOutput() {
        return this.horizontal * this.depth;
    }
};

class SubmarinePart1 extends Submarine {
    move(direction, amount) {
        switch (direction) {
            case MoveDirections.UP:
                this.depth -= amount;
                break;
            case MoveDirections.DOWN:
                this.depth += amount;
                break;
            case MoveDirections.FORWARD:
                this.horizontal += amount;
                break;
        }
    }
}

class SubmarinePart2 extends Submarine {
    move(direction, amount) {
        switch (direction) {
            case MoveDirections.UP:
                this.aim -= amount;
                break;
            case MoveDirections.DOWN:
                this.aim += amount;
                break;
            case MoveDirections.FORWARD:
                this.horizontal += amount;
                this.depth += (this.aim * amount);
                break;
        }
    }
}


fs.readFile('./input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    let directions = data.split('\r\n');

    let subPart1 = new SubmarinePart1();
    let subPart2 = new SubmarinePart2();
    
    for (var i = 0; i < directions.length; i++) {
        let move = directions[i].split(' ');
        subPart1.move(move[0], parseInt(move[1]));
        subPart2.move(move[0], parseInt(move[1]));
    }

    console.log(`Solution for Part One: ${subPart1.getFinalOutput()}`);
    console.log(`Solution for Part Two: ${subPart2.getFinalOutput()}`);
});
