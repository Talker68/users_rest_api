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

const User = require('./models/user');

router.param('userById', async (id, ctx, next) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log(id);
    ctx.throw(404, 'User not found');
  }

  ctx.userById = await User.findById(id);

  if (!ctx.userById) {
    ctx.throw(404, 'User not found');
  }

  await next();
})

router.post('/', require('./routes/users/post'));
router.get('/', require('./routes/users/getAll'));
router.get('/:userById', require('./routes/users/getOne'));
router.patch('/:userById', require('./routes/users/patch'));
router.del('/:userById', require('./routes/users/delete'));

app.use(router.routes());

let server = app.listen(3000);
server.shutdown = async function () {
  await promisify(cb => this.close(cb))();
  await promisify(cb => mongoose.disconnect(cb))();
}


module.exports = server;



