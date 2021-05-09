const csv = require('csv-parser');
const fs = require('fs');
const mongoose = require('mongoose');
const Question = require('../mongoose/questionsSchema.js');
// const Question = Model.Question;
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

const seedAnswers = () => {
  var bulk = Question.collection.initializeUnorderedBulkOp();
  var counter = 0;
  var batch = 0;
  const readStream = fs.createReadStream('/Users/raul/Documents/BackendBranch/SDC-Q-A/CSV/answers.csv')
    .pipe(csv({}))
    .on('data', data => {
      console.log(data, 'this is data')
      let newAnswer = {
        answer_id: data.id,
        body: data.body,
        date: data.date_written,
        answerer_name: data.answerer_name,
        helpfulness: data.helpful,
        photos: []
      }
      bulk.find({ question_id: data.question_id }).update(
        {
          $push:
          {
            answers: newAnswer
          }
        });
      counter++;
      if (counter % 1000 === 0) {
        readStream.pause();
        bulk.execute(function (err, result) {
          if (err) null;
          batch++;
          console.log(`${batch * 1000} feature entries finished, continuing...`)
        });
        bulk = Question.collection.initializeUnorderedBulkOp();
        readStream.resume();
      }
    })
    .on('err', err => console.log(err))
    .on('end', () => {
      console.log('less than 1000 feature entries to go...')
      if (counter % 1000 != 0) {
        bulk.execute(function (err, result) {
          if (err) null;
          console.log(`seeding done for ${counter} feature!`);
        })
      }
    })
};

db.once('open', (err, conn) => {
  console.log(`connected to mongoDB!`);
  const importQuestions = () => {
    const seedQuestions = () => {
      var bulk = Question.collection.initializeUnorderedBulkOp();
      var counter = 0;
      var batch = 0;
      const readStream = fs.createReadStream('/Users/raul/Documents/BackendBranch/SDC-Q-A/CSV/questions.csv')
        .pipe(csv({}))
        .on('data', data => {
          const question = new Question({
            question_id: data.id,
            product_id: data.product_id,
            question_body: data.body,
            question_date: data.date_written,
            asker_name: data.asker_name,
            question_helpfulness: data.helpful,
            reported: format(data.reported),
            answers: []
          })
          bulk.insert(question);
          counter++;
          if (counter % 1000 === 0) {
            readStream.pause();
            bulk.execute(function (err, result) {
              if (err) null;
              batch++;
              console.log(`${batch * 1000} product entries finished, continuing...`)
            });
            bulk = Question.collection.initializeUnorderedBulkOp();
            readStream.resume();
          }
        })
        .on('err', err => console.log(err))
        .on('end', () => {
          console.log('less than 1000 product entries to go...')
          if (counter % 1000 != 0) {
            bulk.execute(function (err, result) {
              if (err) null;
              console.log(`seeding done for ${counter} product!`);
            });
          }
          seedAnswers()
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
              seedQuestions();
            }
          });
        } else {
          seedQuestions();
        }
      });
    }
    importQuestions();

});
// const path = require('path');
// const csv = require('fast-csv');
// const mongoose = require('mongoose');
// const questionsSchema = require('../mongoose/questionsSchema.js');
// const Question = mongoose.model('Question', questionsSchema.default);
// // const MetaData = require('../mongo/schemas/reviews/metadata');
// const url = 'mongodb://localhost:27017/questions';

// let counterR = 0;
// const max = 5777923;
// let counterP = 0;
// const maxP = 2742833;
// mongoose.connect(url, {
//   useUnifiedTopology: true,
//   useNewUrlParser: true,
// });

// const format = (data) => {
//   if (data === '1' || data === '0') {
//     return data === '1';
//   }
//   return data === 'true';
// };

// const parseAnswers = (file) => {
//   csv
//     .parseFile(file, { headers: true, maxRows: 50000 })
//     .on('data', (data) => {
//       Question.updateMany({ question_id: data.id },
//         {
//           $push: {
//             answer_id: data.id,
//             body: data.body,
//             date: data.date_written,
//             answerer_name: data.answerer_name,
//             helpfulness: data.helpful
//           },
//         })
//         .exec((err) => {
//           if (err) console.log(err);
//           console.log(`Inserted ${counterP} reviews.`);
//           console.log(`Photo is at ${(counterP / maxP) * 100}%\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n`);
//         });
//       counterP += 1;
//     })
//     .on('error', (error) => {
//       console.log(`There is an error in processing: ${error}`);
//     })
//     .on('end', () => {
//       console.log('done');
//     });
// };
// const parseQuestions = (file) => {
//   let arr = [];
//   csv
//     .parseFile(file, { headers: true, maxRows: 50000 })
//     .on('data', (data) => {
//       arr.push(new Question({
//         question_id: data.id,
//         product_id: data.product_id,
//         question_body: data.body,
//         question_date: data.date_written,
//         asker_name: data.asker_name,
//         question_helpfulness: data.helpful,
//         reported: format(data.reported),
//         answers: []
//       }));
//       if (counterR % 1000 === 0) {
//         Question.insertMany(arr, (err) => {
//           if (err) {
//             console.log(`There is an error in processing data: ${err}`);
//           } else {
//             console.log(`Inserted ${counterR} reviews.`);
//             console.log(`Question is at ${(counterR / max) * 100}%\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n`);
//             arr = [];
//           }
//         });
//       }
//       counterR += 1;
//     })
//     .on('error', (error) => {
//       console.log(`There is an error in processing: ${error}`);
//     })
//     .on('end', () => {
//       parseAnswers(path.resolve(__dirname, '../CSV', 'answers.csv'));
//     });
// };
// parseQuestions(path.resolve(__dirname, '../CSV', 'questions.csv'));
// export default { parseReview, parsePhoto };

