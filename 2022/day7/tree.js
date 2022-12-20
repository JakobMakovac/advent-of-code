class Tree {
    rootNode;
    currentNode;
    totalDiskSpace = 70000000;
    updateSpaceNeeded = 30000000;

    constructor() {
        const _rootNode = new TreeNode('/');
        this.rootNode = _rootNode;
        this.currentNode = _rootNode;
    }

    addNode(name) {
        const node = new TreeNode(name, this.currentNode);
        this.currentNode.addChildDir(node);
    }

    moveIntoDir(name) {
        if (this.currentNode.name ===  name && name === '/') {
            return;
        }

        this.currentNode = this.currentNode.getChild(name);
    }

    moveUp() {
        this.currentNode = this.currentNode.getParent();
    }

    addFiles(files) {
        const totalSize = files.reduce((acc, file) => {
            return acc + parseInt(file.size);
        }, 0);

        this.currentNode.addFiles(files, totalSize);
        this.addFileSizeToParents(totalSize);
    }

    addFileSizeToParents(totalSize) {
        var parent = this.currentNode.getParent();

        while (!!parent) {
            parent.addToSize(totalSize);
            parent = parent.getParent();
        }
    }

    addDirs(dirs) {
        dirs.forEach(dir => {
            this.addNode(dir);
        });
    }

    getUsedSpace() {
        return this.rootNode.dirSize;
    }

    getUnusedSpace() {
        return this.totalDiskSpace - this.rootNode.dirSize;
    }

    getSpaceNeededToUpdate() {
        return this.updateSpaceNeeded - this.getUnusedSpace();
    }

    treeIterator(lambda) {
        var nodesToSearch = [this.rootNode];
        const out = [];

        while (nodesToSearch.length > 0) {
            const nodeToSearch = nodesToSearch.pop();
            const children = nodeToSearch.getChildNodes();

            nodesToSearch = [...nodesToSearch, ...children];

            if (lambda(nodeToSearch)) {
                out.push(nodeToSearch);
            }
        }

       return out;
    }

    sumDirs() {
        return this.treeIterator((node) => node.dirSize < 100000).reduce((acc, node) => {
            return  acc + node.dirSize;
        }, 0);
    }

    findSmallestToDelete() {
        const cutoff = this.getSpaceNeededToUpdate();
        return this.treeIterator((node) => node.dirSize > cutoff).sort((a, b) => a.dirSize - b.dirSize)[0].dirSize;
    }
}

class TreeNode {
    constructor(name, parent) {
        this.name = name;
        this.files = [];
        this.dirSize = 0;
        this.childrenNodes = {};
        this.parentNode = parent;
    }

    addFiles(files, totalSize) {
        this.files = [...this.files, ...files];
        this.dirSize += totalSize;
    }

    addToSize(size) {
        this.dirSize += size;
    }

    addChildDir(childNode) {
        this.childrenNodes[childNode.name] = childNode;
    }

    getChild(name) {
        return this.childrenNodes[name];
    }

    getParent() {
        return this.parentNode;
    }

    getChildNodes() {
        return Object.values(this.childrenNodes);
    }
}

exports.Tree = Tree;