#include <WiFiS3.h>
#include <Servo.h>

// Your Wi-Fi credentials
char ssid[] = "GIMM-Lab";
char pass[] = "34cP0WwMjdKB71";

// Server we want to contact
char server[] = "18.216.101.113";

WiFiClient client;

Servo myServo;
int const potPin = A0; 
int potVal; 
int angle; 

void setup() {
  Serial.begin(9600);
  
  myServo.attach(9);

  while (!Serial);

  Serial.println("Connecting to Wi-Fi...");

  while (WiFi.status() != WL_CONNECTED) {
    WiFi.begin(ssid, pass);
    delay(1000);
  }

  Serial.println("Connected!");

  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  // Data we want to send
  String jsonData = "{\"temperature\":72.5,\"humidity\":41}";

  Serial.println("Connecting to server...");

  // Change the port number here
  if (client.connect(server, 3000)) {

    Serial.println("Connected to server.");

    // HTTP request
    client.println("POST /api/sensor HTTP/1.1");
    client.println("Host: 34.214.7.173");
    client.println("Content-Type: application/json");

    client.print("Content-Length: ");
    client.println(jsonData.length());

    client.println("Connection: close");
    client.println();

    // HTTP request body
    client.println(jsonData);

  } else {
    Serial.println("Connection failed.");
  }
}

void loop() {

  potVal = analogRead(potPin); 
  Serial.print("potVal: "); 
  Serial.print(potVal);
  angle = map(potVal, 0, 1023, 0, 179);
  Serial.print(", angle: "); 
  Serial.println(angle); 

  myServo.write(angle);
  delay(1000);

  // Display the server response
  while (client.available()) {
    char c = client.read();
    Serial.write(c);
  }

  if (!client.connected()) {
    client.stop();
  }
}