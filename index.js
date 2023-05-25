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

// API endpoint triggering each time user hits POST URL button
app.post('/api/shorturl/', (req, res) => {
  const url = req.body.url;

  // Create a Record of a Model
  const url_item = new Url_data(
    {
      original_url: url,
      // First short_url in DB
      short_url: 1
    });

    const countDocs = () => {
      Url_data.countDocuments().then((data) => {
        console.log(data);
        console.log(typeof data);
        return url_item.short_url=data+1;
      })
    };
    countDocs();

    const count = url_item.short_url;
    console.log("count = "+count);

  const saveUrlData = () => {
    url_item.save().then(() => {
      console.log("Saving URL to DB: " + url);
      Url_data.findOne({ original_url: url }).then((data) => {
        console.log("URL number is: " + url_item.short_url);
        res.json({
          original_url: url,
          short_url: data.short_url
        });
      })
    })
  }

  // Delete Many Documents many documents from DB if required
  const removeManyUrl = () => {
    Url_data.remove({ original_url: url },
      function (err, doc) {
        if (err) return console.log(err);
      })
  };

  // Find document if exist 
  // if NOT then save the data
  const findUrl = () => {
    Url_data.find({ original_url: url }).then((data) => {
      if (data != 0) {
        console.log("URL already exist: " + url);
        Url_data.findOne({ original_url: url }).then((data) => {
          console.log("URL number is: " + url_item.short_url);
          res.json({
            original_url: url,
            short_url: data.short_url
          });
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
  } else {
    console.log('Not a URI');
    res.json({
      error: "invalid url"
    });
  }

});

// Find and redirect to the original url by using short_url to find a record in DB and calling endpoint
app.get('/api/shorturl/:short_url', async (req, res) => {
  const short_url = req.params.short_url;
  try {
    const findUrl = await Url_data.findOne({ short_url: short_url });
    if (!findUrl) {
      throw Error(`No short URL found for the given input`);
    } else {
      res.redirect(findUrl.original_url);
      console.log("Rederecting to: " + findUrl.original_url);
    }
  }
  catch (error) {
    res.json({ error: 'invalid short url' })
  }

});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
