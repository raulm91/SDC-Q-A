const mongoose = require('mongoose');
const { Schema } = mongoose;

const questionsSchema = mongoose.Schema({

  product_id: {
    type: String,
  },
  question_id: {
    type: String,
  },
  question_body: {
    type: String,
  },
  question_date: {
    type: String,
  },
  asker_name: {
    type: String,
  },
  question_helpfulness: {
    type: String,
  },
  reported: {
    type: String,
  },
  answers: [{
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
      id: {
        type: String,
      },
      url: {
        type: String,
      },
    }],
  }],

});
questionsSchema.index({ id: 1 });
const Question = mongoose.model('Question', questionsSchema);

module.exports = Question;