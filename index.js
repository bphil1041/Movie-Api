const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const uuid = require('uuid');
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFLixDB', { useNewUrlParser: true, useUnifiedTopology: true });

//Middleware to log requests
app.use(morgan('dev'));

//Body parser middleware to handle POST req data
app.use(bodyParser.json());

//CREATE: add user
app.post('/users', async (req, res) => {
    console.log('Received request body:', req.body); 
    await Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: req.body.Password,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) =>{res.status(201).json(user) })
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
app.get('/users', async (req, res) => {
    await Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

//READ get a user by username
app.get('/users/:Username', async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

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

// let users = [
//     {
//         userid: 1,
//         username: 'Ben',
//         password: 'yolo',
//         email: 'benjamin.r.phillips1041@gmail.com',
//         birthday: '1993-06-02',
//         favoriteMovies: ['Mulholland Drive']
//     },
//     {
//         userid: 2,
//         username: 'Obi-Wan',
//         password: 'highground',
//         email: 'obi-wan@kenobi.com',
//         birthday: '1973-03-31',
//         favoriteMovies: ['American Gangster']
//     },
//     {
//         userid: 3,
//         username: 'Yoda',
//         password: 'mastery0d@',
//         email: 'yoda@jedicounil.gov',
//         birthday: '1123-01-01',
//         favoriteMovies: ['Moonlight']

//     },
//     {
//         userid: 4,
//         username: 'Mace Windu',
//         password: 'purple',
//         email: 'mace@jedicounil.gov',
//         birthday: '1969-06-09',
//         favoriteMovies: ['Spirited Away']

//     },
//     {
//         userid: 5,
//         username: 'Ki Adi Mundi',
//         password: 'maytheforcebewithyou',
//         email: 'kiadi@jedicounil.gov',
//         birthday: '1924-12-25',
//         favoriteMovies: ['Twin Peaks: Fire Walk With Me']

//     },
    
// ];

// Movies
// const topMovies = [
//     { 
//         title: 'Mulholland Drive', 
//         year: '2001',
//         description: 'Mulholland Drive (stylized as Mulholland Dr.) is a 2001 surrealist neo-noir mystery film written and directed by David Lynch, and starring Naomi Watts, Laura Harring, Justin Theroux, Ann Miller, Mark Pellegrino and Robert Forster. It tells the story of an aspiring actress named Betty Elms (Watts), newly arrived in Los Angeles, who meets and befriends an amnesiac woman (Harring) recovering from a car accident. The story follows several other vignettes and characters, including a Hollywood film director (Theroux).',
//         genre: {
//             genreName: 'Surrealist',
//             description: 'The Surrealist movement used shocking, irrational, or absurd imagery and Feudian dream symbolism to challenge the tradition function of art to represent reality.'
//         },
//         director: {
//             name: 'David Lynch',
//             birth: '1946-01-20',
//             death: '-',
//             bio: 'David Keith Lynch is an American filmmaker, visual artist, musician and actor. Lynch has received critical acclaim for his films, which are often distinguished by their surrealist qualities. He has received numerous accolades, including the Golden Lion in 2006 and an Honorary Academy Award in 2019. In 2007, a panel of critics convened by The Guardian announced that "after all the discussion, no one could fault the conclusion that David Lynch is the most important film-maker of the current era.'
//         }
//     },

//     { 
//         title: 'Twin Peaks: Fire Walk With Me', 
//         year: '1992',
//         description: 'Twin Peaks: Fire Walk with Me is a 1992 American psychological horror film directed by David Lynch and written by Lynch and Robert Engels. It serves as a prequel to the television series Twin Peaks, created by Mark Frost and Lynch, who were also executive producers. It revolves around the investigation into the murder of Teresa Banks (Pamela Gidley) and the last seven days in the life of Laura Palmer (Sheryl Lee), a popular high school student in the fictional Washington town of Twin Peaks. Unlike the series, which was an uncanny blend of detective fiction, horror, the supernatural, offbeat humor, and soap opera tropes, the film has a much darker, less humorous tone.',
//         genre: {
//             genreName: 'Psychological horror',
//             description: 'Psychological horror is a subgenre of horror and psychological fiction with a particular focus on mental, emotional, and psychological states to frighten, disturb, or unsettle its audience.'
//         },
//         director: {
//             name: 'David Lynch',
//             birth: '1946-01-20',
//             death: '-',
//             bio: 'David Keith Lynch is an American filmmaker, visual artist, musician and actor. Lynch has received critical acclaim for his films, which are often distinguished by their surrealist qualities. He has received numerous accolades, including the Golden Lion in 2006 and an Honorary Academy Award in 2019. In 2007, a panel of critics convened by The Guardian announced that "after all the discussion, no one could fault the conclusion that David Lynch is the most important film-maker of the current era.'
//         }
//     },

//     { 
//         title: 'Good Will Hunting', 
//         year: '1997',
//         description: 'Good Will Hunting is a 1997 American psychological drama film directed by Gus Van Sant, and written by Ben Affleck and Matt Damon. It stars Robin Williams, Damon, Affleck, Stellan Skarsgård and Minnie Driver.',
//         genre: { 
//             genreName: 'Psychodrama',
//             description: 'Psychodrama is a sub-genre of drama that places emphasis on psychological elements'
//         },
//         director: {
//             name: 'Gus Van Sant',
//             birth: '1952',
//             death: '-',
//             bio: 'Gus Green Van Sant Jr. (born July 24, 1952) is an American film director, producer, photographer, and musician who has earned acclaim as an independent filmmaker. His films typically deal with themes of marginalized subcultures, in particular homosexuality. Van Sant is considered one of the most prominent auteurs of the New Queer Cinema movement.'
//         },
//     },

//     { 
//         title: 'Dead Poets Society', 
//         year: '1989',
//         description: 'Dead Poets Society is a 1989 American coming-of-age drama film directed by Peter Weir and written by Tom Schulman. The film, starring Robin Williams, is set in 1959 at the fictional elite boarding school Welton Academy, and tells the story of an English teacher who inspires his students through his teaching of poetry.',
//         genre: {
//             genreName: 'Drama',
//             description: 'Drama is a category or genre of narrative fiction intended to be more serious than humorous in tone.'
//         },
//         director: {
//             name: 'Peter Weir',
//             birth: '1944',
//             death: '-',
//             bio: 'Peter Lindsay Weir is an Australian retired film director. He is known for directing films crossing various genres over forty years with films such as Picnic at Hanging Rock (1975), Gallipoli (1981), Witness (1985), Dead Poets Society (1989), Fearless (1993), The Truman Show (1998), Master and Commander: The Far Side of the World (2003), and The Way Back (2010). He has received six Academy Award nominations, ultimately being awarded the Academy Honorary Award in 2022 for his lifetime achievement career.'
//         }
//     },

//     { 
//         title: 'American Gangster', 
//         year: '2007',
//         description: 'American Gangster is a 2007 American biographical crime film directed and produced by Ridley Scott and written by Steven Zaillian. The film is loosely based on the criminal career of Frank Lucas, a gangster from La Grange, North Carolina who smuggled heroin into the United States on American service planes returning from the Vietnam War, before being detained by a task force led by Newark Detective Richie Roberts. The film stars Denzel Washington and Russell Crowe, with co-stars Ted Levine, John Ortiz, Josh Brolin, Chiwetel Ejiofor, Ruby Dee, Lymari Nadal and Cuba Gooding Jr.',
//         genre: {
//             genreName: 'Drama',
//             description: 'Drama is a category or genre of narrative fiction intended to be more serious than humorous in tone.'
//         },
//         director: {
//             name: 'Ridley Scott',
//             birth: '1937',
//             death: '-',
//             bio: 'Sir Ridley Scott is an English filmmaker. He is best known for directing films in the science fiction, crime, and historical drama genres. His work is known for its atmospheric and highly concentrated visual style. Scott has received many accolades throughout his career, including the BAFTA Fellowship for lifetime achievement from the British Academy of Film and Television Arts in 2018, two Primetime Emmy Awards, and a Golden Globe Award. In 2003, he was knighted by Queen Elizabeth II.'
//         },
            
//     },

//     { 
//         title: 'Rogue One: A Star Wars Story', 
//         year: '2016',
//         description: 'Rogue One: A Star Wars Story (or simply Rogue One) is a 2016 American epic space opera film directed by Gareth Edwards. The screenplay by Chris Weitz and Tony Gilroy is from a story by John Knoll and Gary Whitta. It was produced by Lucasfilm and distributed by Walt Disney Studios Motion Pictures. It is the first installment of the Star Wars anthology series, and an immediate prequel to Star Wars (1977). The main cast consists of Felicity Jones, Diego Luna, Ben Mendelsohn, Donnie Yen, Mads Mikkelsen, Alan Tudyk, Riz Ahmed, Jiang Wen, and Forest Whitaker. Set a week before Star Wars, the plot follows a group of rebels who band together to steal plans of the Death Star, the ultimate weapon of the Galactic Empire. It details the Rebel Alliance\'s first effective victory against the Empire, first referenced in Star Wars\' opening crawl.',
//         genre: {
//             genreName: 'SciFi',
//             description: 'Science fiction is a genre of speculative fiction that contains imagined elements that don\'t\ exist in the real world'
//         },
        
//         director: {
//             name: 'Gareth Edwards',
//             birth: '1975',
//             death: '-',
//             bio: 'Gareth James Edwards is a Welsh filmmaker. He first gained widespread recognition for Monsters (2010), an independent film in which he served as writer, director, cinematographer, and visual effects artist. He subsequently directed Godzilla (2014), a reboot[5] of Toho\'s Godzilla franchise and the first film in Legendary\'s MonsterVerse, and Rogue One: A Star Wars Story (2016), the first installment of the Star Wars anthology series and an immediate prequel to Star Wars: Episode IV – A New Hope (1977). He would return to making original films with the science fiction thriller The Creator (2023).'
//         },
//     },

//     { 
//         title: 'Princess Mononoke', 
//         year: '1997',
//         description: 'Princess Mononoke is set in the late Muromachi period of Japan (approximately 1336 to 1573 AD) and includes fantasy elements. The story follows a young Emishi prince named Ashitaka, and his involvement in a struggle between the gods (kami) of a forest and the humans who consume its resources. The film deals with themes of Shinto and environmentalism. The term mononoke (物の怪, or もののけ) is not a name, but a Japanese word for supernatural, shape-shifting beings that possess people and cause suffering, disease, or death.',
//         genre: {
//             genreName: 'Fantasy',
//             description: 'Fantasty films are films that belong to the fantasy genre with fantastic themes, usually magic, supernatural events, mythology, folklore, or exotic fantasy worlds.'
//         },
    
//         director: {
//             name: 'Hayao Miyazaki',
//             birth: '1941',
//             death: '-',
//             bio: 'Hayao Miyazaki is a Japanese animator, filmmaker, and manga artist. A co-founder of Studio Ghibli, he has attained international acclaim as a masterful storyteller and creator of Japanese animated feature films, and is widely regarded as one of the most accomplished filmmakers in the history of animation.'
//         },
    
//     },

//     { 
//         title: 'Spirited Away', 
//         year: '2001',
//         description: 'Spirited Away tells the story of Chihiro Ogino (Hiiragi), a ten-year-old girl who, while moving to a new neighborhood, enters the world of kami (spirits of Japanese Shinto folklore). After her parents are turned into pigs by the witch Yubaba (Natsuki), Chihiro takes a job working in Yubaba\'s bathhouse to find a way to free herself and her parents and return to the human world.',
//         genre: {
//             genreName: 'Fantasy',
//             description: 'Fantasty films are films that belong to the fantasy genre with fantastic themes, usually magic, supernatural events, mythology, folklore, or exotic fantasy worlds.'
//         },
        
//         director: {
//             name: 'Hayao Miyazaki',
//             birth: '1941',
//             death: '-',
//             bio: 'Hayao Miyazaki is a Japanese animator, filmmaker, and manga artist. A co-founder of Studio Ghibli, he has attained international acclaim as a masterful storyteller and creator of Japanese animated feature films, and is widely regarded as one of the most accomplished filmmakers in the history of animation.'
//         },
//     },    

//     { 
//         title: 'The Talented Mr. Ripley', 
//         year: '1999',
//         description: 'The Talented Mr. Ripley is a 1999 American psychological thriller film written and directed by Anthony Minghella, and based on Patricia Highsmith\'s 1955 novel of the same name. Set in the 1950s, it stars Matt Damon as Tom Ripley, an underachieving young man that is sent from New York City to Italy to retrieve Dickie Greenleaf, a rich and spoiled playboy, and convince him to return home - however, after failing, Ripley takes extreme measures. Jude Law, Gwyneth Paltrow, Cate Blanchett and Philip Seymour Hoffman also appear in supporting roles.',
//         genre: {
//             genreName: 'Drama',
//             description: 'Drama is a category or genre of narrative fiction intended to be more serious than humorous in tone.'
//         },
        
//         director: {
//             name: 'Anthony Minghella',
//             birth: '1954',
//             death: '2008',
//             bio: 'Anthony Minghella was a British film director, playwright and screenwriter. He was chairman of the board of Governors at the British Film Institute between 2003 and 2007. He directed Truly, Madly, Deeply (1991), The English Patient (1996), The Talented Mr. Ripley (1999), and Cold Mountain (2003), and produced Iris (2001), The Quiet American (2002), Michael Clayton (2007), and The Reader (2008).'
//         },
//     },

//     { 
//         title: 'Moonlight', 
//         year: '2016',
//         description: 'Moonlight is a 2016 American coming-of-age drama film written and directed by Barry Jenkins, based on Tarell Alvin McCraney\'s unpublished semi-autobiographical play In Moonlight Black Boys Look Blue. It stars Trevante Rhodes, André Holland, Janelle Monáe, Ashton Sanders, Jharrel Jerome, Naomie Harris, and Mahershala Ali.',
//         genre: {
//             genreName: 'Drama',
//             description: 'Drama is a category or genre of narrative fiction intended to be more serious than humorous in tone.'
//         },
        
//         director: {
//             name: 'Barry Jenkins',
//             birth: '1979',
//             death: '',
//             bio: 'Barry Jenkins (born November 19, 1979) is an American filmmaker. After making his filmmaking debut with the short film My Josephine (2003), he directed his first feature film Medicine for Melancholy (2008) for which he received an Independent Spirit Award nomination for Best First Feature. He is also a member of The Chopstars collective as a creative collaborator.'
//         },
//     },
// ];