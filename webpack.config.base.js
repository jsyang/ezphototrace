const path            = require('path');
const webpack         = require('webpack');
const {CheckerPlugin} = require('awesome-typescript-loader');

const isProd = process.env.NODE_ENV === 'production';

const plugins = [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new CheckerPlugin()
];

const EXPORTS = {
    cache:   true,

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

if(isProd) {
    EXPORTS.devtool = 'hidden-source-map';
} else {
    EXPORTS.devtool = 'inline-eval-cheap-source-map';
}

module.exports = EXPORTS;