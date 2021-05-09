const mongoose = require('mongoose');

const answersSchema = mongoose.Schema({
  id: { type: Number, index: { unique: true } },
  question_id: {
    type: String,
  },
  answer_id: {
    type: String,
  },
  body: {
    type: String,
  },
  date: {
    type: String,
  },
  answerer_name: {
    type: String,
  },
  helpfulness: {
    type: String,
  },
  photos: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Photo'
  }],
  // }],

});
answersSchema.index({ id: 1 });

const Answer = mongoose.model('Answer', answersSchema);
module.exports = Answer;