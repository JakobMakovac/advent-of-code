class CPU {
    constructor () {
        this.cycleCounter = 0;
        this.registerX = 1;
        this.totalSignalStrength = 0;
        this.screen = Array.from(Array(6), () => new Array(40));
    }

    executeOp(operation, value) {
        switch(operation) {
            case 'noop':
                this.increaseCycle(1);
                break;
            case 'addx':
                this.increaseCycle(2);
                this.increaseRegisterX(value);
        }
    }

    increaseRegisterX(value) {
        this.registerX += value;
    }

    increaseCycle(number) {
        for (var i = 0; i < number; i++) {
            this.cycleCounter ++;
            this.checkCycleCount();
            this.draw();
        }
    }

    checkCycleCount() {
        if ((this.cycleCounter + 20) % 40 === 0) {
            this.totalSignalStrength += (this.cycleCounter * this.registerX);
        }
    }

    draw() {
        const y = Math.floor((this.cycleCounter - 1) / 40);
        const x = (this.cycleCounter - 1) % 40;

        this.screen[y][x] = Math.abs(x - this.registerX) < 2 ? '#' : '.';
    }
}

exports.CPU = CPU;