class Monkey {
    constructor() {
        this.items = [];
        this.inspections = 0;
    }

    setStartingItems(items) {
        this.items = items;
    }

    setOperation(lambda) {
        this.operation = lambda;
    }

    setTest(lambda) {
        this.test = lambda;
    }

    addItem(item) {
        this.items.push(item);
    }

    getNextItem() {
        this.inspections ++;
        return this.items.shift();
    }
}

exports.Monkey = Monkey;