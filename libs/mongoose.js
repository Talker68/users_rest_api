'use strict';

const config = require('config');
const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

mongoose.Promise = Promise;
mongoose.set('debug', process.env.NODE_ENV === 'development' ? true : false);
// вместо MongoError будет выдавать ValidationError (проще ловить и выводить)
mongoose.plugin(beautifyUnique);

mongoose.connect(`mongodb://localhost/${config.get('dbName')}`, {
  server: {
    socketOptions: {
      keepAlive: 1
    },
    poolSize: 5
  }
});


module.exports = mongoose;