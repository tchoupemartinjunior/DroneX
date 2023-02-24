from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import cv2

import random
from threading import Thread
import time
 
#STATUS CODE : https://flask-api.github.io/flask-api/api-guide/status-codes/


drone_lat = 48.01892231026212;
drone_lng = 0.15759050846099854;

def connect():
    print('Connection request accepted')
    return jsonify({"result":"success"})

def getStartPosition():
    dronePosition = {"lat":drone_lat, "lng":drone_lng}
    return jsonify(dronePosition)

def addMission(db1, Mission):
    data = request.get_json()
    print(data)
    print(data['itinerary'])
    #perform actions
    # Add a new user
    new_mission = Mission(start= str(data['itinerary']['start']), destination= str(data['itinerary']['destinations']))
    db1.session.add(new_mission)
    db1.session.commit()
    response = {"ok": True, "mission":data}
    return jsonify(response)


def launchMission():
    #action = request.args.get('launch')
    #missionId = request.args.get('id_mission')
    data = request.get_json()
    print(data)
    response = {"ok": True, "mission_to_launch":data}
    return jsonify(response)

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

def printDataBase(data):
    missions = data.query.all()
    for mission in missions:
        print(mission)

