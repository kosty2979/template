const path = require('path');
const moment = require('moment');
const webpack = require('webpack');
const chalk = require('chalk');
const _ = require('lodash');

const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackChunkHash = require('webpack-chunk-hash');
//const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const SmartBannerWebpackPlugin = require('smart-banner-webpack-plugin');



const helper = require('./helper');

const pkg = require('./../package.json');



//js|jsx loader
const jsxLoader = {
  test: /\.(js|jsx)?$/,
  include: [
    helper.PATHS.src,
    path.resolve(helper.PATHS.config, 'bootstrap'),
  ],
  exclude: /(node_modules)/,
  use: [
    {
      loader: 'babel-loader',
      options: helper.BABEL_RC,
    },
  ],
};

//svg loader
const svgsLoader = {
  test: /\.svg$/,
  include: [
    helper.PATHS.images,
  ],
  exclude: /(node_modules)/,
  use: [
    {
      loader: 'svg-sprite-loader',
      options: {},
    },
    {
      loader: 'svgo-loader',
      options: {
        plugins: [
          {
            removeAttrs: {
              attrs: [
                '(',
                'fill',
                'stroke',
                'class',
                ')',
              ].join('|'), // '(fill|stroke|class)'
            },
          },
          {
            removeStyleElement: true,
          },
        ],
      },
    },
  ],
};

//loading json
const jsonLoader = {
  test: /\.json$/,
  include: helper.PATHS.src,
  exclude: /(node_modules)/,
  use: [
    {
      loader: 'json5-loader',
    },
  ],
};

const extractingCSSExtractTextPlugin = new ExtractTextPlugin({
  filename: `styles.${helper.COMPILER_HASH_TYPE}.css`,
  allChunks: true,
});

const webpackConfig = {
  entry: {
    //widget: helper.ENTRY_POINTS.app
  },
  resolveLoader: {
    moduleExtensions: [
      '-loader',
    ],
  },
  resolve: {
    extensions: [
      '.js',
      '.jsx',
      '.css',
      '.less',
    ],
    alias: {
      '@': helper.PATHS.src,
      config: helper.DEPLOY.getBootstrapConfigPath(),
      store: path.join(helper.PATHS.src, 'store/store.js'),
    },
  },
  mode: helper.TARGET.isDevelopment() ? 'development' : 'production',
  devtool: helper.DEVTOOL,
  module: {
    rules: [
    ]
      .concat([
        jsxLoader,
      ])

      // Define development specific CSS setup
      .concat([
        {
          test: /\.(less|css)$/,
          include: [
            helper.PATHS.src,
            path.resolve('./node_modules/slick-carousel/slick/slick-theme.css'),
            path.resolve('./node_modules/slick-carousel/slick/slick.less'),
          ],
          use: helper.TARGET.isDevelopment() ?

            [
              {
                loader: 'style-loader',
              },
              {
                loader: 'css-loader',
              },
              {
                loader: 'less-loader',
              },
            ] :

            //Production
            extractingCSSExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [
                'css-loader',
                'less-loader',
              ],
            }),
        },
      ])

      .concat([
        {
          test: /\.(eot|svg|ttf|woff|woff2|gif)$/,
          include: [
            helper.PATHS.src,
            path.resolve('./node_modules/slick-carousel'),
            path.resolve('./node_modules/slick-carousel'),
          ],
          loader: 'file-loader',
        },
      ])

      .concat([
        {
          test: /\.(js|jsx)$/,
          include: helper.PATHS.src,
          exclude: [
            /(node_modules)/,
          ],
          use: [
            {
              loader: 'skeleton-loader',
              options: {
                procedure: function (content, options, callback) {
                  const matchesPromise = new Promise((resolve, reject) => {
                    resolve(content);
                  });
                  matchesPromise.then((_content) => {
                    callback(null, _content);
                  });

                },
              },
            },
          ],
        },
      ])

      //loading json
      .concat([
        jsonLoader,
      ])

      //loading svgs
      .concat([
        svgsLoader,
      ]),
  },

  plugins: [
  ],

  externals: {},

  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};

/*console.log( webpackConfig.resolve.alias.config )*/

// ------------------------------------
// Conditional Entry Points
// ------------------------------------
if (helper.TARGET.isDevelopment()) {
  Object.assign(webpackConfig, {
    entry: {
      hmr: [
        'react-hot-loader/patch',
        'webpack-hot-middleware/client?path=/__webpack_hmr',
      ],
      widget: [
        helper.ENTRY_POINTS.index,
      ],
      styles: [
        helper.ENTRY_POINTS.styles,
      ],
      svgs: [
        ...helper.ENTRY_POINTS.svgs,
      ],
    },
  });
} else if (helper.TARGET.isProduction() || helper.TARGET.isStats()) {
  Object.assign(webpackConfig, {
    entry: {
      //polyfills: ['babel-polyfill' /*For IE11 support Promise*/],
      widget: [
      ]
        //svgs
        .concat([
          ...helper.ENTRY_POINTS.svgs,
        ])
        //styles
        .concat([
          helper.ENTRY_POINTS.styles,
        ])
        //index
        .concat([
          helper.ENTRY_POINTS.index,
        ])
        //vendors
        .concat(Object.keys(pkg.dependencies).filter(function (dependency) {
          return true;
        })),
    },
  });
}

// ------------------------------------
// Conditional Output
// ------------------------------------
if (helper.TARGET.isDevelopment()) {
  Object.assign(webpackConfig, {
    output: {
      path: helper.PATHS.dist,
      filename: '[name].js',
    },
  });
} else if (helper.TARGET.isProduction() || helper.TARGET.isStats()) {
  Object.assign(webpackConfig, {
    output: {
      path: helper.PATHS.dist,
      publicPath: helper.PATHS.dist_prefix,
      filename: `[name].${helper.COMPILER_HASH_TYPE}.js`,
      chunkFilename: `[name].${helper.COMPILER_HASH_TYPE}.js`,
    },
  });
}

// ------------------------------------
// Plugins
// ------------------------------------
webpackConfig.plugins.push(new ProgressBarPlugin({
  format: chalk.cyan.bold('  build [:bar] ') + chalk.green.bold(':percent') + ' (:elapsed seconds)' + chalk.gray.bold(' :msg... '),
}));
webpackConfig.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), // saves ~100k from build
);

// ------------------------------------
// Plugins - Conditional Chunks
// ------------------------------------
if (helper.TARGET.isDevelopment()) {
  Object.assign(webpackConfig, {
    optimization: {
      splitChunks: {

      },
    },
  });
} else {
  Object.assign(webpackConfig, {
    optimization: {
      splitChunks: {

      },
    },
  });
}

// ------------------------------------
// Plugins - Conditional Index
// ------------------------------------
webpackConfig.plugins.push(new HtmlWebpackPlugin({
  template: `ejs-compiled-loader!${path.join(helper.PATHS.src, 'index.ejs')}`,
  filename: 'index.html',
  title: 'Show case',
  inject: 'body',
  BASE_URL: process.env.BASE_URL,
  minify: helper.MINIFY ? {
    removeComments: true,
    collapseWhitespace: true,
  } : false,
}));

// Setting DefinePlugin affects React library size!
webpackConfig.plugins.push(new webpack.DefinePlugin({
  'process.env.NODE_ENV': helper.TARGET.isDevelopment() ?
    JSON.stringify('development') :
    JSON.stringify('production'),
  APP_VERSION: JSON.stringify(pkg.version),
}));

// ------------------------------------
// Conditional Plugins
// ------------------------------------
if (helper.TARGET.isDevelopment()) {
  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  webpackConfig.plugins.push(new SpriteLoaderPlugin({ plainSprite: true }));
} else if (helper.TARGET.isProduction() || helper.TARGET.isStats()) {

  webpackConfig.plugins.push(new CopyWebpackPlugin([
    {
      from: helper.PATHS.fonts,
      to: 'fonts',
    },
  ]));

  webpackConfig.plugins.push(new webpack.HashedModuleIdsPlugin());
  webpackConfig.plugins.push(new WebpackChunkHash());

  // Output extracted CSS to a file
  webpackConfig.plugins = webpackConfig.plugins.concat(extractingCSSExtractTextPlugin);

  // ------------------------------------
  // Minify
  // ------------------------------------

  /*if (helper.MINIFY) {
    webpackConfig.plugins.push(
      new UglifyJsWebpackPlugin({
        parallel: 4,
        uglifyOptions: {
          compress: {
            // Drop console statements
            drop_console: helper.DROP_CONSOLE,
            unused: true,
            conditionals: true,
            comparisons: true,
            sequences: true,
            dead_code: true,
            evaluate: true,
            if_return: true,
            join_vars: true,
          },
          output: {
            comments: false
          },
          sourceMap: helper.SOURCE_MAP,
        }
      })
    );
  }*/

  webpackConfig.plugins.push(new SmartBannerWebpackPlugin({
    banner: `/*! Built on: ${moment().format('DD-MMM-YYYY HH:mm:ss ZZ')} */`,
    raw: true,
    entryOnly: false,
  }));
}

module.exports = webpackConfig;
