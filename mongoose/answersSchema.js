const mongoose = require('mongoose');

const answersSchema = mongoose.Schema({

  answer_id: String,
  question_id: String,
  body: String,
  date: String,
  answerer_name: String,
  helpfulness: String,
  photos: {},
});

const Answer = mongoose.model('Answer', answersSchema);
module.exports = Answer;