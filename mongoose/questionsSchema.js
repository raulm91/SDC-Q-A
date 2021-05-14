const mongoose = require('mongoose');
const { Schema } = mongoose;

const questionsSchema = mongoose.Schema({

  id: { type: Number },
  product_id: {
    type: Number, index: true
  },
  question_id: {
    type: Number, index: true
  },
  answer_id: {
    type: String, index: true
  },
  question_body: String,
  question_date: String,
  asker_name: String,
  question_helpfulness: String,
  reported: String,
  answer_body: String,
  answer_date: String,
  answerer_name: String,
  answer_helpfulness: String,
  photos: [{
    photo_id: String,
    url: String,
  }],

});

questionsSchema.index({ question_id: 1, product_id: 1 });
const Question = mongoose.model('Question', questionsSchema);

module.exports = Question;