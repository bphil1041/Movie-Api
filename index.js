const express = require('express');
const morgan = require('morgan');
const app = express();

const topMovies = [
    { title: 'Mulholland Drive', director: 'David Lynch'},
    { title: 'Fire Walk With Me', director: 'David Lynch'},
    { title: 'Good Will Hunting', director: 'Gus Van Sant'},
    { title: 'Dead Poets Society', director: 'Peter Weir'},
    { title: 'American Gangster', director: 'Ridley Scott'},
    { title: 'Rogue One: A Star Wars Story', director: 'Gareth Edwards'},
    { title: 'Princess Mononoke', director: 'Hayao Miyazaki'},
    { title: 'Spirited Away', director: 'Hayao Miyazaki'},
    { title: 'The Talented Mr. Ripley', director: 'Anthony Minghella'},
    { title: 'Moonlight', director: 'Barry Jenkins'}
];

app.use(morgan('dev'));

app.get('/movies', (req, res) => {
    res.json({ topMovies: topMovies});
});

app.get('/', (req, res) => {
    res.send('Welcome to my movie database!');
});

app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log('Server is running on port 8080');
});