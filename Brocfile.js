var path = require('path');
var babel = require('broccoli-babel-transpiler');
var mergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');

var index = new Funnel('app', {
    include: ['index.html']
});

var js = babel('app/js', {
    modules: "amd",
    moduleIds: true
});
function funnelForFile(filepath, outputFilename) {
    var relativeFilepath = path.relative(__dirname, filepath);
    return new Funnel(path.dirname(relativeFilepath), {
        files: [path.basename(relativeFilepath)],
        getDestinationPath: function (relativePath) {
            return outputFilename;
        }
    });
}
var vendor = mergeTrees([
    funnelForFile('bower_components/jquery/dist/jquery.min.js', 'jquery.js'),
    funnelForFile('bower_components/require/index.js', 'require.js'),
    funnelForFile(require.resolve('react/dist/react'), 'react.js'),
    funnelForFile(require.resolve('react-dom/dist/react-dom'), 'react-dom.js')
]);
module.exports = mergeTrees([index, js, vendor]);
