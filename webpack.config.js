var webpack = require('webpack');

module.exports = {
    entry: {
        hello: "./examples/hello.js",
        serve: "./index.js"
    },
    output: {
        path: __dirname + "/build",
        filename: "[name].js",
        chunkFilename: "[id].js"
    },
    module: {
        loaders: [
            { test: /\.json$/, loader: 'json-loader' },
        ]
    },
    resolve: {
        alias: {
            'go-servejs': __dirname + "/index.js",
            debug: __dirname + "/lib/debug.js",
            net: __dirname + "/lib/net.js",
            fs: __dirname + "/lib/fs.js"
        }
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({minimize: true})
    ],
    node: {
        console: false,
        process: true,
        global: true,
        Buffer: false,
        __filename: "/index.js",
        __dirname: "empty"
    }
};
