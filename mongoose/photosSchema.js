const mongoose = require('mongoose');
const { Schema } = mongoose;

const photosSchema = Schema({
  photo_id: Number,
  url: String,
});

const Photo = mongoose.model('Photo', photosSchema);

module.exports = Photo;