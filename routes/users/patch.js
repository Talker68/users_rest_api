'use strict';

const User = require('../../models/user');

module.exports = async function (ctx) {
  //let user = await User.findByIdAndUpdate(ctx.params.userId, ctx.request.body, {runValidators: true, context: 'query'});
  //let user = await User.findOneAndUpdate({_id: ctx.params.userId}, ctx.request.body, {runValidators: true, context: 'query'});

  // Если в body ничего нет
  if (!Object.getOwnPropertyNames(ctx.request.body).length) {
    ctx.throw(400, 'Request body is empty');
    return;
  }
  // Поиск пользователя
  let user;
  try{
    user = await User.findById({_id: ctx.params.userId});
  } catch (e) {
    ctx.throw(404, 'User not found');
    return;
  }

  // Удаление _id из body
  delete ctx.request.body._id;

  // Обновление пользователя
  try {
    let newUser = Object.assign(user, ctx.request.body);
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