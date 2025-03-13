const fs = require('fs');
const deepDiff = require('deep-diff');

function loadJson(filepath) {
    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

function compareJson(oldFile, newFile) {
    const oldData = loadJson(oldFile);
    const newData = loadJson(newFile);
    
    const diff = deepDiff.diff(oldData, newData);
    return diff;
}

function checkJsonSize(filepath) {
    const stats = fs.statSync(filepath);
    return stats.size;
}

function printDifferences(differences) {
    const rows = differences.map(d => {
        return {
            kind: d.kind,
            path: d.path.join('.'),
            oldValue: JSON.stringify(d.lhs),
            newValue: JSON.stringify(d.rhs)
        };
    });
    console.table(rows);
}

function main() {
    const oldFile = '/home/tejus/Documents/JSON/old_sorted.json';
    const newFile = '/home/tejus/Documents/JSON/new_sorted.json';
    
    const oldSize = checkJsonSize(oldFile);
    const newSize = checkJsonSize(newFile);
    
    console.log(`Size of ${oldFile}: ${oldSize} bytes`);
    console.log(`Size of ${newFile}: ${newSize} bytes`);
    
    const differences = compareJson(oldFile, newFile);
    
    console.log("Differences between old.json and new.json:");
    printDifferences(differences);
}

main();