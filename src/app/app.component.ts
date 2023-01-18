    import { GpsPositionService } from './services/gps-position.service';
    import { Component } from '@angular/core';
    import { faPlusCircle, faCamera } from '@fortawesome/free-solid-svg-icons';
    import { FormGroup, FormControl, Validators } from '@angular/forms';
    import { UtilityService } from './services/utility.service';
    import { IPosition, Position } from './models/position';
    import {IMarker} from './models/marker';
    import * as io from 'socket.io-client';
    import {WebSocketService} from './services/web-socket.service'
    @Component({
      selector: 'app-root',
      templateUrl: './app.component.html',
      styleUrls: ['./app.component.css']
    })

    export class AppComponent {

      constructor(
        private gpsPositionService: GpsPositionService,
        private utils: UtilityService,
        private socket: WebSocketService
        ) { }

    private socketio: any;
    public temperature: string | undefined;
    public humidity: string | undefined;
    public droneConnected: boolean | undefined;
    gps:any | undefined
    res:any;
    alertMsg:string;
    alertType:string;
    nbDestination:number;
    showAlert:boolean;

    async connectSocket() {
      this.connect();
      this.setReceiveMethod();
      this.res = await this.socket.iniServerSocket();
      if(this.res.result ==="success"){
        this.showAlert=true;
        this.droneConnected=true
        this.alertMsg="Connexion réussie !"
        this.alertType="alert alert-success alert-msg fs-5"
      }
      else if(this.res.ok ===false){
        this.showAlert=true;
        this.alertMsg="Echec de connexion."
        this.alertType="alert alert-danger alert-msg fs-5"
      }
      console.log(this.res.result);
    }


    connect(){
    this.socketio = io.io('http://localhost:5000');
    }


    setReceiveMethod() {
    this.socketio.on('data-tmp', (data: { temperature: string; humidity: string | undefined; }) => {
    console.log(data);
    this.temperature = data.temperature;
    this.humidity = data.humidity;
    this.gps = +(this.humidity+this.temperature);
    });
    }


    sendmessage() {
    this.socketio.emit('new-message', 'Hi-flask');
    }

      /**-*** */

      title = 'droneapp';
      // export icons
      faPlusCircle = faPlusCircle;
      faCamera=faCamera;
      // map settings
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

      //drone itinerary form
      itineraryForm = new FormGroup({
        start: new FormControl(this.droneStartInput,[Validators.required]),
        destination: new FormControl('', [Validators.required])
      });
      pathDistance:number|undefined;
      flightTime:string|undefined;

      async sendSinglePathItinerary() {
        this.gpsPositionService.getStartPosition();
        this.itineraryForm.patchValue({
          destination:this.destinationInput
        })
        console.warn(this.itineraryForm.value);
        if(this.itineraryForm.value!==null){
          let res = await this.gpsPositionService.sendSinglePathItinerary(this.itineraryForm.value.toString());
          console.warn(res);
        }
      }

      get start() {
        return this.itineraryForm.get('start');
      }
      get destination() {
        return this.itineraryForm.get('destination')
      }

      pathCoordinates = [
        [this.lat, this.lng]
      ];



      /******************** Methods ******************/
      onChosenLocation($event: any): void {
        console.log($event);
        console.log(this.markers)
        //this.markers.shift(); // remove previous marker
        let chosen_lat = $event.coords.lat;
        let chosen_lng = $event.coords.lng;

        let path = [chosen_lat, chosen_lng];
        this.pathCoordinates.push(path);
        this.pathDistance=this.utils.getDistance(this.pathCoordinates).toFixed(2);
        let meanSpeed = 40; //km/h

        if(this.utils.calcFightTime(this.pathDistance,meanSpeed).toFixed(2)<100){
          this.flightTime= this.utils.calcFightTime(this.pathDistance,meanSpeed).toFixed(2)+ " min";
        }
        else{
          this.flightTime= (this.utils.calcFightTime(this.pathDistance,meanSpeed)/60).toFixed(2)+ " h";
        }
        this.nbDestination = this.pathCoordinates.length-1;
        console.log(this.pathCoordinates);

        // add a marker to the list of markers
        this.markers.push({
          lat: chosen_lat,
          lng: chosen_lng,
          draggable: true,
          opacity: 1
        });
        this.destinationInput = `${chosen_lat.toFixed(6)}, ${chosen_lng.toFixed(6)}`
      }

      clearItinerary(){
        this.pathCoordinates.splice(1);
        this.nbDestination = 0;
        this.destinationInput=""
        this.markers.splice(0);
        this.flightTime="-";
        this.pathDistance=0;
      }



    }

