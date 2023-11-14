const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const uuid = require('uuid');


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
    {
        id: 2,
        name: 'Obi-Wan',
        favoriteMovies: ['American Gangster']
    },
    {
        id: 3,
        name: 'Yoda',
        favoriteMovies: ['Moonlight']

    },
    
];

// Movies
const topMovies = [
    { 
        title: 'Mulholland Drive', 
        year: '2001',
        description: 'Mulholland Drive (stylized as Mulholland Dr.) is a 2001 surrealist neo-noir mystery film written and directed by David Lynch, and starring Naomi Watts, Laura Harring, Justin Theroux, Ann Miller, Mark Pellegrino and Robert Forster. It tells the story of an aspiring actress named Betty Elms (Watts), newly arrived in Los Angeles, who meets and befriends an amnesiac woman (Harring) recovering from a car accident. The story follows several other vignettes and characters, including a Hollywood film director (Theroux).',
        genre: {
            genreName: 'Surrealist',
            description: 'The Surrealist movement used shocking, irrational, or absurd imagery and Feudian dream symbolism to challenge the tradition function of art to represent reality.'
        },
        director: {
            name: 'David Lynch',
            birth: '1946',
            death: '-',
            bio: 'David Keith Lynch is an American filmmaker, visual artist, musician and actor. Lynch has received critical acclaim for his films, which are often distinguished by their surrealist qualities. He has received numerous accolades, including the Golden Lion in 2006 and an Honorary Academy Award in 2019. In 2007, a panel of critics convened by The Guardian announced that "after all the discussion, no one could fault the conclusion that David Lynch is the most important film-maker of the current era.'
        }
    },

    { 
        title: 'Fire Walk With Me', 
        year: '1992',
        description: '',
        genre: {
            genreName: 'Psychological horror',
            description: 'Psychological horror is a subgenre of horror and psychological fiction with a particular focus on mental, emotional, and psychological states to frighten, disturb, or unsettle its audience.'
        },
        director: {
            name: 'David Lynch',
            birth: '1946',
            death: '-',
            bio: 'David Keith Lynch is an American filmmaker, visual artist, musician and actor. Lynch has received critical acclaim for his films, which are often distinguished by their surrealist qualities. He has received numerous accolades, including the Golden Lion in 2006 and an Honorary Academy Award in 2019. In 2007, a panel of critics convened by The Guardian announced that "after all the discussion, no one could fault the conclusion that David Lynch is the most important film-maker of the current era.'
        }
    },

    { 
        title: 'Good Will Hunting', 
        year: '1997',
        description: '',
        genre: { 
            genreName: 'Psychodrama',
            description: 'Psychodrama is a sub-genre of drama that places emphasis on psychological elements'
        },
        director: {
            name: 'Gus Van Sant',
            birth: '1952',
            death: '-',
            bio: 'Gus Green Van Sant Jr. (born July 24, 1952) is an American film director, producer, photographer, and musician who has earned acclaim as an independent filmmaker. His films typically deal with themes of marginalized subcultures, in particular homosexuality. Van Sant is considered one of the most prominent auteurs of the New Queer Cinema movement.'
        },
    },

    { 
        title: 'Dead Poets Society', 
        year: '1989',
        description: '',
        genre: {
            genreName: 'Drama',
            description: 'Drama is a category or genre of narrative fiction intended to be more serious than humorous in tone.'
        },
        director: {
            name: 'Peter Weir',
            birth: '1944',
            death: '-',
            bio: 'Peter Lindsay Weir is an Australian retired film director. He is known for directing films crossing various genres over forty years with films such as Picnic at Hanging Rock (1975), Gallipoli (1981), Witness (1985), Dead Poets Society (1989), Fearless (1993), The Truman Show (1998), Master and Commander: The Far Side of the World (2003), and The Way Back (2010). He has received six Academy Award nominations, ultimately being awarded the Academy Honorary Award in 2022 for his lifetime achievement career.'
        }
    },

    { 
        title: 'American Gangster', 
        year: '2007',
        description: '',
        genre: {
            genreName: 'Drama',
            description: 'Drama is a category or genre of narrative fiction intended to be more serious than humorous in tone.'
        },
        director: {
            name: 'Ridley Scott',
            birth: '1937',
            death: '-',
            bio: 'Sir Ridley Scott is an English filmmaker. He is best known for directing films in the science fiction, crime, and historical drama genres. His work is known for its atmospheric and highly concentrated visual style. Scott has received many accolades throughout his career, including the BAFTA Fellowship for lifetime achievement from the British Academy of Film and Television Arts in 2018, two Primetime Emmy Awards, and a Golden Globe Award. In 2003, he was knighted by Queen Elizabeth II.'
        },
            
    },

    { 
        title: 'Rogue One: A Star Wars Story', 
        year: '2016',
        description: '',
        genre: {
            genreName: 'SciFi',
            description: 'Science fiction is a genre of speculative fiction that contains imagined elements that don\'t\ exist in the real world'
        },
        
        director: {
            name: 'Gareth Edwards',
            birth: '1975',
            death: '-',
            bio: 'Gareth James Edwards is a Welsh filmmaker. He first gained widespread recognition for Monsters (2010), an independent film in which he served as writer, director, cinematographer, and visual effects artist. He subsequently directed Godzilla (2014), a reboot[5] of Toho\'s Godzilla franchise and the first film in Legendary\'s MonsterVerse, and Rogue One: A Star Wars Story (2016), the first installment of the Star Wars anthology series and an immediate prequel to Star Wars: Episode IV – A New Hope (1977). He would return to making original films with the science fiction thriller The Creator (2023).'
        },
    },

    { 
        title: 'Princess Mononoke', 
        year: '1997',
        description: '',
        genre: {
            genreName: 'Fantasy',
            description: 'Fantasty films are films that belong to the fantasy genre with fantastic themes, usually magic, supernatural events, mythology, folklore, or exotic fantasy worlds.'
        },
    
        director: {
            name: 'Hayao Miyazaki',
            birth: '1941',
            death: '-',
            bio: 'Hayao Miyazaki is a Japanese animator, filmmaker, and manga artist. A co-founder of Studio Ghibli, he has attained international acclaim as a masterful storyteller and creator of Japanese animated feature films, and is widely regarded as one of the most accomplished filmmakers in the history of animation.'
        },
    
    },

    { 
        title: 'Spirited Away', 
        year: '2001',
        description: '',
        genre: {
            genreName: 'Fantasy',
            description: 'Fantasty films are films that belong to the fantasy genre with fantastic themes, usually magic, supernatural events, mythology, folklore, or exotic fantasy worlds.'
        },
        
        director: {
            name: 'Hayao Miyazaki',
            birth: '1941',
            death: '-',
            bio: 'Hayao Miyazaki is a Japanese animator, filmmaker, and manga artist. A co-founder of Studio Ghibli, he has attained international acclaim as a masterful storyteller and creator of Japanese animated feature films, and is widely regarded as one of the most accomplished filmmakers in the history of animation.'
        },
    },    

    { 
        title: 'The Talented Mr. Ripley', 
        year: '1999',
        description: '',
        genre: {
            genreName: 'Drama',
            description: 'Drama is a category or genre of narrative fiction intended to be more serious than humorous in tone.'
        },
        
        director: {
            name: 'Anthony Minghella',
            birth: '1954',
            death: '2008',
            bio: 'Anthony Minghella was a British film director, playwright and screenwriter. He was chairman of the board of Governors at the British Film Institute between 2003 and 2007. He directed Truly, Madly, Deeply (1991), The English Patient (1996), The Talented Mr. Ripley (1999), and Cold Mountain (2003), and produced Iris (2001), The Quiet American (2002), Michael Clayton (2007), and The Reader (2008).'
        },
    },

    { 
        title: 'Moonlight', 
        year: '2016',
        description: '',
        genre: {
            genreName: 'Drama',
            description: 'Drama is a category or genre of narrative fiction intended to be more serious than humorous in tone.'
        },
        
        director: {
            name: 'Barry Jenkins',
            birth: '1979',
            death: '',
            bio: ''
        },
    },
];


//CREATE: add user
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else {
        res.status(400).send('users need names')
    }
})

//UPDATE user
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find(user => user.id === parseInt(id));

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user); 
    } else {
        res.status(404).send('No such user'); 
    }
});

//CREATE favorite movie 
app.post('/users/:id/:title', (req, res) => {
    const { id, title } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies.push(title);
        res.status(200).send(`${title} has been added to user ${id}'s array`);
    } else {
        res.status(404).send('No such user');
    }
});

//DELETE favorite movie 
app.delete('/users/:id/:title', (req, res) => {
    const { id, title } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter(movieTitle => movieTitle !== title);
        res.status(200).send(`${title} has been removed from user ${id}'s array`);
    } else {
        res.status(404).send('No such user');
    }
});


//DELETE: allow existing user to deregister 
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        users = users.filter( user => user.id != id);
        res.status(200).send(`user ${id} has been deleted`);
    } else {
        res.status(404).send('No such user');
    }
});


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