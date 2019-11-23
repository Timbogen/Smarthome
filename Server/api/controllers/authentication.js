const passport = require('passport');
const mongoose = require('mongoose');
const roles = require('../models/roles');
const User = mongoose.model('User');

/**
 * Controller for registering a user
 * @param req
 * @param res
 */
module.exports.register = (req, res) => {
    // Create the user model and fill it
    const user = new User();
    // Assign the email and the username
    user.email = req.body.email
    user.username = req.body.username;
    // New users always get ranked in as an unknown
    User.countDocuments({}, function (err, count) {
        // If this is the first user make him admin
        if (count === 0) {
            user.role = roles.ADMIN;
        } else {
            user.role = roles.UNKNOWN;
        }
        // Set the password
        user.setPassword(req.body.password);
        // Save the token
        user.save((err) => {
            if (err) {
                res.status(409).send({
                    message: 'Diese E-Mail ist bereits in Verwendung!'
                });
                return;
            }
            const token = user.generateJwt();
            res.status(200);
            res.json({
                _id: user._id,
                email: user.email,
                username: user.username,
                role: user.role,
                token: token,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            })
        })
    })
}

/**
 * Controller for logging in as an user
 */
module.exports.login = (req, res) => {
    // Authenticate over passport
    passport.authenticate('local', (err, user, info) => {
        // Check if passport throws an error
        if (err) {
            res.status(404).json(err);
            return;
        }
        // If an user is found
        if (user) {
            const token = user.generateJwt();
            res.status(200);
            res.json({
                _id: user._id,
                email: user.email,
                username: user.username,
                role: user.role,
                token: token,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            });
            return;
        }
        // If no user was found
        res.status(401).json(info);
    })(req, res);
};

/**
 * Controller for logging in as an user
 */
module.exports.update = (req, res) => {
    // If user isn't authenticated just welcome him
    if (!req.body.isAuthenticated) {
        res.status(200).json({
            message: 'Willkommen im Smart Home Niederer!'
        });
        return;
    }
    // Otherwise check if the user received an update
    User.findOne({_id: req.body._id}, (err, user) => {
        // Check if db throws an error
        if (err) {
            res.status(404).json({
                message: 'Datenbank hatte einen unbekannten Fehler beim Suchen!'
            });
            return;
        }
        // If an user is found
        if (user) {
            if (req.body.updatedAt === user.updatedAt.toISOString()) {
                res.status(200);
                res.json({
                    message: 'Benutzer ist aktuell!'
                });
                return;
            }
            // If user isn't updated
            res.status(401).json({
                message: 'Ihr Account hat sich auf einem anderen Gerät geändert! Melden sie sich erneut an!'
            });
            return;
        }
        // If no user was found
        res.status(401).json({
            message: 'Keinen Benutzer gefunden!'
        });
    })(req, res);
};
