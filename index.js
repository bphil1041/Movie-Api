const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();

//Middleware to log requests
app.use(morgan('dev'));

//Body parser middleware to handle POST req data
app.use(bodyParser.json());

let users = [
    {
        id: 1,
        name: 'Ben',
        favoriteMovies: ['Mulholland Drive']
    },
    
];

// Movies
const topMovies = [
    { 
        title: 'Mulholland Drive', 
        year: '2001',
        genre: {
            genreName: 'Surrealist',
            description: 'The Surrealist movement used shocking, irrational, or absurd imagery and Feudian dream symbolism to challenge the tradition function of art to represent reality.'
        },
        director: {
            name: 'David Lynch',
            birth: '1946'
        }
    },

    { 
        title: 'Fire Walk With Me', 
        year: '1992',
        genre: {
            genreName: 'Psychological horror',
            description: 'Psychological horror is a subgenre of horror and psychological fiction with a particular focus on mental, emotional, and psychological states to frighten, disturb, or unsettle its audience.'
        },
        director: {
            name: 'David Lynch',
            birth: '1946'
        }
    },

    { 
        title: 'Good Will Hunting', 
        year: '1997',
        genre: { 
            genreName: 'psychodrama',
            description: 'Psychodrama is a sub-genre of drama that places emphasis on psychological elements'
        },
        director: {
            name: 'Gus Van Sant',
            birth: '1952'
        },
    },

    { 
        title: 'Dead Poets Society', 
        year: '1989',
        genre: {
            genreName: 'Drama',
            description: 'Drama is a category or genre of narrative fiction intended to be more serious than humorous in tone.'
        },
        director: {
            name: 'Peter Weir',
            birth: '1944'
        }
    },

    { 
        title: 'American Gangster', 
        year: '2007',
        genre: {
            genreName: 'Drama',
            description: 'Drama is a category or genre of narrative fiction intended to be more serious than humorous in tone.'
        },
        director: {
            name: 'Ridley Scott',
            birth: '1937'
        },
            
    },

    { 
        title: 'Rogue One: A Star Wars Story', 
        year: '2016',
        genre: {
            genreName: 'SciFi',
            description: 'Science fiction is a genre of speculative fiction that contains imagined elements that don\'t\ exist in the real world'
        },
        
        director: {
            name: 'Gareth Edwards',
            birth: '1975'
        },
    },

    { 
        title: 'Princess Mononoke', 
        year: '1997',
        genre: {
            genreName: 'Fantasy',
            description: 'Fantasty films are films that belong to the fantasy genre with fantastic themes, usually magic, supernatural events, mythology, folklore, or exotic fantasy worlds.'
        },
    
        director: {
            name: 'Hayao Miyazaki',
            birth: '1941'
        },
    
    },

    { 
        title: 'Spirited Away', 
        year: '2001',
        genre: {
            genreName: 'Fantasy',
            description: 'Fantasty films are films that belong to the fantasy genre with fantastic themes, usually magic, supernatural events, mythology, folklore, or exotic fantasy worlds.'
        },
        
        director: {
            name: 'Hayao Miyazaki',
            birth: '1941'
        },
    },    

    { 
        title: 'The Talented Mr. Ripley', 
        year: '1999',
        genre: {
            genreName: 'Drama',
            description: 'Drama is a category or genre of narrative fiction intended to be more serious than humorous in tone.'
        },
        
        director: {
            name: 'Anthony Minghella',
            birth: '1954'
        },
    },

    { 
        title: 'Moonlight', 
        year: '2016',
        genre: {
            genreName: 'Drama',
            description: 'Drama is a category or genre of narrative fiction intended to be more serious than humorous in tone.'
        },
        
        director: {
            name: 'Barry Jenkins',
            birth: '1979'
        },
    },
];

//READ: return list of all movies
app.get('/topmovies', (req, res) => {
    res.status(200).json(topMovies);
})

//READ: return single movie
app.get('/topmovies/:title', (req, res) => {
    const { title } = req.params;
    const movie = topMovies.find(movie => movie.title.toLowerCase() === title.toLowerCase());

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(404).send('No such movie');
    }
});

// READ: return genre
app.get('/topmovies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const moviesWithGenre = topMovies.filter(movie => movie.genre.genreName.toLowerCase() === genreName.toLowerCase());

    if (moviesWithGenre.length > 0) {
        res.status(200).json(moviesWithGenre);
    } else {
        res.status(404).send('No such genre or no movies found with this genre.');
    }
});


// READ: return director
app.get('/topmovies/director/:name', (req, res) => {
    const { name } = req.params;
    const director = topMovies.find(movie => movie.director.name.toLowerCase() === name.toLowerCase());

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(404).send('No such director.');
    }
});




//Endpoint to get a JSON response with topMovies data
app.get('/movies', (req, res) => {
    res.json({ topMovies: topMovies});
});

//Default endpoint that responds with a welcome message
app.get('/', (req, res) => {
    res.send('Welcome to my movie database!');
});

//Middleware to serve static files from "public" directory
app.use(express.static('public'));

//Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log('Server is running on port 8080');
});