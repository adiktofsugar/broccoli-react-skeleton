#!/usr/bin/env node
var usage = [
    'Usage: setup [-h][-d]',
    '   -h - help',
    '   -d - dry run',
    'Modifies package.json to have correct dependencies',
    '   sets up folder and file structure, and',
    '   modifies bower.json to have correct dependencies, or creates'
].join("\n");

var args = require('minimist')(process.argv.slice(2), {
    boolean: ['help', 'dryRun'],
    alias: {
        'h': 'help',
        'd': 'dryRun'
    }
});
var fs = require('fs');
var path = require('path');
var ncp = require('ncp');

var dryRun = args.dryRun || false;
if (args.help) {
    console.log(usage);
    process.exit();
}

var hostProjectRoot = process.cwd();
while (!fs.existsSync(path.join(hostProjectRoot, 'package.json'))) {
    hostProjectRoot = path.join(hostProjectRoot, '..');
}
console.log('Using project root ' + hostProjectRoot);

var projectRoot = path.join(__dirname, '..');
function readJsonFromFile(root, filepath) {
    var string = fs.readFileSync(path.join(root, filepath), 'utf-8');
    return JSON.parse(string);
}
function writeJsonToFile(root, filepath, json) {
    var string = JSON.stringify(json, null, 4);
    fs.writeFileSync(path.join(root, filepath), string);
}
var packageJson = readJsonFromFile(projectRoot, 'package.json');
var bowerJson = readJsonFromFile(projectRoot, 'bower.json');
var hostPackageJson = readJsonFromFile(hostProjectRoot, 'package.json');
var hostBowerExists = fs.existsSync(path.join(hostProjectRoot, 'bower.json'));
var hostBowerJson = hostBowerExists && readJsonFromFile(hostProjectRoot, 'bower.json');

if (!hostBowerJson) {
    hostBowerJson = {
        "name": hostPackageJson.name,
        "authors": [hostPackageJson.author],
        "license": hostPackageJson.license || "ISC",
        "private": true,
        dependencies: {}
    }
}

if (!hostPackageJson.devDependencies) hostPackageJson.devDependencies = {};
if (!hostBowerJson.dependencies) hostBowerJson.dependencies = {};

var dependencyName;
var dependencyVersion;
for (dependencyName in packageJson.devDependencies) {
    dependencyVersion = packageJson.devDependencies[dependencyName];
    hostPackageJson.devDependencies[dependencyName] = dependencyVersion;
}
for (dependencyName in bowerJson.dependencies) {
    dependencyVersion = bowerJson.dependencies[dependencyName];
    hostBowerJson.dependencies[dependencyName] = dependencyVersion;
}



if (dryRun) {
    console.log("Would write package.json as follows");
    console.log(JSON.stringify(hostPackageJson, null, 4));
    console.log("Would write bower.json as follows");
    console.log(JSON.stringify(hostBowerJson, null, 4));
    console.log("Would copy the app directory and Brocfile.js")
    done();
} else {
    console.log("writing host files");
    writeJsonToFile(hostProjectRoot, 'package.json', hostPackageJson);
    console.log("..wrote package.json");
    writeJsonToFile(hostProjectRoot, 'bower.json', hostBowerJson);
    console.log("..wrote bower.json");
    fs.writeFileSync(
        path.join(hostProjectRoot, 'Brocfile.js'),
        fs.readFileSync(path.join(projectRoot, 'Brocfile.js'), 'utf-8')
    );
    console.log("..wrote Brocfile.js");
    ncp(path.join(projectRoot, 'app'), path.join(hostProjectRoot, 'app'), function (error) {
        if (error) return done(error);
        console.log("..copied app directory");
        done();
    })
}

function done(error) {
    if (error) console.error(error);
    console.log("Done");
    process.exit((error) ? 1 : 0);
}
