'use strict';

// long stack trace (+clarify from co) if needed
if (process.env.TRACE) {
  require('./libs/trace');
}

const Koa = require('koa');
const app = new Koa();

const mongoose = require('./libs/mongoose');

const promisify = require('es6-promisify');
const path = require('path');
const fs = require('fs');

const handlers = fs.readdirSync(path.join(__dirname, 'handlers')).sort();
handlers.forEach(handler => require('./handlers/' + handler).init(app));

// ---------------------------------------

// can be split into files too
const Router = require('koa-router');
const router = new Router({
  prefix: '/users'
});

router.post('/', require('./routes/users/post'));
router.get('/', require('./routes/users/getAll'));
router.get('/:userId', require('./routes/users/getOne'));
router.patch('/:userId', require('./routes/users/patch'));
router.del('/:userId', require('./routes/users/delete'));

app.use(router.routes());

let server = app.listen(3000);
server.shutdown = async function () {
  await promisify(cb => this.close(cb))();
  await promisify(cb => mongoose.disconnect(cb))();
}


module.exports = server;



