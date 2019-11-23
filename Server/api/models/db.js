const mongoose = require('mongoose');

// Connect to the database
mongoose.connect('mongodb://' + process.env.DB_HOST, {
    useNewUrlParser: true,
    useFindAndModify: false,
});



// Connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to ' + process.env.DB_HOST);
});
mongoose.connection.on('error', (error) => {
    console.log('Mongoose connection error ' + error);
});
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// Load the models
require('./user');
