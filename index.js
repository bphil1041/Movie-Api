const express = require('express');
const morgan = require('morgan');
const app = express();

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

//Middleware to log requests
app.use(morgan('dev'));

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