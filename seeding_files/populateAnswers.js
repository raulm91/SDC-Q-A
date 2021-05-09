const path = require('path');
const csv = require('fast-csv');
const mongoose = require('mongoose');
const Answers = require('./mongoose/answersSchema.js');

mongoose.connect('mongodb://localhost:27017/answers', {useNewUrlParser: true});

const parseAnswers = (file) => {
  csv
    .parseFile(file, { headers: true, maxRows: 5000 })
    .on('data', (data) => {
      const answerModel = new Answers({
        question: data.question_id,
        page: 1,
        count: 5,
        results: [{
          answer_id: data.id,
          body: data.body,
          date: data.date_written,
          answerer_name: data.answerer_name,
          helpfulness: data.helpful,
          photos: []
        }],
      });
      answerModel.save();
      .then(() => {
        console.log("Data inserted")  // Success
      }).catch((error) => {
        console.log(error)      // Failure
      });
    });
    .on(error, (error) => {
      console.log(`There is an error processing: ${error}`)
    })
    .on('end', ()=> {
      console.log('Complete')
    });
};

parseAnswers(path.resolve(__dirname, './CSV', 'answers.csv'));

export default { parseAnswers };