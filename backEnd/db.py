from droneServer import *
def printDataBase(data):
    missions = data.query.all()
    for mission in missions:
        print(mission)

printDataBase(Mission)