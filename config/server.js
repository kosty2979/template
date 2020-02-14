const express = require('express');
const path = require('path');
const debug = require('debug');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const compression = require('compression');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const history = require('connect-history-api-fallback');

//onst api_mock_files_router = require('./api_mock/api_files');
//const api_mock_users_router = require('./api_mock/api_users');

const webpackConfig = require('./webpack.config.js');

const helper = require('./helper');

if (helper.TARGET.isDevelopment()) {
    
    const app = express();
    
    app.use(history({
        htmlAcceptHeaders: ['text/html'/*, 'application/xhtml+xml'*/],
    }));
    
    // Apply gzip compression
    app.use(compression());
    
    //Parse
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    
    const compiler = webpack(webpackConfig);
    
    console.log('Enabling webpack dev middleware');
    
    const webpackDevMiddlewareInstance = webpackDevMiddleware(compiler, {
        publicPath: '/',
        //publicPath: webpackConfig.output.publicPath,
        contentBase: helper.PATHS.src,
        hot: true,
        quiet: false,
        noInfo: false,
        lazy: false,
        stats: helper.STATS
    });
    app.use(webpackDevMiddlewareInstance);
    
    
    console.log('Enabling webpack hot middleware');
    
    const webpackHotMiddlewareInstance = webpackHotMiddleware(compiler, {
        path: '/__webpack_hmr',
        log: console.log
    });
    app.use(webpackHotMiddlewareInstance);
    
    // Serve static assets from ~/public since Webpack is unaware of
    // these files. This middleware doesn't need to be enabled outside
    // of development since this directory will be copied into ~/dist
    // when the application is compiled.
    app.use(express.static(helper.PATHS.static));
    app.use(express.static(helper.PATHS.src));
    
    //app.use('/api', api_mock_files_router);
   // app.use('/api', api_mock_users_router);
    
    app.listen(helper.ENV.port);
    
    console.log(`Server is now running at http://${helper.ENV.host}:${helper.ENV.port}`);
}


