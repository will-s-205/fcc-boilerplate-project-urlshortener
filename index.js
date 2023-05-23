require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
// Set up mongoose
const mongoose = require('mongoose');

// Basic Configuration
const port = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI); // DON'T FORGET URI FROM MONGO DB TO ENV VAR

// Create a Model
const shortenerSchema = new mongoose.Schema({
  original_url: {
    type: String,
    required: true
  },
  short_url: {
    type: Number,
    required: true
  }
});

const Url_data = mongoose.model('Url_data', shortenerSchema);

// 3 Create and Save a Record of a Model // WORKING!
 var createAndSaveUrlData = () => {
  var url_item = new Url_data(
    {
      original_url: "https://www.google.com",
      short_url: 1
    });

    url_item.save(function(err, data) {
    if (err) return console.error(err);
    // done(null, data);
  });
};

createAndSaveUrlData();



app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  const url = req.query.url;
  res.json({
    original_url: url,
    short_url: 1
  });
});

// use query http://localhost:3000/api/shorturl?url=www.google.com // ECHO

app.get('/?:url', (req, res) => {
  const url = req.params.url;
  res.json({
    echo: url
  });
});


// ECHO to get a number of url shortener
// app.get('/:word/echo', (req, res) => {
//   const word = req.params.word;
//   res.json({
//     echo: word
//   });
// });




// add in the end { error: 'invalid url' }
  // if it not starts from "https://www." and ends on ".com"?

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});


// original_url
// short_url 
// {"original_url":"https://www.google.com","short_url":1}

// req.url - use it to get "/api/shorturl"
// req.path - use it to get "/api/shorturl"
// req.headers - use it to get all kind of information

// returning requested url e.g www.google.com // WORKING only if index.html have method GET instead of POST
// app.get('/api/shorturl', (req, res) => {
//   const original_url = req.query.url;
//   res.json({
//     name: original_url
//   });
// });

// ECHO to get a number of url shortener
// app.get('/:word/echo', (req, res) => {
//   const word = req.params.word;
//   res.json({
//     echo: word
//   });
// });
