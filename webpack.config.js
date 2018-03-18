// const MinifyPlugin = require("babel-minify-webpack-plugin");

const webpack = require('webpack');

module.exports = {
    entry: __dirname + '/src/app.js',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js',
    },
    plugins: [
        new webpack.ProvidePlugin({
            'THREE': 'three'
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    query: {
                        presets: [['env', { "targets": { "chrome": 63 } }]]
                    },
                }
            }
        ]
    },
    resolve: {
        alias: {
            'three/OrbitControls': __dirname + '/node_modules/three/examples/js/controls/OrbitControls.js'
        }
    }
};
