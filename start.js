#!/usr/bin/env node
var path = require('path');
var projectRoot = path.resolve(__dirname);
var startEngine = require('start-engine');

var media = startEngine.MyProcess(
    require.resolve('broccoli-watch'),
    {
        args: ["dist"],
        uid: "media",
        max: 1,
        watch: false,
        cwd: projectRoot
    },
    {
        color(header) {
            // here you'd use chalk.yellow or something
            return header;
        }
    });

startEngine.run([media]);
