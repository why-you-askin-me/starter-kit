import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import autoprefixer from 'autoprefixer'
import webpack from 'webpack'
import path from 'path'

// Hack for Ubuntu on Windows: interface enumeration fails with EINVAL, so return empty.
try       { require('os').networkInterfaces(); }
catch (e) { require('os').networkInterfaces = () => ({}); }

const browsers = ['last 2 versions', 'ie >= 10']

const res = path.resolve(__dirname, 'res')
const src = path.resolve(__dirname, 'src')
const build = path.resolve(__dirname, 'build')

const loaders = [
    {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/,
    },
    {
        test: /\.styl$/,
        loaders: ['style', 'css', 'postcss', 'stylus'],
    },
    {
        test: /\.(jpg|jpeg|png|svg)$/,
        loaders: ['file', 'image-webpack'],
    },
    {
        test: /\.json$/,
        loader: 'json',
    },
]

const prodPlugins = [
    new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false }
    }),
]

const plugins = [
    new HtmlWebpackPlugin({
        template: src + '/index.html',
    }),
    new CopyWebpackPlugin([
        { to: build, from: res },
    ]),
    new webpack.DefinePlugin({
        NODE_ENV: process.env.NODE_ENV,
    }),
]
// Merge with production plugins if needed
.concat(process.env.NODE_ENV === 'production' ? prodPlugins : [])

const resolve = {
    extensions: ['', '.js', '.jsx', '.styl'],
}

const config = {
    entry: src + '/main.jsx',
    output: {
        path: build,
        filename: '[hash].js'
    },
    postcss: [ autoprefixer({ browsers }) ],
    module: { loaders },
    resolve,
    plugins,
    imageWebpackLoader: {
        mozjpeg: {
            quality: 65,
        },
        pngquant: {
            quality: "65-90",
            speed: 4,
        },
        svgo: {
            plugins: [
                { removeViewBox: false },
                { removeEmptyAttrs: false },
            ]
        }
    },
}

module.exports = config
