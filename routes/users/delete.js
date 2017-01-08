'use strict';

const User = require('../../models/user');

module.exports = async function(ctx) {
  try{
    await User.findByIdAndRemove(ctx.params.userId);
    ctx.body = 'ОК';
  } catch (e) {
    ctx.throw(404, 'User not found');
  }
}