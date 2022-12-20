const FileReader = require('../common/file-reader');

const args = process.argv.slice(2);
const isTesting = args && args.length > 0 && args[0] === '-t';
const inputFile = isTesting ? './test-input.txt' : './input.txt';

const data = FileReader.readFile(inputFile, FileReader.ReadMode.Characters);
var visibleCount = 0;
var maxScenicScore = 0;

for (var i = 0;  i < data.length; i++) {
    for (var j = 0; j < data[i].length; j++) {
        var leftDist, rightDist, topDist, bottomDist;
        leftDist = rightDist = topDist = bottomDist = 0;

        var isVisible = false;
        // Is on edge
        if (i === 0 || j === 0 || i === data.length || j === data[i].length) {
            isVisible = true;
            visibleCount ++;
            continue;
        }

        var isVisible = true;
        // Look left
        for (var x = j - 1; x >= 0; x--) {
            if (data[i][x] >= data[i][j]) {
                isVisible = false;
                leftDist ++;
                break;
            }
            leftDist ++;
        }

        if (isVisible) {
            visibleCount ++;
        }

        var isVisible = true;
        // Look right
        for (var x = j + 1; x < data[i].length; x++) {
            if (data[i][x] >= data[i][j]) {
                isVisible = false;
                rightDist ++;
                break;
            }
            rightDist ++;
        }

        if (isVisible) {
            visibleCount ++;
        }

        var isVisible = true;
        // Look up
        for (var x = i - 1; x >= 0; x--) {
            if (data[x][j] >= data[i][j]) {
                isVisible = false;
                topDist ++;
                break;
            }
            topDist ++;
        }

        if (isVisible) {
            visibleCount ++;
        }

        var isVisible = true;
        // Look down
        for (var x = i + 1; x < data.length; x++) {
            if (data[x][j] >= data[i][j]) {
                isVisible = false;
                bottomDist ++;
                break;
            }
            bottomDist ++;
        }

        if (isVisible) {
            visibleCount ++;
        }

        var newScenicScore = leftDist * rightDist * topDist * bottomDist;
        maxScenicScore = newScenicScore > maxScenicScore ? newScenicScore : maxScenicScore;
    }
}

console.log(visibleCount);
console.log(maxScenicScore);
