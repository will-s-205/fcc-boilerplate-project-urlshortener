require('dotenv').config();
const express = require('express');
const cors = require('cors');
  const app = express();
const dns = require('dns');
const validUrl = require('valid-url');

// Set up mongoose
const mongoose = require('mongoose');

// Basic Configuration
const port = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI); // DON'T FORGET URI FROM MONGO DB TO ENV VAR

// To handle POST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

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
const TIMEOUT = 10000;

// API endpoint triggering each time user hits POST URL button
app.post('/api/shorturl/', (req, res) => {
  const url = req.body.url;

  // Create a Record of a Model
  var url_item = new Url_data(
    {
      original_url: url,
      short_url: 1
    });

  const saveUrlData = () => {
    url_item.save(url).then(() => {
      console.log("Saving URL to DB: " + url);
    })
  }

  // Delete Many Documents many documents from DB
  const removeManyUrl = () => {
    Url_data.remove({ original_url: url },
      function (err, doc) {
        if (err) return console.log(err);
      })
  };

  // Find document if exist
  const findUrl = () => {
    Url_data.find({ original_url: url }).then((data) => {

      if (data != 0) {
        console.log("URL already exist: " + url);
        Url_data.find({ original_url: url }).then(() => {
          console.log("URL number is: " + url_item.short_url);
        })

      } else {
        console.log("No records found so far");
        saveUrlData();
      }
    })
  };

  // URL validation
  if (validUrl.isWebUri(url)) {
    console.log('Looks like an URI');
    findUrl();
    res.json({
      original_url: url,
      short_url: 1 // REPLACE IT BY DYNAMIC VARIABLE
    });
  } else {
    console.log('Not a URI');
    res.json({
      error: "invalid url"
    });
  }







  // Available operations on DB. Triggering each time user hits POST URL button
  // saveUrlData();
  // findManyUrl();
  // removeManyUrl();

});

app.get('/api/shorturl/:short_url', (req, res) => {
  const short_url = req.params.short_url;
  // var url_item = new Url_data(
  //   {
  //     original_url: url,
  //     short_url: 1
  //   });

  res.json({
    short_url: short_url
  });

  // Find document if exist
  const findUrl = () => {
    Url_data.find({ short_url: short_url }).then((data) => {
      console.log(data);

      if (data != 0) {
        console.log("GET: URL is exist: ");

      } else {
        console.log("GET: No records found");
      }

    })
  };
  findUrl();



});

// findOne in DB
// app.find('/api/shorturl/:short_url', (req, res) => {
//   Url.findOne({ short_url: req.params.short_url }, (err, data) => {
//     if (err) res.json({ error: 'Invalid url' })
//     console.log(data)
//   })
// })

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
