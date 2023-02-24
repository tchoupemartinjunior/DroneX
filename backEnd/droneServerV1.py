from flask import Flask, jsonify, request,render_template
import flask
from flask_restful import Resource, Api, marshal_with
from flask_cors import CORS
from flask_socketio import SocketIO,emit,send

import random
from threading import Thread
import time
 
 
#First we create call the Flask framework and create a secret password.
#Then create socketio variable where cors_allowed_origin = * to acept communication with other domains.
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
CORS(app)
socketio = SocketIO(app, cors_allowed_origins='*')
thread = None
clients = 0
drone_lat = 48.01892231026212;
drone_lng = 0.15759050846099854;

data = [i for i in range(0, 100)]
def GetTemperature(data):
    return random.choice(data), random.choice(data)
    
 
 

"""******************  Web API section  ****************"""
 
#This is the api that we can run by calling http://ip:5000/api/socket
#this API is called from the Angular client and it creates a separate thread from the main thread
#and executess the function ini_socket.

@app.route('/api/socket')
def index():
    print('Route socket init')
    global thread
    if thread is None:
        thread = Thread(target=ini_socket)
        thread.start()
    return jsonify({"result":"success"})

@app.route('/api/gps', methods=['POST'])
def post_data():
    data = request.get_json()  # parses the JSON data sent in the request body
    # You can access the individual fields in the data by using the keys.
    # Do some processing or storing data
    print(data)
   
    # Prepare the response
    response = {"ok": True}
    return jsonify(response)

@app.route('/startPosition', methods=['GET'])
def get_data():
    dronePosition = {"lat":drone_lat, "lng":drone_lng}
    return jsonify(dronePosition)


"""******************  Websocket section  ****************"""
#Function that calls the BeagleBone class that is in charged of reading the temperature sensor
def ini_socket():
    global clients,thread
    while clients>=0:
        print('Sending data from WebSocket, numClientes: {0}'.format(clients)) 
        b,c=GetTemperature(data)
        print (b,c)
        print('sending Data: temp: {0}, hum: {1}'.format(b,c))
        socketio.emit('data-tmp', {'temperature': b, 'humidity':c})
        time.sleep(1)
       
    thread = None #we restore the thread so it can be used again
 
#Function that runs when a clients get connected to the server
@socketio.on('connect')
def test_connect():
    global clients
    clients += 1
    print('Client connected test')
 
 
#Read data from client
@socketio.on('new-message')
def handle_message(message):
    print('received message' + message)
    send_data()
 
 
#Send data to client
@socketio.on('new-message-s')
def send_data():
    b = GetTemperature(data)
    print('sending Data: temp: {0}, hum: {1}'.format(b.temperature,b.humidity))
    emit('data-tmp', {'temperature': b.temperature, 'humedity':b.humidity})
 
 
@socketio.on('disconnect')
def test_disconnect():
    global clients
    clients -= 1
    print('***************************Client disconnected*****************************************')
 
 
#This is the function that will create the Server in the ip host and port 5000
if __name__ == "__main__":
    print("starting webservice")
    socketio.run(app,debug=True)
    spellcheck="false"