const csv = require('csv-parser');
const fs = require('fs');
const mongoose = require('mongoose');
const Question = require('../mongoose/questionsSchema.js');
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connect('mongodb://localhost:27017/questions', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.once('open', (err, conn) => {
  console.log(`connected to mongoDB!`);

  const seedPhotos = () => {
    var bulk = Question.collection.initializeUnorderedBulkOp();
    var counter = 0;
    var batch = 0;
    const readStream = fs.createReadStream('/Users/raul/Documents/BackendBranch/SDC-Q-A/CSV/answers_photos.csv')
      .pipe(csv({}))
      .on('data', data => {
        let newPhoto = {
          photo_id: data.id,
          url: data.url
        }
        bulk.find({ answer_id: data.answer_id }).update({
          $push:
          {
            photos: newPhoto
          }
        })
        counter++
        if (counter % 1000 === 0) {
          readStream.pause();
          bulk.execute(function (err, result) {
            if (err) null;
            batch++;
            console.log(`${batch * 1000} photo entries finished, continuing...`)
          })
          bulk = Question.collection.initializeUnorderedBulkOp();
          readStream.resume();
        }
      })
      .on('err', err => console.log(err))
      .on('end', () => {
        console.log('less than 1000 photo entries to go...')
        if (counter % 1000 != 0) {
          bulk.execute(function (err, result) {
            if (err) null;
            console.log(`seeding done for ${counter} photos!`);
          })
        }
      })
  }

  seedPhotos();
})


