'use strict';

const User = require('../../models/user');

module.exports = async function(ctx) {
  let users = await User.find({});
  ctx.body = [];
  for (let user of users) {
    ctx.body.push(user.getPublicFields());
  }
}