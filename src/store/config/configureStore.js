if (process.env.NODE_ENV === 'production') {
    module.exports = require('./targets/configureStore.prod');
} else {
    module.exports = require('./targets/configureStore.dev');
}
