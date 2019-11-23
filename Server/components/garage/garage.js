/**
 * garage-component-specific data
 * @type {garage}
 */
module.exports = garage;

// Variables
let component = {
    doorOneOpen: false,
    doorTwoOpen: false,
};

function garage(http) {

    // Create a request to the esp32 board in the garage
    let newComponent;
    http.get('http://192.168.178.65:80', (resp) => {

        // Collect the chunk responses
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // Wait for the end of the respond
        resp.on('end', () => {
            newComponent = JSON.parse(data);
        });
    });

    // Now update the given data
    component.doorOneOpen = newComponent.variables.doorOneOpen;
    component.doorTwoOpen = newComponent.variables.doorTwoOpen;
    return component;
}