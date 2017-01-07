
// request/response logger
const logger = require('koa-logger');

if (process.env.NODE_ENV === 'development') {
  exports.init = app => app.use(logger());
} else {
  exports.init = () => {};
}

