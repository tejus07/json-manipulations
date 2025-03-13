const fs = require('fs');
const deepDiff = require('deep-diff');

function loadJson(filepath) {
    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

function sortKeys(obj) {
    if (Array.isArray(obj)) {
        return obj.map(sortKeys);
    } else if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).sort().reduce((result, key) => {
            result[key] = sortKeys(obj[key]);
            return result;
        }, {});
    }
    return obj;
}

function saveJson(filepath, data) {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 4), 'utf8');
}

function compareJson(oldFile, newFile) {
    const oldData = loadJson(oldFile);
    const newData = loadJson(newFile);
    const diff = deepDiff.diff(oldData, newData);
    return diff;
}

function main() {
    const oldFile = '/home/tejus/Documents/JSON/old.json';
    const newFile = '/home/tejus/Documents/JSON/new.json';
    const oldSortedFile = '/home/tejus/Documents/JSON/old_sorted.json';
    const newSortedFile = '/home/tejus/Documents/JSON/new_sorted.json';
    
    // Sort old.json
    const oldData = loadJson(oldFile);
    const sortedOld = sortKeys(oldData);
    fs.writeFileSync(oldSortedFile, JSON.stringify(sortedOld, null, 4));

    // Sort new.json
    const newData = loadJson(newFile);
    const sortedNew = sortKeys(newData);
    fs.writeFileSync(newSortedFile, JSON.stringify(sortedNew, null, 4));
    compareBothJson();
}

function compareBothJson(){
    // Compare sorted files
    const oldFile = '/home/tejus/Documents/JSON/old_sorted.json';
    const newFile = '/home/tejus/Documents/JSON/new_sorted.json';
    const differences = compareJson(oldFile, newFile);
    
    console.log("Differences between old.json and new.json:");
    differences.forEach(diff => {
        switch (diff.kind) {
            case 'N':
                console.log(`New property added at ${diff.path.join('.')}: ${JSON.stringify(diff.rhs)}`);
                break;
            case 'D':
                // console.log(`Property deleted at ${diff.path.join('.')}: ${JSON.stringify(diff.lhs)}`);
                break;
            case 'E':
                console.log(`Property edited at ${diff.path.join('.')}: from ${JSON.stringify(diff.lhs)} to ${JSON.stringify(diff.rhs)}`);
                break;
            case 'A':
                console.log(`Array change at ${diff.path.join('.')}: ${JSON.stringify(diff.item)}`);
                break;
        }
    });
}


main();