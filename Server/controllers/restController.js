/**
 * If restController is exported it returns
 * the function restController
 * @type {restController}
 */
module.exports = restController;

// Constants
const garage = require('../components/garage/garage');

/**
 * restController manages rest api requests
 * @param app express
 * @param https server
 */
function restController(app, https) {

    ///// Handle rest requests /////
    // authentication routes
    // garage route
    app.get('api/garage', (req, res) => {
        // Send back the latest data
        res.send(garage(https));
    });

    // If non of the requests matches the server routes pass the request to the client
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'public/index.html'));
    })
}