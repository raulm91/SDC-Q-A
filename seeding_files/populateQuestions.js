const csv = require('csv-parser');
const fs = require('fs');
const mongoose = require('mongoose');
const Question = require('../mongoose/questionsSchema.js');
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connect('mongodb://localhost:27017/questions', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

const format = (data) => {
  if (data === '1' || data === '0') {
    return data === '1';
  }
  return data === 'true';
};

const seedQuestions = () => {
  var bulk = Question.collection.initializeUnorderedBulkOp();
  var counter = 0;
  var batch = 0;
  const readStream = fs.createReadStream('/Users/raul/Documents/BackendBranch/SDC-Q-A/CSV/questions.csv')
    .pipe(csv({}))
    .on('data', data => {
      bulk.find({ answer_id: data.id }).update({
        $set:
        {
          product_id: Number(data.product_id),
          question_body: data.body,
          question_date: data.date_written,
          asker_name: data.asker_name,
          question_helpfulness: data.helpful,
          reported: format(data.reported),
        }
      })
      counter++;
      if (counter % 1000 === 0) {
        readStream.pause();
        bulk.execute(function (err, result) {
          if (err) null;
          batch++;
          console.log(`${batch * 1000} question entries finished, continuing...`)
        });
        bulk = Question.collection.initializeUnorderedBulkOp();
        readStream.resume();
      }
    })
    .on('err', err => console.log(err))
    .on('end', () => {
      console.log('less than 1000 question entries to go...')
      if (counter % 1000 != 0) {
        bulk.execute(function (err, result) {
          if (err) null;
          console.log(`seeding done for ${counter} questions!`);
        })
      }
    })

};

db.once('open', (err, conn) => {
  console.log(`connected to mongoDB!`);
  const importAnswers = () => {
    const seedAnswers = () => {
      var bulk = Question.collection.initializeUnorderedBulkOp();
      var counter = 0;
      var batch = 0;
      const readStream = fs.createReadStream('/Users/raul/Documents/BackendBranch/SDC-Q-A/CSV/answers.csv')
        .pipe(csv({}))
        .on('data', data => {
          const question = new Question({
            product_id: null,
            question_id: Number(data.question_id),
            answer_id: data.id,
            question_date: null,
            asker_name: null,
            question_helpfulness: null,
            reported: null,
            answer_body: data.body,
            answer_date: data.date_written,
            answerer_name: data.answerer_name,
            answer_helpfulness: data.helpful,
            photos: []
          })
          bulk.insert(question);
          counter++;
          if (counter % 1000 === 0) {
            readStream.pause();
            bulk.execute(function (err, result) {
              if (err) null;
              batch++;
              console.log(`${batch * 1000} answer entries finished, continuing...`)
            });
            bulk = Question.collection.initializeUnorderedBulkOp();
            readStream.resume();
          }
        })
        .on('err', err => console.log(err))
        .on('end', () => {
          console.log('less than 1000 answer entries to go...')
          if (counter % 1000 != 0) {
            bulk.execute(function (err, result) {
              if (err) null;
              console.log(`seeding done for ${counter} answers!`);
            });
          }
         seedQuestions();
        })

      }
      db.db.listCollections().toArray((err, names) => {
        let exist = false;
        names.forEach((obj) => {
          if (obj.name === 'questions') {
            exist = true;
          }
        });
        if (exist) {
          db.dropCollection('questions', (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log('OLD COLLECTION DROPPED!');
            seedAnswers();
            }
          });
        } else {
        seedAnswers();
        }
      });
    }
    importAnswers();

});
