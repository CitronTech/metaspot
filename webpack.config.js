var path = require('path');
var process = require('process');
var webpack = require('webpack');
var extractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  context: __dirname,
  devtool: 'inline-source-map',
  entry: {
    'metaspot': './js/metaspot.js'
  },
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'build'),
    sourceMapFilename: '[file].map',
    filename: '[name].bundle.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /.js/,
        loader: 'babel-loader',
        exclude: [/node_modules/, 'js/lambdas/'],
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.less$/,
        loader: extractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!less-loader')
      },
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.(ttf|woff2|eot|woff|svg|png|gif|jpe?g)$/, loader: 'file-loader' }
    ]
  },
  plugins: [
    new extractTextPlugin("./[name].css"),
    new webpack.DefinePlugin({
      'process.env': { 'NODE_ENV': JSON.stringify('production') },
    }),
    new webpack.optimize.DedupePlugin()
  ]
};
