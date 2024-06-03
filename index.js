/**
 * @fileoverview Main server file for the myFlix application.
 */

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const uuid = require('uuid');
const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
const { check, validationResult } = require('express-validator');

//mongoose.connect('mongodb://localhost:27017/myFLixDB', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });


const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://localhost:1234', 'http://localhost:4200', 'https://myflix-bp.netlify.app', 'https://myflixbp-ee7590ef397f.herokuapp.com/', 'https://bphil1041.github.io'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

//Import auth
let auth = require('./auth')(app);

//Middleware to log requests
app.use(morgan('dev'));

//Body parser middleware to handle POST req data
app.use(bodyParser.urlencoded({ extended: true }));

//Import passport
const passport = require('passport');
require('./passport');

// ENDPOINTS
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user in the system.
 */
//CREATE: add user
app.post('/users',
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], async (req, res) => {

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    console.log('Received request body:', req.body);
    await Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) => { res.status(201).json(user) })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            })
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });

  });

//READ data about users
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all registered users.
 */
app.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// READ get a user by username
/**
 * @swagger
 * /users/{Username}:
 *   get:
 *     summary: Get a user by username
 *     description: Retrieve a user by their username.
 *     parameters:
 *       - in: path
 *         name: Username
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the user
 */
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await Users.findOne({ Username: req.params.Username });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});


//UPDATE user
/**
 * @swagger
 * /users/{Username}:
 *   put:
 *     summary: Update a user's information
 *     description: Update a user's information by their username.
 *     parameters:
 *       - in: path
 *         name: Username
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the user
 */
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.Username !== req.params.Username) {
    return res.status(400).send('Permission denied');
  }
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
    $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
    { new: true })
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })

});

//CREATE favorite movie 
/**
 * @swagger
 * /users/{Username}/movies/{MovieID}:
 *   post:
 *     summary: Add a movie to user's favorites
 *     description: Add a movie to a user's list of favorite movies by movie ID.
 *     parameters:
 *       - in: path
 *         name: Username
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the user
 *       - in: path
 *         name: MovieID
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the movie
 */
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.MovieID }
  },
    { new: true })
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


// DELETE favorite movie
/**
 * @swagger
 * /users/{Username}/movies/{MovieID}:
 *   delete:
 *     summary: Remove a movie from user's favorites
 *     description: Remove a movie from a user's list of favorite movies by movie ID.
 *     parameters:
 *       - in: path
 *         name: Username
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the user
 *       - in: path
 *         name: MovieID
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the movie
 */
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $pull: { FavoriteMovies: req.params.MovieID } },
    { new: true }
  )
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});



//DELETE: allow existing user to deregister 
/**
 * @swagger
 * /users/{Username}:
 *   delete:
 *     summary: Delete a user
 *     description: Deregister an existing user by their username.
 *     parameters:
 *       - in: path
 *         name: Username
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the user
 */
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndDelete({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


//READ: return list of all movies
/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Get all movies
 *     description: Retrieve a list of all movies.
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//READ: return single movie
/**
 * @swagger
 * /movies/{title}:
 *   get:
 *     summary: Get a movie by title
 *     description: Retrieve a movie by its title.
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *         description: The title of the movie
 */
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ title: req.params.title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// READ: return genre
/**
 * @swagger
 * /movies/genre/{genreName}:
 *   get:
 *     summary: Get movies by genre
 *     description: Retrieve movies by genre name.
 *     parameters:
 *       - in: path
 *         name: genreName
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the genre
 */
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { genreName } = req.params;

  Movies.find({ 'genre.genreName': genreName })
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// READ: return director
/**
 * @swagger
 * /movies/director/{name}:
 *   get:
 *     summary: Get movies by director
 *     description: Retrieve movies by director name.
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the director
 */
app.get('/movies/director/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { name } = req.params;

  Movies.find({ 'director.name': name })
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Default endpoint that responds with a welcome message
/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome message
 *     description: Returns a welcome message.
 */

app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
});

//Middleware to serve static files from "public" directory
app.use(express.static('public'));

/**
 * Error-handling middleware
 * @param {Object} err - Error object.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @param {Function} next - Next middleware function.
 */

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});

