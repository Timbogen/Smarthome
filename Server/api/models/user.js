const roles = require('../models/roles');
const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const uniqueValidator = require('mongoose-unique-validator');

/**
 * Data schema for the mongoDB
 */
const userSchema = new mongoose.Schema({
        email: {
            type: String,
            unique: true,
            required: true
        },
        username: {
            type: String,
            unique: true,
            required: true
        },
        role: {
            type: String,
            required: true
        },
        hash: String,
        salt: String
    },
    {
        timestamps: true
    });

/**
 * Set a password for an user
 * @param password of the user
 */
userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

/**
 * Check if a password is valid
 * @param password of the user
 * @returns {boolean} true if the password matches
 */
userSchema.methods.validPassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
}

/**
 * Checks if a user has the known state
 * @returns {boolean} true if user is either ranked as admin or as member
 */
userSchema.methods.isKnown = function () {
    return this.role === roles.ADMIN || this.role === roles.MEMBER;
}

/**
 * Method to generate a web token
 */
userSchema.methods.generateJwt = function () {
    // Get the current date
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    // Return the token
    return jwt.sign({
        _id: this._id,
        email: this.email,
        role: this.role,
        exp: parseInt(expiry.getTime() / 1000)
    }, process.env.SECRET)
};

// Add the unique validator as a plugin
mongoose.plugin(uniqueValidator);

// Add the model
mongoose.model('User', userSchema);
