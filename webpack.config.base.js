const path               = require('path');
const webpack            = require('webpack');
const {CheckerPlugin} = require('awesome-typescript-loader');
const MinifyPlugin = require('babel-minify-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

const devtool = isProd ?
    'source-map' : 'inline-eval-cheap-source-map';

const plugins = [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new CheckerPlugin(),
    new MinifyPlugin({},{comments:false})
];

module.exports = {
    cache:   true,
    devtool: devtool,

    output: {
        path: path.resolve(__dirname,'dist')
    },

    resolve: {
        // Turn on for further performance improvements
        // https://webpack.js.org/configuration/resolve/#resolve-unsafecache
        unsafeCache: false,
        modules:     ['node_modules', 'src'],
        extensions:  [
            '.ts',
            '.tsx',
            '.js'
        ],
        alias:       {
            'react'    : 'preact-compat',
            'react-dom': 'preact-compat',
            'aphrodite': 'aphrodite/no-important'
        }
    },

    plugins: plugins,

    module: {
        rules: [
            {
                test:    /\.tsx?$/,
                include: path.join(__dirname, 'src'),
                exclude: /node_modules/,
                loader:  'awesome-typescript-loader'
            }
        ]
    },
    node: {
        fs: "empty"
    }
};