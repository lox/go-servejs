var webpack = require('webpack');

module.exports = {
    entry: {
        hello: "./examples/hello.js",
    },
    output: {
        path: __dirname + "/build",
        filename: "[name].js",
        chunkFilename: "[id].js"
    },
    externals: {
        "fs": "NodeFs",
        "net": "NodeNet",
    },
    module: {
        loaders: [
            { test: /\.json$/, loader: 'json-loader' },
        ]
    },
};
