#!/usr/bin/env node
var usage = [
    'Usage: setup [-h] <name>',
    '   -h - help',
    '   name - name of your project',
    'Changes package.json and bower.json to name specified'
].join("\n");

var args = process.argv.slice(2);
var name = args[0];
if (name == '-h' || name == 'help') {
    console.log(usage);
    process.exit();
}
if (!name) {
    console.error("Name is required");
    console.log(usage);
    process.exit(1);
}

var fs = require('fs');
var path = require('path');

function readJsonFromFile(filepath) {
    var string = fs.readFileSync(path.join(projectRoot, filepath), 'utf-8');
    return JSON.parse(string);
}
function writeJsonToFile(json, filepath) {
    var string = JSON.stringify(json, null, 4);
    fs.writeFileSync(string, filepath);
}
var projectRoot = path.join(__dirname, '..');

var packageJson = readJsonFromFile('package.json');
packageJson.name = name;
writeJsonToFile(packageJson, 'package.json');
console.log("Changed name field in package.json");

var bowerJson = readJsonFromFile('bower.json');
bowerJson.name = name;
writeJsonToFile(bowerJson, 'bower.json');
console.log("Changed name field in bower.json");

console.log("Done");
