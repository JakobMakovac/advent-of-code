const fs = require('fs');

class OperatorPacket {
    constructor(packet) {
        this.version = parseInt(packet.slice(0, 3), 2);
        this.id = parseInt(packet.slice(3,6), 2);
        this.lenTypeId = packet.slice(6,7);
        this.bitLength = 7;
        this.subpackets = [];
        this.parseBits(packet.slice(7));
    }

    parseBits(payload) {
        if (this.lenTypeId === '1') {
            let numberOfPackets = parseInt(payload.slice(0, 11), 2);
            this.bitLength += 11;
            this.subpackets = readNPackets(payload.slice(11), [], numberOfPackets);
        } else {
            let lengthOfPackets = parseInt(payload.slice(0, 15), 2);
            this.bitLength += 15;
            this.subpackets = readNbitsAsPackets(payload.slice(15), [], lengthOfPackets);
        }

        this.bitLength += this.subpackets.reduce((prev, current) => {
            return prev + current.bitLength;
        }, 0);
    }

    getVersionSum() {
        return this.version + this.subpackets.reduce((prev, current) => {
            return prev + current.getVersionSum();
        }, 0);
    }

    evaluate() {
        var aggFunc;
        var initValue;
        switch (this.id) {
            case 0:
                aggFunc = (a, b) => a + b.evaluate();
                initValue = 0;
                break;
            case 1:
                aggFunc = (a, b) => a * b.evaluate();
                initValue = 1;
                break;
            case 2:
                aggFunc = (a, b) => {
                    let _b = b.evaluate();
                    return a < _b ? a : _b;
                }
                break;
            case 3:
                aggFunc = (a, b) => {
                    let _b = b.evaluate();
                    return a > _b ? a : _b;
                }
                break;
            case 5:
                return this.subpackets[0].evaluate() > this.subpackets[1].evaluate() ? 1 : 0;
            case 6:
                return this.subpackets[0].evaluate() < this.subpackets[1].evaluate() ? 1 : 0;
            case 7:
                return this.subpackets[0].evaluate() === this.subpackets[1].evaluate() ? 1 : 0;
        }

        return this.subpackets.reduce(aggFunc, initValue);
    }
}

class ValuePacket {
    constructor(version, id, payload) {
        this.version = version;
        this.id = id;
        this.value = undefined;
        this.bitLength = 6;
        this.parseBits(payload);
    }

    parseBits(bits) {
        let currentIndex = 0;
        let firstBit;
        let value = '';
        
        do {
            firstBit = bits[currentIndex];
            currentIndex ++;
            value += bits.slice(currentIndex, currentIndex + 4);
            currentIndex += 4;
        } while (firstBit !== '0');

        this.value = parseInt(value, 2);
        this.bitLength += currentIndex;
    }

    getVersionSum() {
        return this.version;
    }

    evaluate() {
        return this.value;
    }
}

function toBinary(hex) {
    return hex.split('').map((i) => parseInt(i, 16).toString(2).padStart(4, '0')).join('');
}

function parsePackets(packet) {
    let header = packet.slice(0, 6);
    let version = parseInt(header.slice(0, 3), 2);
    let typeId = parseInt(header.slice(3,6), 2);

    if (typeId === 4) {
        return [new ValuePacket(version, typeId, packet.slice(6))];
    } else {
        return [new OperatorPacket(packet)];
    }
}

function readNPackets(bits, aggregator, n) {
    if (n === 0 || bits.length < 5) {
        return aggregator;
    }

    let header = bits.slice(0, 6);
    let version = parseInt(header.slice(0, 3), 2);
    let typeId = parseInt(header.slice(3,6), 2);

    if (typeId === 4) {
        let _packet = new ValuePacket(version, typeId, bits.slice(6));
        return readNPackets(bits.slice(_packet.bitLength), [...aggregator, _packet], --n);
    } else {
        let _packet = new OperatorPacket(bits);
        return readNPackets(bits.slice(_packet.bitLength), [...aggregator, _packet], --n);
    }
}

function readNbitsAsPackets(bits, aggregator, l) {
    if (l === 0 || bits.length < 5) {
        return aggregator;
    }

    let header = bits.slice(0, 6);
    let version = parseInt(header.slice(0, 3), 2);
    let typeId = parseInt(header.slice(3,6), 2);

    if (typeId === 4) {
        let _packet = new ValuePacket(version, typeId, bits.slice(6));
        return readNbitsAsPackets(bits.slice(_packet.bitLength), [...aggregator, _packet], l - _packet.bitLength);
    } else {
        let _packet = new OperatorPacket(bits);
        return readNbitsAsPackets(bits.slice(_packet.bitLength), [...aggregator, _packet], l - _packet.bitLength);
    }
}

fs.readFile('./input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    let lines = data.split('\r\n');
    let packet = toBinary(lines[0]);

    let packets = parsePackets(packet);

    var versionSum = packets.reduce((prev, current) => {
        return prev + current.getVersionSum();
    }, 0);

    var expressionValue = packets.reduce((prev, current) => {
        return prev + current.evaluate();
    }, 0);

    console.log(`Solution for Part One: ${versionSum}`);
    console.log(`Solution for Part Two: ${expressionValue}`);
});