#!/usr/bin/env node
var usage = [
    'Usage: setup [-h][-d]',
    '   -h - help',
    '   -d - dry run',
    'Modifies package.json and bower.json to have correct dependencies',
    '   and copies the src folder and broccoli support files'
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
function copyFile(fromFilepath, toFilepath) {
    fs.writeFileSync(toFilepath, fs.readFileSync(fromFilepath, 'utf-8'));
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
    console.log("Would copy the src directory, Brocfile.js, and start.js")
    done();
} else {
    console.log("writing host files");
    writeJsonToFile(hostProjectRoot, 'package.json', hostPackageJson);
    console.log("..wrote package.json");
    writeJsonToFile(hostProjectRoot, 'bower.json', hostBowerJson);
    console.log("..wrote bower.json");

    // Now the broccoli-related files
    copyFile(
        path.join(projectRoot, 'Brocfile.js'),
        path.join(hostProjectRoot, 'Brocfile.js'));
    console.log("..wrote Brocfile.js");
    
    // the start.js only gets copied if it doesn't exist, since that's 
    // what's used to configure the build process
    var buildWrapperPath = path.join(hostProjectRoot, 'start.js');
    var buildWrapperExists = fs.existsSync(buildWrapperPath);
    if (!buildWrapperExists) {
        copyFile(
            path.join(projectRoot, 'start.js'),
            buildWrapperPath);
        console.log("..wrote start.js");
    }
    ncp(path.join(projectRoot, 'src'), path.join(hostProjectRoot, 'src'), function (error) {
        if (error) return done(error);
        console.log("..copied src directory");
        done();
    })
}

function done(error) {
    if (error) console.error(error);
    console.log("Done");
    process.exit((error) ? 1 : 0);
}
