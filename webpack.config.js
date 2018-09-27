/* eslint-disable */
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: process.env.NODE_ENV,
  entry: ["./src/index"],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name]-[hash].js",
    chunkFilename: "[name]-[chunkhash].js",
    globalObject: "this"
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
    antd: "antd",
    moment: "moment",
    lodash: "_"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader", // creates style nodes from JS strings
          "css-loader", // translates CSS into CommonJS
          "sass-loader" // compiles Sass to CSS, using Node Sass by default
        ]
      },
      {
        test: /\.tsx?$/,
        use: ["awesome-typescript-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html"
    }),
    new webpack.NamedModulesPlugin()
  ]
};
