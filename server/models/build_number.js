const mongoose = require('mongoose');

var BuildNumberSchema = new mongoose.Schema({
  bundle_id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 1
    },
  number: {
    type: Number,
    required: true,
    unique: true
  }
});

var BuildNumber = mongoose.model('BuildNumber', BuildNumberSchema);

module.exports = { BuildNumber };
