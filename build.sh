#!/bin/bash
cwd="$(cd `dirname ${BASH_SOURCE[0]}`; pwd)"
node "$cwd/broccoli-build.js" "dist"
