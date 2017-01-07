'use strict';

const User = require('../../models/user');

module.exports = async function (ctx) {
  try{
    let deletedUser = await User.findByIdAndRemove(ctx.params.userId);
    if(deletedUser) {
      ctx.body = 'ОК';
    } else {
      ctx.throw(404, 'User not found');
    }

  } catch (e) {
    console.error(e);
  }
}