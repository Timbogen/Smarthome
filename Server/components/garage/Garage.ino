
  #include "WiFi.h"
  #include "aREST.h"

  aREST rest = aREST();
  WiFiServer server(80);

  // WiFi Data
  const char* ssid = "FRITZ!Box 7590 MK";
  const char* password = "95691310590294964183";
  const char* id = "sensor_2";
  const char* restName = "Garage Sensor";

  // Pins
  const int ONBOARD_LED = 2;
  const int LEFT_SWITCH = 12;

  // Button Data
  // false means that the garage is open
  bool doorOneOpen = false;
  bool doorTwoOpen = false;
  
  void setup() {

    // Open up the serial connection
    Serial.begin(115200);

    // Initialize the pins
    pinMode(ONBOARD_LED, OUTPUT);
    pinMode(LEFT_SWITCH, INPUT);
    
    // Setup the rest api
    rest.variable("doorOneOpen", &doorOneOpen);
    rest.variable("doorTwoOpen", &doorTwoOpen);
    rest.set_id(id);
    rest.set_name(restName);
    rest.function("test", testFunction);

    // Setup the WiFi settings
    WiFi.begin(ssid, password);
    WiFi.enableSTA(true);
    WiFi.setSleep(false);

    // Check the connection
    Serial.print("Connecting");
    for(int i = 0; WiFi.status() != WL_CONNECTED && i <= 10; i++) {
      delay(500);
      Serial.print(".");
      if (i == 10) {
        Serial.println("");
        Serial.println("Couldn't connect to the given WiFi ... Restarting!");
        ESP.restart();
      }
    }

    // Light up the onboard-led
    digitalWrite(ONBOARD_LED, HIGH);

    // Start the server
    Serial.println("WiFi connected with IP: ");
    Serial.println(WiFi.localIP());
    server.begin();
  }
  
  void loop() {

    // Check if the garages are closed 
    if (digitalRead(LEFT_SWITCH) == HIGH) {
      Serial.println("HIGH");
    } else {
      Serial.println("LOW");
    }

    // Check if the board is still connected
    if (WiFi.status() == WL_CONNECTED) {
     WiFiClient client = server.available();
     if (client) {
       while(!client.available()){
        delay(5);
       }
       rest.handle(client);
     }
    // If the board lost the connection just restart   
    } else {
      Serial.println("");
      Serial.println("Lost Connection to WiFi ... Restarting!");
      ESP.restart();
    }
  }

  int testFunction(String command) {

    Serial.println("Received rest request");
  }
