const mongoose = require('mongoose');
const oid = require('../../utils/oid');

module.exports = [
  {
    "_id": mongoose.Types.ObjectId(oid('masha')),
    "email": "masha@gmail.com",
    "displayName": "masha"
  },
  {
    "_id": mongoose.Types.ObjectId(oid('dasha')),
    "email": "dasha@gmail.com",
    "displayName": "dasha"
  }
]