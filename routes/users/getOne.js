'use strict';

const User = require('../../models/user');

module.exports = async function (ctx) {
  ctx.body = ctx.userById.getPublicFields();
}