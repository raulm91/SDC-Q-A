const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const Question = require('./mongoose/questionsSchema.js');
const PORT = 3000;

var app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json());

app.listen(PORT, () => {
  console.log(`successfully connected to port ${PORT}`)
});

mongoose.connect('mongodb://54.219.22.251:27017/questions', { useNewUrlParser: true }, { useUnifiedTopology: true })
  .then(() => {
    console.log('connecting to mongo!')
  })
  .catch(err => {
    console.log(err)
  })

const db = mongoose.connection;

//POST requests for questions and answers

Question.collection.insertOne('/qa/:question_id/answers', (req, res) => {

})

Question.collection.insertOne('/qa/questions/:question_id/answers', (req, res) => {

})

//GET request for questions and answers

app.get('/qa/questions', (req, res) => {
  let product_id = Number(req.query.product_id);
  let page = Number(req.query.page);
  let count = Number(req.query.count);
  Question.find({ product_id: { $gt: (page - 1) * count, $lt: page * count + 1 } })
    .then(result => {
      res.send(result)
    })
    .catch(err => {
      console.log(err)
    })

});

app.get('/qa/questions/:question_id/answers', (req, res) => {
  console.log(req.params, 'REQPARAMS~!!!!!!!!!!!!!!!')
  console.log(req.query, 'REQBODY~!!!!!!!!')
  let question_id = Number(req.query.question_id)
  let page = Number(req.query.page);
  let count = Number(req.query.count);
  Question.find({ question_id: {$gt: (page - 1) * count, $lt: page * count + 1 }})
    .then(result => {
      res.send(result)
    })
    .catch(err => {
      console.log(err)
    })
})

//PUT requests for helpfulness

app.put(`/qa/questions/:product_id/helpful`, (req, res) => {
  let id = Number(req.params.product_id);
  Question.find({ question_id: id }).update({ $set: { question_helpfulness: req.body.question_helpfulness } })
    .then((result) => {
      res.send(result)
    })
    .catch(err => {
      console.log(err)
    })
});

app.put(`/qa/questions/:question_id/helpful`, (req, res) => {
  let id = Number(req.params.question_id);
  Question.find({ answer_id: id }).update({ $set: { answer_id: req.body.answer_helpfulness } })
    .then((result) => {
      res.send(result)
    })
    .catch((err) => {
      console.log(err)
    })
});

//PUT requests for reporting

app.put(`/qa/questions/:product_id/report`, (req, res) => {
  let id = req.params.product_id;
  console.log(req.params, 'this is REQ.PARAMS')
  Question.find({ question_id: id }).update({ $set: { reported: req.body.reported } })
    .then((result) => {
      res.send(result)
    })
    .catch((err) => {
      console.log(err)
    })
});

app.put(`/qa/questions/:question_id/report`, (req, res) => {
  let id = req.params.question_id;
  console.log(req.params, 'this is REQ.PARAMS')
  Question.find({ answer_id: id }).update({ $set: { reported: req.body.reported } })
    .then((result) => {
      res.send(result)
    })
    .catch((err) => {
      console.log(err)
    })
});
