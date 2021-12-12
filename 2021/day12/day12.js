const fs = require('fs');

class Graph {
    constructor(connectionMap) {
        this.nodes = {};
        this.constructGraph(connectionMap);
        this.validPaths = [];
    }

    constructGraph(map) {
        for (const line of map) {
            let startNodeValue = line.split('-')[0];
            let endNodeValue = line.split('-')[1];

            if (this.nodes[startNodeValue]) {
                this.nodes[startNodeValue].addNeighbour(endNodeValue);
            } else {
                this.nodes[startNodeValue] = new Node(startNodeValue, endNodeValue);
            }

            if (this.nodes[endNodeValue]) {
                this.nodes[endNodeValue].addNeighbour(startNodeValue);
            } else {
                this.nodes[endNodeValue] = new Node(endNodeValue, startNodeValue);
            }
        }
    }

    findAllPaths() {
        let activePaths = [new Path(this.nodes['start'])];
        
        while (activePaths.length > 0) {
            let currentPath = activePaths.pop();
            let nextNodes = currentPath.getNextNodes();

            for (const node of [...nextNodes]) {
                let _path = new Path(undefined, currentPath);
                _path.addNode(this.nodes[node]);

                if (_path.isValid) {
                    if (_path.isCompleted) {
                        this.validPaths.push(_path);
                    } else {
                        activePaths.push(_path);
                    }
                }
            }
        }
    }

    printAllPaths() {
        for (const path of this.validPaths) {
            path.printPath();
        }
    }

    getNumberOfValidPaths() {
        return this.validPaths.length;
    }
}

class Node {
    constructor(value, neighbour) {
        this.value = value;
        this.neighbours = new Set();
        this.addNeighbour(neighbour);
    }

    addNeighbour(node) {
        if (node !== 'start') {
            this.neighbours.add(node);
        }
    }

    getValue() {
        return this.value;
    }
}

class Path {
    constructor(node, _path = undefined) {
        if (_path) {
            this.visitedSmallCaves = new Set(_path.visitedSmallCaves);
            this.nodes = [..._path.nodes];
            this.isValid = _path.isValid;
            this.hasVisitedSmallCaveTwice = _path.hasVisitedSmallCaveTwice;
            this.isCompleted = _path.isCompleted;
        } else {
            this.visitedSmallCaves = new Set();
            this.nodes = [node];
            this.isValid = true;
            this.isCompleted = false;
            this.hasVisitedSmallCaveTwice = false;
        }
    }

    addNode(node) {
        if (this.visitedSmallCaves.has(node.value)) {
            if (this.hasVisitedSmallCaveTwice) {
                this.isValid = false;
                return;
            } else {
                this.hasVisitedSmallCaveTwice = true;
            }
        }

        this.nodes.push(node);

        if (node.getValue() === 'end') {
            this.isCompleted = true;
            return;
        }

        if (node.getValue() === node.getValue().toLowerCase()
            && node.getValue() !== 'start' && node.getValue() !== 'end') 
        {
            this.visitedSmallCaves.add(node.getValue());
        }
    }

    getNextNodes() {
        return this.nodes[this.nodes.length - 1].neighbours;
    }

    printPath() {
        let formattedPath = this.nodes.map((n) => n.getValue()).join(',');
        console.log(formattedPath);
    }
}

fs.readFile('./input.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    let lines = data.split('\r\n');
    let g = new Graph(lines);
    g.findAllPaths();

    console.log(`Solution for Part Two: ${g.getNumberOfValidPaths()}`);
});
