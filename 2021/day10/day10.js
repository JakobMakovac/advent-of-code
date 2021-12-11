const fs = require('fs');
const errorScoreBoard = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137
};
const incompleteScoreBoard = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4
};

function parseLine(line) {
    let stack = [];
    let errorScore = 0
    let completionScore = 0;

    for (const char of line) {
        switch (char) {
            case '(':
                stack.unshift(')');
                break;
            case '[':
                stack.unshift(']');
                break;
            case '{':
                stack.unshift('}');
                break;
            case '<':
                stack.unshift('>');
                break;
            case ')':
            case ']':
            case '}':
            case '>':
                let shouldBe = stack.shift();
                if (char != shouldBe) {
                    return {
                        errScore: errorScoreBoard[char],
                        compScore: 0
                    };
                }
                break;
        }
    }

    completionScore = stack.reduce((acc, next) => {
        return (5 * acc) + incompleteScoreBoard[next];
    }, 0);

    return {
        errScore: errorScore,
        compScore: completionScore
    };
}

fs.readFile('E:/workspace/advent-of-code/2021/day10/input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    let lines = data.split('\r\n');
    let errorScore = 0;
    let completionScores = [];

    for (const line of lines) {
        let scores = parseLine(line);
        errorScore += scores['errScore'];
        if (scores['compScore'] > 0) {
            completionScores.push(scores['compScore']);
        }
    }

    let sortedCompletionScores = completionScores.sort((a, b) => {
        return (+b) - (+a);
    });

    console.log(`Solution for Part One: ${errorScore}`);
    console.log(`Solution for Part Two: ${sortedCompletionScores[parseInt(sortedCompletionScores.length / 2)]}`);
});