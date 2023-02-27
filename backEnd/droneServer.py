from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
#import cv2
import service.videoService as videoService
import service.missionService as missionService
#import RPi.GPIO as GPIO

import random
from threading import Thread
import time

#STATUS CODE : https://flask-api.github.io/flask-api/api-guide/status-codes/

#First we create call the Flask framework and create a secret password.
#Then create socketio variable where cors_allowed_origin = * to acept communication with other domains.
app = Flask(__name__)
app.app_context().push() #if not the database w'ont be created

#SQLite gatabase setting
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///dronex.db'
app.config['SECRET_KEY'] = 'secret!'
CORS(app)
db = SQLAlchemy(app)

class Mission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    start= db.Column(db.String(100), nullable=False)
    destination = db.Column(db.String(1000), nullable=False)

    def __repr__(self):
        return f'<Mission start: {self.start}, destinations:{self.destination}>'

class DroneData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    batteryVoltage = db.Column(db.Float)
    heading=db.Column(db.Float)
    pitch=db.Column(db.Float)
    roll=db.Column(db.Float)

    def __repr__(self):
        return f'<Mission {self.batteryVoltage}>'

drone_lat = 48.01892231026212;
drone_lng = 0.15759050846099854;

"""******************  Web API section  ****************"""

#This is the api that we can run by calling http://ip:5000/api/
#this API is called from the Angular client

""" Drone data section  """

@app.route('/api/droneData/last', methods=['GET'])
def get_most_recent_droneData():
    droneData = DroneData.query.order_by(DroneData.id.desc()).first()
    return jsonify({
    'id': droneData.id,
    })

@app.route('/api/droneData', methods=['GET'])
def get_all_droneData():
    droneData = DroneData.query.all()
    response = {'droneData': []}
    for data in droneData:
        response['droneData'].append({
            'id': data.id,
            'battery':data.batteryVoltage
        })
    return jsonify(response)

@app.route('/api/droneData', methods=['POST'])
def add_droneData():
    batteryVoltage = request.json['battery']

    new_data = DroneData(batteryVoltage=(batteryVoltage))
    db.session.add(new_data)
    db.session.commit()

    return jsonify({'message': 'DroneData added successfully!'})

""" End drone data section  """

# connection between the front-end and the drone
@app.route('/api/connection')
def connect():
    #blink_led(ledPin=8, delay=5)
    return missionService.connect()

# get the drone start position
@app.route('/api/startPosition', methods=['GET'])
def getStartPosition():
    return missionService.getStartPosition()

# add a new mission
@app.route('/api/mission', methods=['POST'])
def addMission():
    return missionService.addMission(db,Mission)

# get all the misions
@app.route('/api/mission', methods=['GET'])
def get_all_missions():
    return missionService.get_all_missions(Mission)

# launch a mission
@app.route('/api/mission/launch', methods=['POST'])
def launchMission():
    return missionService.launchMission()



# execute quick actions with the drone
@app.route('/api/drone', methods=['GET'])
def quickAction():
    action = request.args.get('action')
    print(action)
    if action=="takeOff":
        response = {"action":'takeOff', "response":'ok'}
        #perform actions
        return jsonify(response)
    elif action=="land":
        response = {"action":"land", "response":"ok"}
        #perform actions
        return jsonify(response)

    elif action=="rth":
        response = {"action":"return_to_home", "response":"ok"}
        #perform actions
        return jsonify(response)
    else:
        response ={"error":"Action not found", "response":"error"}
        return jsonify(response)



@app.route('/video_feed')
def video_feed():
    return videoService.video_feed()

def blink_led(ledPin, delay):
    t=0
    while t<delay: # Run forever
        GPIO.output(ledPin, GPIO.HIGH) # Turn on
        time.sleep(1)                  # Sleep for 1 second
        GPIO.output(ledPin, GPIO.LOW)  # Turn off
        time.sleep(1)                  # Sleep for 1 second
        t+=1

#This is the function that will create the Server in the ip host and port 5000
if __name__ == "__main__":
    # Create the database tables
    db.create_all()
    missionService.printDataBase(Mission)
    print("Starting The Drone_Server ...")
    app.run(debug=True, port=5000, host='0.0.0.0')
    spellcheck="false"
