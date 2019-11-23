const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');

passport.use(new LocalStrategy({
        usernameField: 'email'
    },
    (username, password, done) => {
        User.findOne({email: username}, (err, user) => {
            // Check if db throws an error
            if (err) {
                return done(null, false, {
                    message: "Datenbank hatte einen unbekannten Fehler!"
                });
            }
            // If user was not found by email try it with the username
            if (!user || !user.validPassword(password)) {
                User.findOne({username: username}, (err, user) => {
                    // If an error occurs just pass it
                    if (err) return done(err);
                    // If user not found in db return
                    if (!user || !user.validPassword(password)) {
                        return done(null, false, {
                            message: 'E-Mail/Benutzername/Passwort unbekannt!'
                        });
                    }
                    // If credentials match an entry return the user
                    return done(null, user);
                })
            } else {
                // If credentials match an entry return the user
                return done(null, user);
            }
        })
    }
))
