from flask import Flask, jsonify, request, Response
from flask_cors import CORS
import cv2

import random
from threading import Thread
import time

#STATUS CODE : https://flask-api.github.io/flask-api/api-guide/status-codes/

#First we create call the Flask framework and create a secret password.
#Then create socketio variable where cors_allowed_origin = * to acept communication with other domains.
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
CORS(app)

drone_lat = 48.01892231026212;
drone_lng = 0.15759050846099854;

data = [i for i in range(0, 100)]
def GetTemperature(data):
    return random.choice(data), random.choice(data)

"""******************  Web API section  ****************"""

#This is the api that we can run by calling http://ip:5000/api/
#this API is called from the Angular client

@app.route('/api/connection')
def connect():
    print('Connection request accepted')
    return jsonify({"result":"success"})

@app.route('/api/mission', methods=['POST'])
def cretate_mission():
    data = request.get_json()
    print(data)
    response = {"ok": True, "mission":data}
    return jsonify(response)

def launch_mission():
    action = request.args.get('launch')
    missionId = request.args.get('id_mission')
    print(action)
    #perform actions
    response = {"ok": True}
    return jsonify(response)

@app.route('/api/startPosition', methods=['GET'])
def get_data():
    dronePosition = {"lat":drone_lat, "lng":drone_lng}
    return jsonify(dronePosition)

@app.route('/api/', methods=['GET'])
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

camera = cv2.VideoCapture(0)
def gen_frames():
    while True:
        success, frame = camera.read()  # read the camera frame

        resize = cv2.resize(frame, (500, 200))
        if not success:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', resize)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')  # concat frame one by one and show result

@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

#This is the function that will create the Server in the ip host and port 5000
if __name__ == "__main__":
    print("Starting The Drone_Server ...")
    app.run(debug=True)
    spellcheck="false"
