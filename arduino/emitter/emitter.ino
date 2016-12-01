short RC = 12;
short LED = 13;

void setup() {
  Serial.begin(9600);
  pinMode(RC, OUTPUT);
  pinMode(LED, OUTPUT);
}

void loop() {
  if(Serial.available() > 0) {
    // parse code from serial
    String str = Serial.readStringUntil(32);
    char data[str.length()+1];
    str.toCharArray(data, str.length()+1);
    // send code
    sendCode(data);
    // light up LED for debugging
    digitalWrite(LED, HIGH);
    delay(500);
    digitalWrite(LED, LOW);
  }
}

boolean sendCode(char code[]){
  for(short z = 0; z<4; z++){ 
    for(short i = 0; i<12; i++){ 
      sendByte(code[i]);
    }
    digitalWrite(RC,HIGH);
    delayMicroseconds(400);
        
    digitalWrite(RC,LOW);
    delayMicroseconds(9600);
  }
  return true;
}
void sendByte(char i) { 
  switch(i){
    case '0':{ 
      digitalWrite(RC,HIGH);
      delayMicroseconds(400);
      
      digitalWrite(RC,LOW);
      delayMicroseconds(850);
      
      digitalWrite(RC,HIGH);
      delayMicroseconds(400);
      
      digitalWrite(RC,LOW);
      delayMicroseconds(850);
      
      return;
    }
    case '1':{ 
      digitalWrite(RC,HIGH);
      delayMicroseconds(400);
      
      digitalWrite(RC,LOW);
      delayMicroseconds(850);
      
      digitalWrite(RC,HIGH);
      delayMicroseconds(900);
      
      digitalWrite(RC,LOW);
      delayMicroseconds(350);
      
      return;
    }
  }
}
