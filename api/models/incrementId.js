const mongoose = require('mongoose');


const incrementSchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   lastid: Number
});


module.exports = mongoose.model('IncrementID',incrementSchema);