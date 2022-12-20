class Graph {
    constructor() {
        this.nodes = {};
        this.edges = new Map();
        this.startNodes = {};
    }

    setStartNode(nodeName) {
        this.startNodes[nodeName] = {
            ...this.nodes[nodeName],
            penalty: 0
        };
    }

    addNode(key, value) {
        this.nodes[key] = {key, value};
    }

    removeNode(key) {
        const node = this.nodes[key];
        for (const {from, to} of this.edges.values()) {
            if (from === node.key) {
                this.removeEdge(from, to);
            }
        }
        delete this.nodes[key];
    }

    addEdge(from, to, weight) {
        this.edges.set(JSON.stringify([from, to]), {from, to, weight});
        this.edges.set(JSON.stringify([to, from]), {from: to, to: from, weight});
    }

    removeEdge(from, to) {
        this.edges.delete(JSON.stringify([from, to]));
        this.edges.delete(JSON.stringify([to, from]));
    }

    getEdgeWeight(from, to) {
        return this.edges.get(JSON.stringify([from, to])).weight;
    }

    findNode(key) {
        return this.nodes[key];
    }

    findStartNodes() {
        return Object.values(this.startNodes);
    }

    findAdjacentNodes(key) {
        return [...this.edges.values()].reduce((acc, {from, to}) => {
            if (key === from) {
                acc.push(to);
            }
            return acc;
        }, []);
    }

    simplify() {
        // Delete nodes with 0 values and adjust edges
        for (const {key, value} of Object.values(this.nodes)) {
            if (value > 0) {
                continue;
            }

            const adjacent = this.findAdjacentNodes(key);
            const weightsByNode = adjacent.reduce((acc, adjacentNode) => {
                return {
                    ...acc,
                    [adjacentNode]: this.getEdgeWeight(key, adjacentNode)
                };
            }, {});

            // if one of removed nodes is a possible start node, add adjacent instead and increase start penalty
            if (this.startNodes[key]) {
                for (const adjacentKey of adjacent.filter((a) => !this.startNodes[a])) {
                    const currentPenalty = this.startNodes[key].penalty;
                    this.startNodes[adjacentKey] = {
                        ...this.nodes[adjacentKey],
                        penalty: currentPenalty + 1
                    };
                }
            }

            // Delete the node
            this.removeNode(key);
            delete this.startNodes[key];

            // Connect adjacent nodes among themselves
            for (var i = 0; i < adjacent.length - 1; i++) {
                for (var j = i + 1; j < adjacent.length; j++) {
                    this.addEdge(adjacent[i], adjacent[j], weightsByNode[adjacent[i]] + weightsByNode[adjacent[j]]);
                }
            }
        }
    }

    fullyConnect() {
        for (const node of Object.values(this.nodes)) {
            const paths = this.findPaths(node, node, 0, {});
            for (const path of paths) {
                const key = Object.keys(path)[0];
                const currentPath = this.edges.get(key);
                if (!currentPath || currentPath.weight > path[key]) {
                    this.edges.delete(key);
                    this.edges.set(key, path[key]);
                }
            }
        }
    }

    findPaths(node, origin, totalWeight, visited) {
        const isOrigin = node.key === origin.key;
        if (visited[node.key]) {
            return [{[JSON.stringify([origin.key, node.key])]: {from: origin.key, to: node.key, weight: totalWeight}}];
        }
        const adjacent = this.findAdjacentNodes(node.key).filter((adjNode) => adjNode !== node.key);
        var edges = [];
        if (!isOrigin) {
            edges.push({[JSON.stringify([origin.key, node.key])]: {from: origin.key, to: node.key, weight: totalWeight}});
        }
        for (const adjNode of adjacent) {
            edges = [...edges, ...this.findPaths(this.findNode(adjNode), origin, totalWeight + this.getEdgeWeight(node.key, adjNode), {...visited, [node.key]: 1})];
        }
        return edges;
    }
}

exports.Graph = Graph;
