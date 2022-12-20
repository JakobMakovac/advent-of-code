const FileReader = require('../common/file-reader');
const { Graph } = require('./graph');

const args = process.argv.slice(2);
const isTesting = args && args.length > 0 && args[0] === '-t';
const inputFile = isTesting ? './test-input.txt' : './input.txt';

const startNode = 'AA';
const timeLimit = 30;

const graph = new Graph();

const data = FileReader.readFile(inputFile, FileReader.ReadMode.Rows);

for (const line of data) {
    const nodeInfo = line.split(';')[0].replace('Valve ', '');
    const regex = new RegExp(/\b[A-Z]+\b/g);
    const neighbours = line.split(';')[1].match(regex); 
    const name = nodeInfo.slice(0,2);
    const flowRate = parseInt(nodeInfo.split('=')[1]);
    
    graph.addNode(name, flowRate);
    for (const neighbour of neighbours) {
        graph.addEdge(name, neighbour, 1);
    }
}

graph.setStartNode(startNode);
// We'll remove 0 value nodes and make a fully connected graph to simplify search
graph.simplify();
graph.fullyConnect();

var bestSum = 0;
// Search the tree
for (const startNode of graph.findStartNodes()) {
    var timeLeft = timeLimit - startNode.penalty;
    const sum = search(startNode, timeLeft, 0, 0, {});
    bestSum = Math.max(bestSum, sum);
}
console.log(bestSum);

function search(node, time, valveTotal, total, openNodes) {
    if (time < 1) {
        return total - (valveTotal * (0 - time));
    }

    if (Object.values(graph.nodes).length === Object.values(openNodes).length) {
        return total + (valveTotal * time);
    }

    var paths = [];
    const adjacent = graph.findAdjacentNodes(node.key);

    for (const adjNode of adjacent) {
        var timeDelta = 0;
        const nextNode = graph.findNode(adjNode);
        const pathDuration = graph.getEdgeWeight(node.key, nextNode.key);

        if (!openNodes[node.key]) {
            // Open the valve and move to the next node
            timeDelta = timeDelta + 1 + pathDuration;
            const newValveTotal = valveTotal + node.value;
            const newTotal = total + valveTotal + (pathDuration * newValveTotal);
            paths.push(search.bind(this, nextNode, time - timeDelta, newValveTotal, newTotal, {...openNodes, [node.key]: 1}));
        }

        // Move to the next one without opening the valve
        timeDelta = pathDuration;
        const newTotal = total + (valveTotal * pathDuration);
        paths.push(search.bind(this, nextNode, time - timeDelta, valveTotal, newTotal, {...openNodes}));
    }

    return Math.max(...paths.map((p) => p()));
}
