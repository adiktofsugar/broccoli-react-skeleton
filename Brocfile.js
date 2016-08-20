var path = require('path');
var babel = require('broccoli-babel-transpiler');
var mergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');
var ESLinter = require('broccoli-eslint-alt');
var writeFile = require('broccoli-file-creator');

var index = new Funnel('src', {
    include: ['index.html']
});

var js = new Funnel('src/js');
js = new ESLinter(js);
js = babel(js, {
    modules: "amd",
    moduleIds: true,
    sourceMaps: 'inline'
});
js = new Funnel(js, {
    destDir: 'js'
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
var bootstrap = new Funnel('bower_components/bootstrap/dist', {
    destDir: 'bootstrap'
});
var vendor = mergeTrees([
    bootstrap,
    funnelForFile('bower_components/jquery/dist/jquery.min.js', 'jquery.js'),
    funnelForFile('bower_components/require/index.js', 'require.js'),
    funnelForFile(require.resolve('react/dist/react'), 'react.js'),
    funnelForFile(require.resolve('react-dom/dist/react-dom'), 'react-dom.js')
]);
vendor = new Funnel(vendor, {
    destDir: 'vendor'
});

var requireConfigString = 'window.require = ' +
    JSON.stringify({
        shim: {
            "bootstrap": ["jquery"],
        },
        paths: {
            "bootstrap": "/media/vendor/bootstrap/js/bootstrap.min",
            "jquery": "/media/vendor/jquery",
            "react": "/media/vendor/react",
            "react-dom": "/media/vendor/react-dom"
        }
    }, null, 4);
var requireConfig = writeFile('/js/require-config.js', requireConfigString);

module.exports = mergeTrees([index, js, vendor, requireConfig]);
