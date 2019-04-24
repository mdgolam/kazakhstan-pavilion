'use strict';

const Path = require('path');
const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractSASS = new ExtractTextPlugin('./assets/[name].[hash].css');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const PresetReact = require('babel-preset-react');

const pages = require('./src/pages');
let renderedPages = [];
for (let i = 0; i < pages.length; i++) {
  let page = Object.assign({}, pages[i]);
  renderedPages.push(
    new HtmlWebpackPlugin({
      template: page.template,
      stats: 'errors-only',
      filename: page.output,
      title: page.content.title,
      description: page.content.description,
    })
  );
}

module.exports = (options) => {
  const dest = Path.join(__dirname, '');

  let webpackConfig = {
    devtool: options.devtool,
    stats: "errors-only",
    entry: ["./src/app.js"],
    output: {
      path: dest,
      filename: "./assets/scripts/[name].[hash].js"
    },
    plugins: [
      new CopyWebpackPlugin([
        { from: "./src/assets/images", to: "./assets/images" }
      ]),
      new CopyWebpackPlugin([
        { from: "./src/assets/fonts", to: "./assets/fonts" }
      ]),
      new CopyWebpackPlugin([
        {
          from: "./src/assets/audio",
          to: "./assets/audio"
        }
      ]),
      new CopyWebpackPlugin([
        {
          from: "./src/assets/video",
          to: "./assets/video"
        }
      ]),
      new Webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify(
            options.isProduction ? "production" : "development"
          )
        }
      })
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "babel-loader",
          query: {
            presets: ["@babel/preset-env", "@babel/react"]
          }
        },
        {
          test: /\.mp4$/,
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "./assets/video"
          }
        },
        {
          test: /\.hbs$/,
          loader: "handlebars-loader",
          query: {
            helperDirs: [Path.join(__dirname, "src", "helpers")],
            partialDirs: [
              Path.join(__dirname, "src", "layouts"),
              Path.join(__dirname, "src", "components"),
              Path.join(__dirname, "src", "pages")
            ]
          }
        },
        {
          test: /\.mp3$/,
          loader: "file-loader",
          options: {
            // include: './src/assets/audio', // don't know if need this
            name: "[name].[ext]",
            outputPath: "./assets/audio"
          }
        },
        {
          test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                outputPath: "./assets/fonts"
              }
            }
          ]
        },
        {
          test: /\.(gif|jpg|png|svg)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                outputPath: "./assets/images"
              }
            },
            {
              loader: "image-webpack-loader",
              options: {
                mozjpeg: {
                  progressive: true,
                  quality: 65
                },
                optipng: {
                  enabled: true
                },
                pngquant: {
                  quality: "65-90",
                  speed: 4
                }
              }
            }
          ]
        }
      ]
    }
  };

  if (options.isProduction) {
    webpackConfig.entry = ['./src/app.js'];
    webpackConfig.plugins.push(
      ExtractSASS,
      new CleanWebpackPlugin(['assets'], {
        verbose: true,
        dry: false
      })
    );

    webpackConfig.module.rules.push({
      test: /\.scss$/i,
      use: ExtractSASS.extract(['css-loader', 'sass-loader'])
    }, {
      test: /\.css$/i,
      use: ExtractSASS.extract(['css-loader'])
    });

  } else {
    webpackConfig.plugins.push(
      new Webpack.HotModuleReplacementPlugin()
    );

    webpackConfig.module.rules.push({
      test: /\.scss$/i,
      use: ['style-loader?sourceMap', 'css-loader?sourceMap', 'sass-loader?sourceMap']
    }, {
      test: /\.css$/i,
      use: ['style-loader', 'css-loader']
    }
    );

    webpackConfig.devServer = {
      port: options.port,
      contentBase: dest,
      noInfo: true,
      historyApiFallback: true,
      compress: options.isProduction,
      inline: !options.isProduction,
      hot: !options.isProduction,
      disableHostCheck: true,
      stats: 'errors-only',
      open: false
    };

    webpackConfig.plugins.push(
      new BrowserSyncPlugin({
        host: 'localhost',
        port: 7001,
        // proxy: 'http://localhost:7001/',
        open: false,
        proxy: {
          target: "https://localhost:7001/",
          ws: "true"
        },
        https: {
        	key: "private.key",
        	cert: "private.pem"
        },
        files: [{
          match: [
            '**/*.hbs'
          ],
          fn: function (event, file) {
            if (event === 'change' || event === 'add' || event === 'unlink') {
              const bs = require('browser-sync').get('bs-webpack-plugin');
              bs.reload();
            }
          }
        }]
      }, {
        reload: false
      })
    );

  }

  webpackConfig.plugins = webpackConfig.plugins.concat(renderedPages);

  return webpackConfig;

};
