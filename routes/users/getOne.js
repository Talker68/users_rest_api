'use strict';

const User = require('../../models/user');

module.exports = async function (ctx) {
  try{
    let user = await User.findById(ctx.params.userId);
    ctx.body = user.getPublicFields();
  } catch (e) {
    ctx.throw(404, 'User not found');
  }
}