const path = require('path');
const fs = require('fs');
const _ = require('lodash');

const TARGET = {
  isDevelopment() {
    return (!process.env.NODE_ENV || (process.env.NODE_ENV === 'development'));
  },
  isProduction() {
    return (process.env.NODE_ENV === 'production');
  },
  isStats() {
    return (process.env.NODE_ENV === 'stats');
  },
};


const DEPLOY = {
  isRequired() {
    return !!(process.env.DEPLOY);
  },
  getPrefix() {
    return '';
  },
  getBootstrapConfigPath() {
    if (TARGET.isDevelopment() || !DEPLOY.isRequired()) {
      return path.join(PATHS.root, 'config/bootstrap/_dev/config.js');
    }

    let bootstrapConfigPath = '',
      load_default = false;

    if (DEPLOY.isRequired()) {
      try {
        console.log('Trying to load bootstrap defaults for: ', process.env.DEPLOY);

        bootstrapConfigPath = path.resolve(__dirname, './bootstrap', process.env.DEPLOY, 'config.js');
        const _exists = fs.existsSync(bootstrapConfigPath);
        if (!_exists) {
          throw new Error('Not found bootstrap config ' + process.env.DEPLOY);
        } else {
          console.log('Loaded config: ', bootstrapConfigPath);
        }
      } catch (e) {
        load_default = true;
        console.log('Not found bootstrap config for ', process.env.DEPLOY);
      }

      if (load_default) {
        try {
          console.log('Rollback loading default config.');
          bootstrapConfigPath = path.resolve(__dirname, './bootstrap/default/config.js');
          const _exists = fs.existsSync(bootstrapConfigPath);
          if (!_exists) {
            throw new Error('Not found default bootstrap config');
          }
        } catch (e) {
          console.log('Not found default bootstrap config...');
        }
      }
    } else {
      try {
        console.log('Loading default config.');

        bootstrapConfigPath = path.resolve(__dirname, './bootstrap/default/config.js');
        const _exists = fs.existsSync(bootstrapConfigPath);

        if (!_exists) {
          throw new Error('Not found default bootstrap config');
        }
      } catch (e) {
        console.log('Not found default bootstrap config...');
      }
    }
    return bootstrapConfigPath;
  },
};

const COMPILER_HASH_TYPE = TARGET.isDevelopment() ? 'dev' : '[chunkhash:4]';

const DEVTOOL = TARGET.isDevelopment() ? 'eval-source-map' : false;

const SOURCE_MAP = !!TARGET.isDevelopment();

const MINIFY = !TARGET.isDevelopment();


const DROP_CONSOLE = !(TARGET.isDevelopment() || DEPLOY.getPrefix() === 'dev/');


console.log('TARGET: ', process.env.NODE_ENV);
console.log('DEPLOY: ', process.env.DEPLOY);
console.log('COMPILER_HASH_TYPE: ', COMPILER_HASH_TYPE);
console.log('DEVTOOL: ', DEVTOOL);
console.log('SOURCE_MAP: ', SOURCE_MAP);
console.log('MINIFY: ', MINIFY);
console.log('DROP_CONSOLE: ', DROP_CONSOLE);

const requireAll = (directory, useSubdirectories = false, regExp = /^\.\//) => {

  if (!fs.existsSync(directory)) {
    console.log('No Dir: ', directory);
    return;
  }

  let readDir = (directory, useSubdirectories, regExp, callback) => {
    let children = fs.readdirSync(directory);
    //console.log(children);
    for (let child of children) {

      let stat = fs.lstatSync(path.join(directory, child));
      let subpath = path.join(directory, child);
      if (useSubdirectories && stat.isDirectory()) {

        readDir(subpath, useSubdirectories, regExp, callback);
      } else {
        //console.log('file ', subpath);
        if (regExp.test(subpath)) {
          callback(subpath);
        }
      }
    }
  };

  let result = [
  ];

  readDir(directory, useSubdirectories, regExp, function (filepath) {
    result.push(filepath);
  });

  return result;
};

const PATHS = {
  root: path.join(__dirname, '../'),
  config: path.join(__dirname, '../config'),
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '/dist'),
  styles: path.join(__dirname, '../src/assets/styles'),
  images: path.join(__dirname, '../src/assets/images'),
  fonts: path.join(__dirname, '../src/assets/fonts'),
  static: path.join(__dirname, '../static'),
  //stats: path.join(__dirname, '../.stats')
};



const ENTRY_POINTS = {
  index: path.join(PATHS.src, 'index.js'),
  styles: path.join(PATHS.styles, './styles.less'),
  svgs: requireAll(path.join(PATHS.images, 'svg'), true, /\.svg$/),
};


const ENV = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3040,
};

const STATS = {
  colors: true,
  chunks: false,
  chunkModules: false,
  modules: false,
};

/*
const BABEL_DEV_RC = {
  "cacheDirectory": true,
  "presets": [
    "@babel/react",
    "@babel/env",
  ],
  "plugins": [
    "react-hot-loader/babel",
    "add-module-exports",
    "@babel/transform-runtime",
    "@babel/plugin-proposal-function-bind",
    "@babel/plugin-proposal-class-properties",
  ]
};

const BABEL_BUILD_RC = {
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react"
  ],
  "plugins": []
    .concat([
      "@babel/transform-runtime",
      "@babel/plugin-proposal-class-properties",
      "add-module-exports"
    ])
    .concat(
      [
        //Saga generators support
        ["transform-runtime", {
          "polyfill": false,
          "regenerator": true
        }]
      ]
    )
};

const BABEL_RC = TARGET.isDevelopment() ? BABEL_DEV_RC : BABEL_BUILD_RC;*/

const BABEL_RC ={
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node:
            'current',
        },
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    'react-hot-loader/babel',
    'add-module-exports',
    '@babel/transform-runtime',
    '@babel/plugin-proposal-function-bind',
    '@babel/plugin-proposal-class-properties',
  ],
};

module.exports = {
  PATHS,
  ENTRY_POINTS,
  ENV,
  TARGET,
  DEPLOY,
  STATS,
  COMPILER_HASH_TYPE,
  DEVTOOL,
  SOURCE_MAP,
  MINIFY,
  DROP_CONSOLE,
  BABEL_RC,
  requireAll,
};
