import mongoose from 'mongoose';
const { Schema } = mongoose;

const photosSchema = Schema({
  id: {
    type: String,
  },
  url: {
    type: String,
});

const Photo = mongoose.model('Photo', questionsSchema);

module.exports = Photo;