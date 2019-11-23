const jwt = require('express-jwt');
const express = require('express');
const router = express.Router();

// Authentication secret
const auth = jwt({
    secret: process.env.SECRET,
    _userProperty: 'payload'
})

///// Routes /////
const controllerProfile = require('../controllers/profile');
const controllerAuthentication = require('../controllers/authentication');

// User information
router.post('/user/email', auth, controllerProfile.changeEmail);
router.post('/user/username', auth, controllerProfile.changeUsername);
router.post('/user/password', auth, controllerProfile.changePassword);
router.delete('/deleteUser/:_id', auth, controllerProfile.deleteUser);
router.get('/users', auth, controllerProfile.getUsers);
router.put('/user/role', auth, controllerProfile.changeRole)

// Authentication
router.post('/register', controllerAuthentication.register);
router.post('/login', controllerAuthentication.login);
router.post('/update', controllerAuthentication.update);

module.exports = router;
