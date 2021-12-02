const fs = require('fs');

class Submarine {
    constructor() {
        this.horizontal = 0;
        this.depth = 0;
        this.aim = 0;
    }

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

    getFinalOutput() {
        return this.horizontal * this.depth;
    }
};

const MoveDirections = {
    'UP': 'up',
    'DOWN': 'down',
    'FORWARD': 'forward'
};

fs.readFile('E:/workspace/advent-of-code/day2/input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    let directions = data.split('\r\n');

    let sub = new Submarine();
    
    for (var i = 0; i < directions.length; i++) {
        let move = directions[i].split(' ');
        sub.move(move[0], parseInt(move[1]));
    }

    console.log(sub.getFinalOutput());
});
