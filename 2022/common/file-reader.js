const fs = require('fs');

const ReadMode = {
    Rows: 'rows',
    Characters: 'characters'
}

function readFile(filePath, readMode) {
    try {
        const rawData = fs.readFileSync(filePath, 'utf8');
        if (readMode === ReadMode.Rows) {
            return rawData.split('\r\n');
        } else if (readMode === ReadMode.Characters) {
            return rawData.split('\r\n').map((line) => {
                return line.split('');
            });
        }
    } catch (error) {
        console.log(`Could not read file: ${filePath}. Error: ${error}`);
        return '';
    }
}

function writeFile(content) {
    try {
        fs.writeFileSync('./out.txt', content);
    } catch (err) {
        console.error(err);
    }
}

exports.readFile = readFile;
exports.writeFile = writeFile;
exports.ReadMode = ReadMode;