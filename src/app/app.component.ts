import { GpsTrackerService } from './services/gps-tracker.service';
import { IDroneInfo } from './models/drone-info';
import { MissionService } from './services/mission.service';
import { Component } from '@angular/core';
import { faPlusCircle, faCamera } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilityService } from './services/utility.service';
import { IPosition, Position } from './models/position';
import { IMarker } from './models/marker';
import * as io from 'socket.io-client';
import { WebSocketService } from './services/web-socket.service'
import { environment } from 'src/environments/environment';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Mission } from './models/mission';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'droneapp';

  onOffIcon: IconProp = ['fas', 'power-off'];
  cameraIcon: IconProp = ['fas', 'video-slash'];

  constructor(
    private missn: MissionService,
    private utils: UtilityService,
    private socket: WebSocketService,
    private gpsTracker:GpsTrackerService
  ) { }

  public temperature: any;
  public humidity: string | undefined;
  public droneConnected: boolean;
  res: any;
  alertMsg: string;
  alertType: string;
  isDroneConnected: any = "";

  nbDestination: number;
  showAlert: boolean;
  showSendAlert: boolean;
  pathDistance: number;
  flightTime: string;

  /********************** map settings ***************/
  lat = 48.01892231026212;
  lng = 0.15759050846099854;
  zoom = 15;
  // polyline settings
  polyline = {
    strokeColor: "#07777a",
    strokeWeight: 4
  }

  //marker elements
  mapClickListener: any;
  map: google.maps.Map<Element> | undefined;
  markers: IMarker[] = [];

  // drone start position
  droneStartPosition: IPosition = { lat: this.lat, lng: this.lng };// ='' if drone not connected
  droneDestination!: IPosition;

  //destination input
  droneStartInput: String = this.utils.positionToString(this.droneStartPosition);
  destinationInput: string = "";

  missions: any = []


  //drone itinerary form
  itineraryForm = new FormGroup({
    start: new FormControl(this.droneStartInput, [Validators.required]),
    destination: new FormControl('', [Validators.required])
  });

  get start() {
    return this.itineraryForm.get('start');
  }
  get destination() {
    return this.itineraryForm.get('destination')
  }

  droneItinerary = [
    [this.lat, this.lng]
  ];


  /***Sidebar Navigation Menu display variables */
  showMission: any = true;
  showDroneInfo: any = false;
  showManual: any = false;
  innerMenuStyle: any = { mission: "btn btn btn-dark", droneInfo: "btn btn btn-outline-dark", manual: "btn btn btn-outline-dark" }

  videoUrl = "";

  /*************************************** Methods *************************************************/
  async connectSocket() {
    this.connectDrone();
    //this.setReceiveDroneData();
  }

  cameraOnOff() {
    if (this.videoUrl == "") {
      this.videoUrl = "http://localhost:5000/video_feed";
      this.cameraIcon = ['fas', 'video'];
    }
    else {
      this.videoUrl = "";
      this.cameraIcon = ['fas', 'video-slash'];
    }
  }
  displayMission(): void {
    this.showMission = true;
    this.showDroneInfo = this.showManual = false;
    this.innerMenuStyle = { mission: "btn btn btn-dark", droneInfo: "btn btn btn-outline-dark", manual: "btn btn btn-outline-dark" }
  }
  displayDroneInfo(): void {
    this.showDroneInfo = true;
    this.showManual = this.showMission = false;
    this.innerMenuStyle = { mission: "btn btn btn-outline-dark", droneInfo: "btn btn btn-dark", manual: "btn btn btn-outline-dark" }

  }
  displayManual(): void {
    this.showManual = true;
    this.showDroneInfo = this.showMission = false;
    this.innerMenuStyle = { mission: "btn btn btn-outline-dark", droneInfo: "btn btn btn-outline-dark", manual: "btn btn btn-dark" }

  }

  onChosenLocation($event: any): any {
    this.parseArray();
    let droneMeanSpeed = 40; //km/h
    //this.markers.shift(); // keep atmost 2 markers on the map
    let chosen_lat = $event.coords.lat;
    let chosen_lng = $event.coords.lng;

    this.droneItinerary.push([chosen_lat, chosen_lng]);

    /**distance calculation */
    this.pathDistance = this.utils.getDistance(this.droneItinerary).toFixed(1);

    /**flight time calculation */
    if (this.utils.calcFightTime(this.pathDistance, droneMeanSpeed).toFixed(2) < 100) {
      this.flightTime = this.utils.calcFightTime(this.pathDistance, droneMeanSpeed).toFixed(1) + " min";
    }
    else {
      this.flightTime = (this.utils.calcFightTime(this.pathDistance, droneMeanSpeed) / 60).toFixed(1) + " h";
    }
    /** calculate the number of destinatios*/
    this.nbDestination = this.droneItinerary.length - 1;
    //console.log(this.droneItinerary);

    // add a marker to the list of markers
    this.addMarker(this.markers, chosen_lat, chosen_lng);

    //update destination input
    this.destinationInput = `${chosen_lat.toFixed(6)}, ${chosen_lng.toFixed(6)}`

  }


  async sendMissionInfo() {
    let flight_time = +this.flightTime.split(" ")[0];
    let mission: Mission = new Mission([this.lat, this.lng], this.droneItinerary, this.pathDistance, flight_time, `${this.pathDistance}km| ${flight_time}min`);

    if (this.isDroneConnected == "success") {
      this.missions.push(mission);
      this.missn.getStartPosition();
      this.res = await this.missn.sendMissionInfo(mission);
      console.warn(this.res);
      [this.showSendAlert, this.alertMsg, this.alertType] = this.utils.setSendAlert(this.res.ok);
      console.warn(this.missions)
    }

    else {
      this.connectDrone();
    }

  }

  deleteMission(mission: any) {
    this.missions.forEach((element: any, index: any) => {
      if (element == mission) this.missions.splice(index, 1);
    });
  }

  async launchMission(mission: any) {
    this.missions.forEach(async (element: any, index: any) => {
      if (element == mission) {
        this.res = await this.missn.launchMission(mission);
        console.warn(this.res);
        this.showAlert = true;
        this.alertType = "success";
        this.alertMsg = "D??marrage en cours ...";
      }
    });

  }
  async droneTakeOff() {
    if (this.isDroneConnected == "success") {
      this.res = await this.missn.takeOff();
      console.warn(this.res);
      this.alertMsg = "D??collage en cours ...";
    }
    else {
      this.connectDrone();
    }
  }

  clearItinerary() {
    this.droneItinerary.splice(1);
    this.nbDestination = 0;
    this.destinationInput = ""
    this.markers.splice(0);
    this.flightTime = "-";
    this.pathDistance = 0;
  }

  addMarker(marker: Array<IMarker>, chosen_lat: number, chosen_lng: number): void {
    marker.push({
      lat: chosen_lat,
      lng: chosen_lng,
      draggable: true,
      opacity: 1
    });
  }

  onCloseAlert(): void {
    this.showAlert = false;
  }

  async connectDrone() {

    this.res = await this.socket.initServer();
    this.isDroneConnected = this.res.result;
    [this.showAlert, this.alertMsg, this.alertType] = this.utils.setConnectionAlert(this.res.result);

  }

  setReceiveDroneData() {
    let droneData = this.gpsTracker.getDroneData();
    console.log(droneData);
  }

  onDismissConnectionAlert() {
    this.showAlert = false;
  }
  onDismissSendAlert() {
    this.showSendAlert = false;
  }
  parseArray() {
    let array = {
      "missions": [
        {
          "destination": "[[48.01892231026212, 0.15759050846099854], [48.02789466930072, 0.13882074505090714], [48.022757034490446, 0.13946447521448135], [48.02353201778885, 0.1537982001900673]]",
          "id": 1,
          "start": "[48.01892231026212, 0.15759050846099854]"
        }
      ]
    }
    array['missions'].forEach(mission => {
      mission.destination = JSON.parse(mission.destination).map((coord: string[]) => coord.map(parseFloat));
      mission.start = JSON.parse(mission.start).map(parseFloat);
      console.log(mission.destination)
    });


  }
}
