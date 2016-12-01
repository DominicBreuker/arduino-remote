# Arduino Remote

Control your plug connectors with your voice.
You only need an Arduino and the Chrome Browser.
And, of course, some radio plugs, a 433 MHz emitter and some creativity.

## How to use it

You can run a little web server to serve a remote control for your Radio plugs.
With integrated speech recognition, you can control your electronic devices at home with your voice.
For instance, configure your web server to turn lights on and off when you say "Turn lights on" or "Turn lights off". See this example video:

<a href="http://www.youtube.com/watch?feature=player_embedded&v=Bc53nK9u0qA" target="_blank"><img src="http://img.youtube.com/vi/Bc53nK9u0qA/0.jpg"
alt="IMAGE ALT TEXT HERE" width="240" height="180" border="10" /></a>

## Overview and setup

The basic setup starts with your laptop running a small Flask server.
The website it serves integrates a speech recognition library [Annyang](https://github.com/TalAter/annyang) which you can program to listen to voice commands.
Under the hood, it uses the [Web Speech API](https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html) to transcribe voice to text.
Open the site with Chrome and you will get pretty solid performance due to Google backend.
When the server recognizes a voice command (or alternatively, the boring press of a button), it sends a request to the Arduino through a serial connection.
It contains a binary code specifying a radio plug and it's desired state.
The Arduino will translate it into a 433 MHz signal and send it via the connected emitter.

Hardware you will need:
- A laptop with microphone
- [Arduino board](https://www.arduino.cc/)
- Radio plugs: https://www.amazon.de/gp/product/B00KM83Q1U
- 433 MHz emitter: http://www.miniinthebox.com/de/433mhz-funk-sendemodul-superregenerationsschaltung-fuer-arduino-gruen_p411875.html
- 433 MHz receiver: http://www.miniinthebox.com/de/diy-433mhz-drahtlose-empfangsmodul-fuer-arduino-gruen_p411878.html

## How to configure it

### Configure web server

#### Connect Arduino

Web server code lives mostly in `app.py`.
Upon startup, it connects via serial to the Arduino like this: `arduino = serial.Serial('/dev/tty.usbmodem1411', 9600, timeout=.1)`.
For me, the device is `/dev/tty.usbmodem1411`.
You will have to identify what the device is on your machine and put it's name there.
It can be done by doing `ls /dev` before and after plugging in the Arduino and comparing the two lists.

#### Configure buttons

In `templates/send.html`, you will find the buttons for your remote.
You can add/remove buttons here.
More importantly though, you can configure the buttons' codes here.
The codes are the values of each button's hidden field.
For example, this is a button turning my radio plug A on:
```html
<form action="{{ url_for('send') }}" id="a_on" method=post>
  <input type="hidden" name="code" value="000010111101">
  <input type="submit" class="myButton" value="A - ON">
```
It send the code `000010111101` as specified in the hidden field.
See below for how to find out which code to send.

#### Configure voice commands

Voice commands are defined at the bottom of `static/remote.js`.
This file defines a list of `commands` and associates a button with each.
For instance, I have configured two commands turning radio plug D on and off:
```javascript
var commands = {
  'turn lights on': function() { $("#d_on .myButton").click(); },
  'turn lights off': function() { $("#d_off .myButton").click(); },
};
```

### Finding the right codes for your radio plugs

Here comes the tricky part.
Your Arduino has to translate a binary code to a continuous signal that your radio plugs can understand.
Unfortunately, radio plugs don't come with a manual for this.
You will have to do some reverse engineering to find the code.

This is why you will also need a 433 MHz receiver.
You could connect it to your Arduino and program it to record the signal, but there is a quicker way.
Just connect the 433 MHz receiver to an audio jack and plug it into your laptop's microphone in.
Then use a tool like [Audacity](http://www.audacityteam.org/) to record the signal while your press the buttons on the remote that comes with your radio plugs.
Your goal is to reproduce this signal with the Arduino.

#### Finding out what 0 and 1 are

Fortunately, there is usually no encryption or anything so the code it pretty simple.
For me, it looked a lot like in the pictures from this very good [article](http://www.nrocy.com/2014/08/02/mimicking-rf-remote-light-signals-with-arduino/) from Paul King:
![Here should be an image from the article](http://www.nrocy.com/images/signal-pwm.png)
The code above is almost binary already, consisting of either a "fat" or "thin" pulse.
Checking out the timing on Audacity's time scale is then enough to code up the signal emitter.

For me, the encoding was a bit more involved, as each byte was preceded by a particular pattern to separate different bytes. My signal emitter thus produced a "0" by 400 ms pulse, followed by 850 ms silence, repeated twice. A "1" was produced by a 400ms pulse, 850 ms silence, followed by a 900 ms pulse and 350 ms silence.

The code for a "0" is therefore:
```c
digitalWrite(RC,HIGH);
delayMicroseconds(400);

digitalWrite(RC,LOW);
delayMicroseconds(850);

digitalWrite(RC,HIGH);
delayMicroseconds(400);

digitalWrite(RC,LOW);
delayMicroseconds(850);
```

Similarly, the code for a "1" is:
```c
digitalWrite(RC,HIGH);
delayMicroseconds(400);

digitalWrite(RC,LOW);
delayMicroseconds(850);

digitalWrite(RC,HIGH);
delayMicroseconds(900);

digitalWrite(RC,LOW);
delayMicroseconds(350);
```


#### Finding out what the code is

From here, is is pretty simple.
For each button, just encode the signal you receive in form of 0 and 1.
Then program the Arduino to send an entire sequence of 0s and 1s.

A full example is in `arduino/emitter/emitter.ino`
