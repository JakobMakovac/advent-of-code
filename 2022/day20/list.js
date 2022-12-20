class LinkedList {
    constructor() {
        this.listIndex = 0;
        this.start;
        this.last;
        this.queue = [];
    }

    circularize() {
        this.start['previous'] = this.last;
        this.last['next'] = this.start;
    }

    addNode(value) {
        const node = {value, index: this.listIndex};
        if (!this.start) {
            this.start = node;
            this.last = node;
        } else {            
            this.last['next'] = node;
            node['previous'] = this.last;
            this.last = node;
        }
        this.listIndex ++;
    }

    findNodeAtOriginalIndex(index) {
        var currentNode = this.start;

        while (currentNode.index !== index) {
            currentNode = currentNode.next;
        }

        return currentNode;
    }

    moveNode(node, places, forward = true) {
        if (places === 0) {
            return;
        }

        for (var i = 0; i < places; i++) {
            if (forward) {
                this.moveForward(node);
            } else {
                this.moveBackward(ndoe);
            }
        }
    }

    moveForward(node) {
        if (node.index === this.start.index) {
            this.start = node.next;
        } else if (node.index === this.last.index) {
            this.start = node;
            this.last = node.next;
        } else if (node.next.index === this.last.index) {
            this.last = node;
        }

        node.previous.next = node.next;
        node.next.previous = node.previous;
        node.next.next = node;
        node.previous = node.next;
        node.next = node.next.next;
    }

    moveBackward(node) {
        if (node.index === this.start.index) {
            this.start = node.previous;
            this.last = node;
        } else if (node.index === this.last.index) {
            this.last = node.previous;
        } else if (node.previous.index === this.start.index) {
            this.start = node;
        }

        node.previous.next = node.next;
        node.next.previous = node.previous;
        node.previous.previous = node;
        node.next = node.previous;
        node.previous = node.previous.previous;
    }
}

exports.LinkedList = LinkedList;
