const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const Autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = (env, argv) => {
  const dev = argv.mode !== 'production';

  // console.log(process.mode);
  //
  // console.log('ARGV', argv, 'ENV', env, 'DEV', dev, 'ARGV MODE', argv.mode);

  const proxy = dev ? {
    host: '0.0.0.0',
    open: false,
    useLocalIp: true,
    historyApiFallback: true,
    inline: true,
    hot: true,
    proxy: {
      '/api': {
        target: 'https://tiona.io/',
        logLevel: 'debug',
        changeOrigin: true
      }
    }
  } : undefined;

  console.log();

  return {
    entry: {
      app: [
        'babel-polyfill',
        path.join(__dirname, 'src', 'index.js')
      ]
    },

    output: {
      path: path.resolve('build'),
      filename: dev ? '[name].js' : '[name].[hash].js',
      publicPath: '/'
    },

    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          include: path.join(__dirname, 'src'),
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }

        }, {
          test: /\.(js|jsx)$/,
          include: path.join(__dirname, 'src'),
          enforce: 'pre',
          use: [{
            loader: 'eslint-loader',
            options: {
              eslint: {
                configFile: './.eslintrc.js'
              }
            }
          }]
        }, {
          test: /\.(css|scss|sass)$/,
          use: [
            dev ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                localIdentName: '[local]-[hash:base64]',
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  Autoprefixer({
                    browsers: ['ie >= 8', 'last 4 version']
                  })
                ],
                sourceMap: false
              }
            },
            'sass-loader'
          ]
        }
      ]
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true
        }),
        new OptimizeCSSAssetsPlugin({})
      ]
    },
    devtool: "inline-source-map",
    devServer: proxy,
    plugins: [
      new HtmlWebPackPlugin({
        template: './src/assets/index.html',
        filename: './index.html'
      }),
      new MiniCssExtractPlugin({
        filename: dev ? '[name].css' : '[name].[hash].css',
        chunkFilename: dev ? '[name].css' : '[name].[hash].css'
      }),
      new CleanWebpackPlugin(path.join(__dirname, 'build'))

    ],
    resolve: {
      extensions: ['.js', '.jsx']
    }

  };
};
