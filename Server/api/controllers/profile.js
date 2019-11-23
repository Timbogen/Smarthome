const roles = require('../models/roles');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const atob = require('atob');

/**
 * Method to verify a user as an admin
 * @param req request
 * @param res response
 * @param callback function
 */
verifyAdmin = (req, res, callback) => {
    // Get the payload out of the token
    const payload = req.get('Authorization').split('.')[1];
    // Parse the content
    const values = JSON.parse(atob(payload));
    // Check the role
    if (values.role !== roles.ADMIN) {
        res.status(401).send({
            message: 'Für diesen Vorgang werden Administrator Rechte benötigt!'
        });
    } else {
        callback(values);
    }
}

/**
 * Controller for email-changing requests
 * @param req
 * @param res
 */
module.exports.changeEmail = (req, res) => {
    User.findOneAndUpdate({_id: req.body._id}, {email: req.body.newValue}, {new: true}, function (err, user) {
        if (err) {
            res.status(409).send({
                message: 'Diese E-Mail ist bereits in Verwendung!'
            });
            return;
        }
        res.status(200);
        res.json({
            email: user.email,
            updatedAt: user.updatedAt
        })
    });
};

/**
 * Controller for username-changing requests
 * @param req
 * @param res
 */
module.exports.changeUsername = (req, res) => {
    User.findOneAndUpdate({_id: req.body._id}, {username: req.body.newValue}, {new: true}, function (err, user) {
        if (err) {
            res.status(409).send({
                message: 'Dieser Benutzername ist bereits in Verwendung!'
            });
            return;
        }
        res.status(200);
        res.json({
            username: user.username,
            updatedAt: user.updatedAt
        })
    });
};

/**
 * Controller for password-changing requests
 * @param req
 * @param res
 */
module.exports.changePassword = (req, res) => {
    User.findOne({_id: req.body._id}, function (err, user) {
        // Check if db throws an error
        if (err) {
            res.status(404).json({
                message: 'Datenbank hatte einen unbekannten Fehler bei der Suche!'
            });
            return;
        }
        // Check if the old password is valid
        if (!user.validPassword(req.body.oldValue)) {
            res.status(401).send({
                message: 'Altes Passwort ist falsch!'
            })
            return;
        }
        // Otherwise just update the password
        user.setPassword(req.body.newValue);
        // Save the document
        user.save((err) => {
            // Check if db throws an error
            if (err) {
                res.status(404).json({
                    message: 'Datenbank hatte einen unbekannten Fehler beim Speichern!'
                });
                return;
            }
            const token = user.generateJwt();
            res.status(200);
            res.json({
                token: token,
                updatedAt: user.updatedAt
            })
        })
    });
};

/**
 * Controller for deleting a user
 * @param req
 * @param res
 */
module.exports.deleteUser = (req, res) => {
    verifyAdmin(req, res, () =>
        User.findOneAndRemove({_id: req.params._id}, function (err, user) {
            if (err) {
                res.status(404).send({
                    message: 'Datenbank hatte einen unbekannten Fehler beim Löschen!'
                });
                return;
            }
            if (user) {
                res.status(200);
                res.json({
                    message: `Benutzer ${user.username} wurde erfolgreich gelöscht!`
                })
                return;
            }
            res.status(404).send({
                message: 'Datenbank konnte den Benutzer nicht finden!'
            });
        })
    );
};

/**
 * Controller for receiving all users
 * @param req
 * @param res
 */
module.exports.getUsers = (req, res) => {
    verifyAdmin(req, res, (values) =>
        User.find({_id: {$ne: values._id}}, function (err, users) {
            if (err) {
                res.status(404).send({
                    message: 'Datenbank hatte einen unbekannten Fehler beim Löschen!'
                });
                return;
            }
            if (users) {
                // Map the users
                users = users.map((user) => {
                    return {
                        _id: user._id,
                        username: user.username,
                        role: user.role
                    }
                });
                // Send it
                res.status(200);
                res.json(users);
                return;
            }
            res.status(404).send({
                message: 'Keine anderen Benutzer gefunden!'
            });
        })
    );
};

/**
 * Controller for changing the role of a user
 * @param req
 * @param res
 */
module.exports.changeRole = (req, res) => {
    verifyAdmin(req, res, () =>
        User.findOneAndUpdate({_id: req.body._id}, {role: req.body.role}, {new: true}, function (err, user) {
            if (err) {
                res.status(404).send({
                    message: 'Datenbank hatte einen unbekannten Fehler beim Löschen!'
                });
                return;
            }
            res.status(200);
            res.json({
                message: `Die Rolle von Benutzer ${user.username} wurde zu ${user.role} geändert!`,
                role: user.role
            })
        })
    );
};
