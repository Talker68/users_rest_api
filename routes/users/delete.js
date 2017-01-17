'use strict';

const User = require('../../models/user');

module.exports = async function(ctx) {
  await ctx.userById.remove();
  ctx.body = 'ok';
}