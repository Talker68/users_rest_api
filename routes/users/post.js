'use strict';

const User = require('../../models/user');

module.exports = async (ctx) => {

  try {
    let user = await User.create(User.getAcceptedProperties(ctx.request.body));
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