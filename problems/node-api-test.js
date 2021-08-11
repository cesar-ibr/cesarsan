var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  name: String
})
var User = mongoose.model('User', userSchema)

var albumSchema = mongoose.Schema({
  title: String,
  performer: String,
  cost: Number
})
var Album = mongoose.model('Album', albumSchema);

var puchaseSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album'
  }
})
var Purchase = mongoose.model('Purchase', puchaseSchema);

function errorHandler(res) {
  res.status(500).send({
    message: 'Some error occurred while processing your request'
  });
}

app.use(bodyParser.json());
app.listen(3000);

// GET /albums
app.get('/albums', (req, res) => {
  Album
    .find()
    .then((albums) => { 
      res.send({ data: albums || [] });
    })
    .catch((e) => { errorHandler(res); });
})

// GET /albums/:id
app.get('/albums/:id', (req, res) => {
  Album
    .findById(req.params.id)
    .then((album) => {
      if (!album) {
        return res.status(404).send({ message: 'Album not found'});
      }
      res.send({ data: album })
  })
    .catch((e) => { errorHandler(e); });
});
// POST /albums
app.post('/albums', (req, res) => {
  if(!req.body.title) {
      return res.status(400).send({
          message: "Album should have a title"
      });
  }
  const album = new Album({
    title: req.body.title,
    performer: req.body.performer,
    cost: req.body.cost,
  });
  
  album
    .save()
    .then((album) => {
      res.send({ data: album });
  })
    .catch(() => {
      errorHandler(res);
  });
});
// PUT /albums/:id
app.put('/albums/:id', (req, res) => {
  Album
    .findByIdAndUpdate(req.params.id, {
      title: req.body.title || '',
      performer: req.body.performer || '',
      cost: req.body.cost || 0
    }, {new: true})
    .then((album) => {
      if (!album) {
        return res.status(404).send({ message: 'Album not found'});
      }
      res.send({ data: album });
    })
    .catch(() => { handleError(res); });
});
// DELETE /albums/:id
app.delete('/albums/:id', (req, res) => {
    Album
      .findByIdAndRemove(req.params.id)
      .then(album => {
        if (!album) {
          return res.status(404).send({ message: 'Album not found'});
        }
        res.status(204).send();
      })
      .catch(err => { handleError(res); });
});
// POST /purchases
app.post('/purchases', (req, res) => {
  const purchase = new Purchase({
    user: req.body.user,
    album: req.body.album
  });
  
  purchase
    .save()
    .then((purch) => {
      res.send({ data: purch });
    })
    .catch(() => { handleError(res); })
});



// POST /signup
app.post('/signup', (req, res) => {
  // TODO: validate name, email and password
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });
  
  user
    .save()
    .then((_user) => {
      req.headers.authorization = Math.random().toString(36);
      res.status(204).send({ data: _user});
    })
    .catch(() => { handleError(res); })
});
// POST /login
app.post('/login', (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(406).send();
  }
  User
    .find({
      email: req.body.email,
      password: req.body.password
    })
    .then((users) => {
      if (users[0]) {
        req.headers.authorization = Math.random().toString(36);
        return res.status(204).send();
      }
      return res.status(404).send();
  })
    .catch(() => { handleError(res); })
});

// TODO: POST /logout