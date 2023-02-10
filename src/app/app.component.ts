  import { IDroneInfo } from './models/drone-info';
  import { GpsPositionService } from './services/gps-position.service';
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
  @Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
  })

  export class AppComponent {
    title = 'droneapp';
    // icons
    faPlusCircle = faPlusCircle;
    faCamera = faCamera;
    onOffIcon:IconProp = ['fas', 'power-off'];

    constructor(
      private gpsPositionService: GpsPositionService,
      private utils: UtilityService,
      private socket: WebSocketService
    ) { }

    private socketio: any;
    public temperature:any;
    public humidity: string | undefined;
    public droneConnected: boolean;
    gps: any | undefined
    res: any;
    alertMsg: string;
    alertType: string;
    isDroneConnected: any;

    nbDestination: number;
    showAlert: boolean;
    showSendAlert:boolean;
    pathDistance: number;
    flightTime: string;

    /********************** map settings ***************/
    lat = 48.01892231026212;
    lng = 0.15759050846099854;
    startMarkerOpacity = 0.8;
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

    mission:IMission = {
      start: [this.lat, this.lng], destinations: [],
      distance: 0,
      flight_time: 0,
      title: ''
    }
    missions:any=[]


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
  showMission:any = true;
  showDroneInfo:any = false;
  showManual:any= false;

  videoUrl ="";

    async connectSocket() {
      this.connectDrone();
      //this.setReceiveDroneData();
    }




    /*************************************** Methods *************************************************/

    cameraOnOff() {
      if (this.videoUrl=="") {
        this.videoUrl="http://localhost:5000/video_feed";
      }
      else{
        this.videoUrl="";
      }
    }
    displayMission():void {
      this.showMission=true;
      this.showDroneInfo=this.showManual=false;
    }
    displayDroneInfo():void {
      this.showDroneInfo=true;
      this.showManual=this.showMission=false;
    }
    displayManual():void {
      this.showManual=true;
      this.showDroneInfo=this.showMission=false;
    }

    onChosenLocation($event: any): void {
      let droneMeanSpeed = 40; //km/h
      //this.markers.shift(); // keep atmost 2 markers on the map
      let chosen_lat = $event.coords.lat;
      let chosen_lng = $event.coords.lng;


      this.droneItinerary.push([chosen_lat, chosen_lng]);
      this.mission.destinations.push([chosen_lat, chosen_lng]);
        /**Add a mission to the list of missions */


      /**distance calculation */
      this.pathDistance = this.utils.getDistance(this.droneItinerary).toFixed(2);

      /**flight time calculation */
      if (this.utils.calcFightTime(this.pathDistance, droneMeanSpeed).toFixed(2) < 100) {
        this.flightTime = this.utils.calcFightTime(this.pathDistance, droneMeanSpeed).toFixed(2) + " min";
      }
      else {
        this.flightTime = (this.utils.calcFightTime(this.pathDistance, droneMeanSpeed) / 60).toFixed(2) + " h";
      }
      this.nbDestination = this.droneItinerary.length - 1;
      //console.log(this.droneItinerary);

      // add a marker to the list of markers
      this.addMarker(this.markers, chosen_lat,chosen_lng);

      //update destination input
      this.destinationInput = `${chosen_lat.toFixed(6)}, ${chosen_lng.toFixed(6)}`
      this.mission.destinations= this.droneItinerary;
      this.mission.flight_time = +this.flightTime.split(" ")[0];
      this.mission.distance= this.pathDistance;
      this.mission.title= `${this.mission.distance}km| ${this.mission.flight_time}min`
    }


    async sendMissionInfo() {
      if(this.isDroneConnected=="success"){
        this.missions.push(this.mission);
        this.gpsPositionService.getStartPosition();
        this.itineraryForm.patchValue({
          destination: this.destinationInput
        })
        console.warn(this.mission)
        //console.warn(this.itineraryForm.value);
        //this.res = await this.gpsPositionService.sendMissionInfo(this.itineraryForm.value);
        this.res = await this.gpsPositionService.sendMissionInfo(this.missions);
        console.warn(this.res);
        [this.showSendAlert, this.alertMsg, this.alertType] = this.utils.setSendAlert(this.res.ok);
        //console.log("**",this.alertMsg);
        console.warn(this.missions)
        //this.missions.splice(0);
      }

      else{
        this.connectDrone();
      }

    }
    deleteMission(mission: any){
      this.missions.forEach((element: any,index: any)=>{
        if(element==mission) this.missions.splice(index,1);
     });
    }

    clearItinerary() {
      this.droneItinerary.splice(1);
      this.nbDestination = 0;
      this.destinationInput = ""
      this.markers.splice(0);
      this.flightTime = "-";
      this.pathDistance = 0;
    }

    addMarker(marker:Array<IMarker>,chosen_lat:number,chosen_lng:number):void {
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
      //this.socketio = io.io(environment.WEB_SOCKET);
      this.res = await this.socket.iniServerSocket();
      this.isDroneConnected = this.res.result;

      [this.showAlert, this.alertMsg, this.alertType] = this.utils.setConnectionAlert(this.res.result);
      //console.log("***********", this.alertMsg);

    }

    setReceiveDroneData() {
      this.socketio.on('data-tmp', (data: { temperature: string; humidity: string | undefined; }) => {
        console.log("***********",data);
        this.temperature = data.temperature;
        this.humidity = data.humidity;
        this.gps = +(this.humidity + this.temperature);
      });
    }

    sendMessage() {
      this.socketio.emit('disconnect', 'Hi-flask');
    }

    onDismissConnectionAlert() {
      this.showAlert = false;
    }
    onDismissSendAlert() {
      this.showSendAlert = false;
    }

  }

  interface IMission{
    start:number[];
    destinations:any[];
    distance:number;
    flight_time:number;
    title:string;
  }

