import serial, time
from sys import stdin

arduino = serial.Serial('/dev/tty.usbmodem1411', 9600, timeout=.1)

time.sleep(2)

while True:
    print "Say something:"
    user_input = stdin.readline()
    arduino.write(user_input)
    time.sleep(2)
    while
    echo = arduino.readline()
    if echo:
        print "Ardunio says: "
        print echo.rstrip('\n')