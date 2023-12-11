# myFlix: a Movie API
Welcome to myFlix; the server side of a web app about movies. Users can register, login, read and update their user information, add a movie to their list of favorites, deregister, read all movies in the database, read a single movie, read movies of a given genre, and read movies by a given director. 

## API Endpoints
- **/users** : Register new user or read user information.
- **/users/:Username** : Update user information or deregister.
- **/users/:Username/movies/:MovieID** : Add a movie to your list of favorites or delete a movie from your list of favorites.
-  **/movies** : Return a list of all movies.
-  **/movies/:title** : Return a single movie.
-  **/movies/genre/:genreName** : Return a list of movies of a specific genre.
-  **/movies/director/:name** : Return a list of movies by a specific director.
-  **/login** : Login to your account.
-  **/** : Default endpoint with welcome message

## Technology Stack
- **Node.js**: JavaScript runtime for server-side development.
- **Express**: Web server framework.
- **MongdoDB**: NoSQL database for storing information on different movies.
- **Mongoose**: MongoDB data modeling.
- **JWT**: JSON Webt Token for authentication.
- **Postman**: for API testing.
- **Heroku**: for deployment.

## Link to Documentation
https://myflixbp-ee7590ef397f.herokuapp.com/documentation.html

![Screenshot 2023-12-11 at 2 32 52 PM](https://github.com/bphil1041/Movie-Api/assets/140545982/8a8c1aa7-bd09-4a4e-a4c0-3a694dd2ff40)




 
