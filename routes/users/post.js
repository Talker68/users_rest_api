'use strict';

const User = require('../../models/user');

module.exports = async function (ctx) {
  // Для тестов оставляем id , иначе удаляем
  if(process.env.NODE_ENV !== 'test'){
    delete ctx.request.body._id;
  }
  try {
    console.log('ffff', ctx.request.body);
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