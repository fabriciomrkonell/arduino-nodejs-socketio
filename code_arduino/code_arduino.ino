#include <SPI.h>
#include <Ethernet.h>

byte mac[] = { 0x90, 0xA2, 0xDA, 0x00, 0x6C, 0xFE };
IPAddress ip(192,168,0,225);
IPAddress server(192,168,0,3);

int buzzer = 8;
int pinVal = 0;

EthernetClient client;

void setup() {
  Ethernet.begin(mac, ip);
  Serial.begin(9600);
  delay(1000);
  Serial.println("Conectando...");
  if (client.connect(server, 1337)) {
    Serial.println("Conectado.");
  } else {
    Serial.println("Erro: Conexo falhou.");
  }
  pinMode(buzzer, OUTPUT);
}

void loop() {
  if (client.available()) {
    char c = client.read();
    Serial.print(c);
    if (c == '1') {
      pinVal = HIGH;
//      client.print('1');
    } else if (c == '0') {
      pinVal = LOW;
  //    client.print('0');
    }
    digitalWrite(buzzer, pinVal);
  }

}
