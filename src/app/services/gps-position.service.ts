import { Itinerary } from './../models/itinerary';
import { AppComponent } from './../app.component';
import { Injectable } from '@angular/core';
import { IPosition, Position } from '../models/position';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class GpsPositionService {
  API_ROOT_URL =environment.SERVER_IP_ADDRESS
  constructor(private http: HttpClient) { }

  res:any;

  public getStartPosition():void{
    this.res = this.http.get(this.API_ROOT_URL+'/startPosition').subscribe(data => {
  console.log(data);
  });
}

  public async sendSinglePathItinerary(itinerary:any){
    const data: Itinerary={
      start: {lat:1212,lng:4444},
      destination: {lat:1212,lng:4444}
    }
    try{
      const result = await this.http.post(this.API_ROOT_URL+'/api/gps', {itinerary}).toPromise();
      return result;
    }catch(error){
    console.log(error);
    return error
  }
  }
}
