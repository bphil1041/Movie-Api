/**
 * Secret key for JWT.
 * @constant {string}
 */

const jwtSecret = 'your_jwt_secret';

const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport');

/**
 * Generates a JWT token for a user.
 * 
 * @param {Object} user - The user object.
 * @param {string} user.Username - The username of the user.
 * @returns {string} The JWT token.
 */

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username,
        expiresIn: '7d',
        algorithm: 'HS256'
    });
}

/**
 * Sets up the login route.
 * 
 * @param {Object} router - The router object.
 */
module.exports = (router) => {
    /**
 * POST /login
 * 
 * @name Login
 * @function
 * @memberof module:router
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object containing user and token if successful, or an error message if not.
 */
    router.post('/login', (req, res) => {
        passport.authenticate('local', { session: false }, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Something is not right!',
                    user: user
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({ user, token });
            });
        })(req, res);
    });
}