import serial, time
from flask import Flask, flash, redirect, render_template, request, url_for
app = Flask(__name__)
app.secret_key = 'super_secret_key'

@app.route('/')
def hello_world():
    return "Hello World!"

@app.route('/hello')
@app.route('/hello/<name>')
def hello(name = None):
    return render_template('hello.html', name=name)

@app.route('/send', methods = ["GET", "POST"])
def send():
    if request.method == 'POST':
        code = request.form['code']
        if request.is_xhr:
            try:
                arduino.write(code.encode('ASCII'))
                return "You've sent %s" % code
            except serial.serialutil.SerialException:
                return "Error while communicating with Arduino"
        else:
            try:
                arduino.write(code.encode('ASCII'))
                flash("You've sent %s" % code)
            except serial.serialutil.SerialException:
                flash("Error while communicating with Arduino")
            return redirect(url_for('send'))
    else:
        return render_template('send.html')

if __name__ == '__main__':
    app.debug = True
    arduino = serial.Serial('/dev/tty.usbmodem1411', 9600, timeout=.1)
    app.run()