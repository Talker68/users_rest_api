'use strict';

const User = require('../../models/user');

module.exports = async (ctx) => {
  // Удаляем _id из body
  delete ctx.request.body._id;

  try {
    let user = await new User(ctx.request.body).save();
    ctx.body = user.getPublicFields();
  } catch (e) {
    if (e.name === 'ValidationError') {
      ctx.status = 400;
      ctx.body = {errors: e.errors};
    } else {
      throw e;
    }
  }
}