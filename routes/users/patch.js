'use strict';

const User = require('../../models/user');

module.exports = async function (ctx) {


  let requestBody = User.getAcceptedProperties(ctx.request.body);

  // Если в body ничего нет
  if (!Object.getOwnPropertyNames(requestBody).length) {
    ctx.throw(400, 'Request body is empty');
    return;
  }

  // Обновление пользователя
  try {
    let newUser = Object.assign(ctx.userById, requestBody);
    let result = await newUser.save();
    ctx.body = result.getPublicFields();
  } catch (e) {
    if (e.name === 'ValidationError') {
      ctx.status = 400;
      ctx.body = {errors: e.errors};
    } else {
      throw e;
    }
  }
}