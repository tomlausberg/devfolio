const path = require('path');
const fs = require('fs');  // Add this import
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Create a function that returns the preprocessor function with access to fs
const createPreprocessor = (fsModule) => {
  return (content, loaderContext) => {
    return content.replace(/<%= require\(['"](.+)['"]\) %>/g, (match, p1) => {
      const filePath = path.resolve(path.dirname(loaderContext.resourcePath), p1);
      return fsModule.readFileSync(filePath, 'utf8');
    });
  };
};

module.exports = {
  entry: './src/index.js',
  watch: true,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/bundle.js',
  },
  module: {
    rules: [{
      test: /.s?css$/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader'
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            // options...
          }
        },
      ]
    },
    {
      test: /\.html$/,
      exclude: /node_modules/,
      use: {
        loader: 'html-loader',
        options: {
          minimize: false,
          preprocessor: createPreprocessor(fs)  // Pass fs to the preprocessor
        }
      }
    }]
  },
  optimization: {
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      // `...`,
      new CssMinimizerPlugin(),
      new TerserJSPlugin({})
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].bundle.css'
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};