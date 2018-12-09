const expect = require('chai').expect;
const MongoClient = require('mongodb').MongoClient;
const shortId = require('shortid');

const url = 'mongodb://localhost:27017';

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res) {
      MongoClient.connect(url, {
        useNewUrlParser: true
      }, function (err, client) {
        if (err) throw err;
        const db = client.db('freecodecamp')
        db.collection('library').find().toArray((err, doc) => {
          if (err) throw err;
          res.json(doc);
        })
      })
    })

    .post(function (req, res) {
      let data = {
        _id: shortId.generate(),
        title: req.body.title,
        commentcount: 0,
        comment: []
      }
      MongoClient.connect(url, {
        useNewUrlParser: true
      }, function (err, client) {
        if (err) throw err;
        const db = client.db('freecodecamp')
        db.collection('library').insertOne(data, (err, doc) => {
          if (err) throw err;
          res.json(data);
        });
      })

    })

    .delete(function (req, res) {
      console.log('delete all')
      //if successful response will be 'complete delete successful'
      MongoClient.connect(url, {
        useNewUrlParser: true
      }, function (err, client) {
        if (err) throw err;
        const db = client.db('freecodecamp')
        db.collection('library').deleteMany({}, (err, doc) => {
          if (err) throw err;
          res.send('complete delete successful');
        });
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res) {
      const bookid = req.params.id;
      MongoClient.connect(url, {
        useNewUrlParser: true
      }, function (err, client) {
        if (err) throw err;
        const db = client.db('freecodecamp')
        db.collection('library').findOne({
          _id: bookid
        }, (err, doc) => {
          if (err) throw err;
          res.json(doc);
        });
      })
    })

    .post(function (req, res) {
      const bookid = req.params.id;
      const comment = req.body.comment;
      MongoClient.connect(url, {
        useNewUrlParser: true
      }, function (err, client) {
        if (err) throw err;
        const db = client.db('freecodecamp')
        db.collection('library').findOneAndUpdate({
          _id: bookid
        }, {
          $inc: {
            commentcount: 1
          },
          $push: {
            comment: req.body.comment
          }
        }, {
          returnOriginal: false
        }, (err, doc) => {
          if (err) throw err;
          (doc.value === null) ? res.json('ID does not exist'): res.json(doc.value);
        });
      })
    })

    .delete(function (req, res) {
      const bookid = req.params.id;
      //if successful response will be 'delete successful'
      MongoClient.connect(url, {
        useNewUrlParser: true
      }, function (err, client) {
        if (err) throw err;
        const db = client.db('freecodecamp')
        db.collection('library').findOneAndDelete({
          _id: bookid
        }, (err, doc) => {
          if (err) throw err;
          res.send('delete successful')
        });
      })
    });

};