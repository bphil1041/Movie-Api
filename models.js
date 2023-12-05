//Import mongoose
const mongoose = require('mongoose');

//Import bcrypt
const bcrypt = require('bcrypt');

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
    title: {type: String, required: true},
    year: String,
    description: {type: String, required: true},
    MovieId: Number,

  });
  
  let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
  });

  userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
  };
  
  userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
  };
  
  let Movie = mongoose.model('Movie', movieSchema);
  let User = mongoose.model('User', userSchema);
  
  module.exports.Movie = Movie;
  module.exports.User = User;
  