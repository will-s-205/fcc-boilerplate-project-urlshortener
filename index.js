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

// Create and Save a Record of a Model
 var createAndSaveUrlData = () => {
  var url_item = new Url_data(
    {
      original_url: "https://www.google.com",
      short_url: 1
    });

    url_item.save(function(err, data) {
    if (err) return console.error(err);
  });
};

createAndSaveUrlData();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const postUrl = app.post('/api/shorturl/', (req, res) => {
  const url = req.body.url;
  res.json({
    original_url: url,
    short_url: 1 // REPLACE IT
  })
});

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
