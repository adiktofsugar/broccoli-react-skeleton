#!/usr/bin/env node
var path = require('path');
var projectRoot = path.resolve(__dirname);
var startEngine = require('start-engine');

var media = startEngine.MyProcess(
    'broccoli-build.js',
    {
        args: ["dist"],
        uid: "media",
        max: 1,
        watch: false,
        cwd: projectRoot
    },
    {
        color: chalk.yellow
    });

startEngine.run([media]);
