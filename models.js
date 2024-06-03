/**
 * @fileoverview Defines MongoDB schemas for the myFlix application.
 */

//Import mongoose
const mongoose = require('mongoose');

//Import bcrypt
const bcrypt = require('bcrypt');

/**
 * @typedef {Object} Genre
 * @property {string} genreName - Name of the genre.
 * @property {string} description - Description of the genre.
 */

/**
 * @typedef {Object} Director
 * @property {string} name - Name of the director.
 * @property {string} birth - Birth date of the director.
 * @property {string} death - Death date of the director.
 * @property {string} bio - Biography of the director.
 */

/**
 * @typedef {Object} Movie
 * @property {Genre} genre - Genre of the movie.
 * @property {Director} director - Director of the movie.
 * @property {string} Actors - Actors in the movie.
 * @property {string} _id - Unique identifier for the movie.
 * @property {string} title - Title of the movie.
 * @property {string} year - Year of the movie.
 * @property {string} description - Description of the movie.
 * @property {number} MovieId - ID of the movie.
 */

/**
 * @typedef {Object} User
 * @property {string} Username - Username of the user.
 * @property {string} Password - Password of the user.
 * @property {string} Email - Email of the user.
 * @property {Date} Birthday - Birthday of the user.
 * @property {Array.<mongoose.Schema.Types.ObjectId>} FavoriteMovies - List of favorite movies of the user.
 */

//Define MongoDB schemas
let movieSchema = mongoose.Schema({
  genre: {
    genreName: String,
    description: String,
  },
  director: {
    name: String,
    birth: String,
    death: String,
    bio: String
  },
  Actors: String,
  _id: String,
  title: { type: String, required: true },
  year: String,
  description: { type: String, required: true },
  MovieId: Number,

});

let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

/**
 * Hashes a user's password.
 * @function hashPassword
 * @param {string} password - The user's password.
 * @returns {string} The hashed password.
 */
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

/**
 * Validates a user's password.
 * @function validatePassword
 * @param {string} password - The password to validate.
 * @returns {boolean} True if the password is valid, false otherwise.
 */
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
