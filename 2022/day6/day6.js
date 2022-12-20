const FileReader = require('../common/file-reader');

const args = process.argv.slice(2);
const isTesting = args && args.length > 0 && args[0] === '-t';
const inputFile = isTesting ? './test-input.txt' : './input.txt';

const data = FileReader.readFile(inputFile, FileReader.ReadMode.Rows);

data.forEach(line => {
    const charCounts = {

    }
    var slidingWindowWidth = 0;
    var hasDuplicates = false;
    
    for (var i = 0; i < line.length; i++) {
        const nextChar = line[i];
        
        if (slidingWindowWidth < 14)  {
            if (!charCounts[nextChar]) {
                charCounts[nextChar] = 1;
            } else {
                charCounts[nextChar] ++;
            }
            slidingWindowWidth ++;
        } else {
            if (!charCounts[nextChar]) {
                charCounts[nextChar] = 1;
            } else {
                charCounts[nextChar] ++;
            }
            const charToRemove = line[i - 14];
            charCounts[charToRemove] --;

            Object.values(charCounts).map((val) => {
                if (val > 1) {
                    hasDuplicates = true;
                }
            })

            if (!hasDuplicates) {
                console.log(`Start of packet: ${i + 1}`);
                return;
            }

            hasDuplicates = false;
        }
    }
});
