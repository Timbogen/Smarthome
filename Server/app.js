// Imports
const express = require('express');
const uuid = require('uuid/v4');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const path = require('path');
const forceSsl = require('express-force-ssl');
const http = require('http');
const https = require('https');
const fs = require('fs');
require('dotenv').config();
// Setup the database
require('./api/models/db');
require('./api/config/passport');
const restController = require('./controllers/restController');
const routesApi = require('./api/routes/index');

// Certificate
/*const privateKey = fs.readFileSync('/etc/letsencrypt/live/smarthomeniederer.ddns.net/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/smarthomeniederer.ddns.net/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/smarthomeniederer.ddns.net/chain.pem', 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
};*/

// Setup the server
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//app.use(forceSsl);
app.use(express.static(path.join(__dirname, 'public'), {dotfiles: 'allow'}));

// Setup passport
app.use(passport.initialize());
app.use('/api', routesApi);

// error handler
// Catch unauthorised errors
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401);
        res.json({
            message: "Sie sind nicht authorisiert! Melden sie sich zuerst an!"
        });
    }
})

// Setup the rest api
restController(app, http, passport);

// Start the server
http.createServer(app).listen(process.env.HTTP_PORT, () =>
    console.log('Server is running on ' + process.env.HTTP_PORT)
);
//https.createServer(credentials, app).listen(process.env.HTTPS_PORT, () =>
//     console.log('Server is running on ' + process.env.HTTPS_PORT)
// );
