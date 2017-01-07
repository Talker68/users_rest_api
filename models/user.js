'use strict';
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    // встроенные сообщения об ошибках (можно изменить):
    // http://mongoosejs.com/docs/api.html#error_messages_MongooseError.messages
    required: 'email required', // true for default message
    unique: 'This email already exists',
    validate: [{
      validator: function checkEmail(value) {
        return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
      },
      msg: 'Укажите, пожалуйста, корректный email.'
    }],
    lowercase: true, // to compare with another email
    trim: true
  },
  displayName: {
    type: String,
    required: 'displayName required', // true for default message
    unique: 'This displayName already exists',
    trim: true
  }
}, {
  timestamps: true // createdAt, updatedAt
});


// публичные (доступные всем) поля
userSchema.methods.getPublicFields = function() {
  return {
    id: this.id,
    email: this.email,
    displayName: this.displayName
  };
};

module.exports = mongoose.model('User', userSchema);

