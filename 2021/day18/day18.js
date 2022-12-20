const fs = require('fs');

class SNumber {
    constructor(input) {
        this.rightSNumber = undefined;
        this.leftSNumber = undefined;
        this.isValue = false;
        this.value = undefined;
        this.parseNumber(input);
    }

    parseNumber(input) {
        if (!input) {
            return;
        }

        if (input.length < 3) {
            this.isValue = true;
            this.value = parseInt(input);
        } else {
            let parsed = parseSNumber(input);
    
            this.leftSNumber = parsed[0];
            this.rightSNumber = parsed[1];
        }
    }

    static addNumbers(firstSNum, secondSNum) {
        let n = new SNumber();
        n.leftSNumber = firstSNum;
        n.rightSNumber = secondSNum;
        return n;
    }

    addToLeftValue(number) {
        if (this.isValue && this.value > 0) {
            this.value += number;
            return [];
        }

        let rightReturn = this.rightSNumber?.addToLeftValue(number) || [number];
        
        return rightReturn.length === 0 ? rightReturn : this.leftSNumber.addToLeftValue(number);
        
    }

    addToRightValue(number) {
        if (this.isValue && this.value > 0) {
            this.value += number;
            return [];
        }

        let leftReturn = this.leftSNumber?.addToRightValue(number) || [number];
        
        return leftReturn.length === 0 ? leftReturn : this.rightSNumber.addToRightValue(number);
    }

    printSNum() {
        if (this.isValue) {
            return this.value.toString();
        } else {
            return `[${this.leftSNumber.printSNum()},${this.rightSNumber.printSNum()}]`;
        }
    }
}

function reduceSNumber(number, depth) {
    if (number.isValue) {
        if (number.value > 9) {
            number.isValue = false;
            number.leftSNumber = new SNumber(Math.floor(number.value / 2).toString());
            number.rightSNumber = new SNumber(Math.ceil(number.value / 2).toString());
        }
        return [];
    }

    if (depth > 3) {
        let leftNumber = number.leftSNumber.value;
        let rightNumber = number.rightSNumber.value;
        number.isValue = true;
        number.value = 0;

        delete number.leftSNumber;
        delete number.rightNumber;

        return [leftNumber, rightNumber];
    }

    if (!number.isValue) {
        let explodedValues = [
            ...reduceSNumber(number.leftSNumber, depth + 1),
            ...reduceSNumber(number.rightSNumber, depth + 1)
        ];

        if (explodedValues && explodedValues.length > 0) {
            return [
                ...number.leftSNumber.addToLeftValue(explodedValues[0]),
                ...number.rightSNumber.addToRightValue(explodedValues[1])
            ];
        }
    }

    return [];
}

function parseSNumber(input) {
    // We have a value
    if (!input.startsWith('[')) {
        return parseInt(input);
    }
    // We have a pair - strip outer [] and parse parts
    else {
        input = input.slice(1, input.length - 1);
    }

    let pairSeparationIndex = findMiddleOfPair(input);

    return [new SNumber(input.slice(0, pairSeparationIndex)), new SNumber(input.slice(pairSeparationIndex + 1))];
}

function findMiddleOfPair(input) {
    // left part is a value
    if (!input.startsWith('[')) {
        return input.indexOf(',');
    } 
    // Left part is a pair
    else {
        let numOfParantheses = 1;
        for (var i = 1; i < input.length; i++) {
            if (input[i] === '[') {
                numOfParantheses ++;
            } else if (input[i] === ']') {
                numOfParantheses --;
            }

            if (numOfParantheses === 0) {
                return i + 1;
            }
        }
    }
}

fs.readFile('E:/workspace/advent-of-code/2021/day18/test-input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    let dataPoints = data.split('\r\n');

    let n1 = new SNumber(dataPoints[0]);
    let n2 = new SNumber(dataPoints[0]);

    console.log(`Before reduce: ${n2.printSNum()}`);

    reduceSNumber(n1, 0);

    console.log(`After reduce: ${n2.printSNum()}`);

    console.log(`Solution for Part One: ${dataPoints}`)
    console.log(`Solution for Part Two: ${n2.printSNum()}`);
});
