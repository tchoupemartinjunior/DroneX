import { Itinerary } from './../models/itinerary';
import { AppComponent } from './../app.component';
import { Injectable } from '@angular/core';
import { IPosition, Position } from '../models/position';
import { HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class GpsPositionService {
  API_ROOT_URL ="http://localhost:5000"
  constructor(private http: HttpClient) { }

  res:any;

  public getStartPosition():void{
    this.res = this.http.get(this.API_ROOT_URL+'/startPosition').subscribe(data => {
  console.log(data);
  });
}

  public async sendSinglePathItinerary(itinerary:String){
    const data: Itinerary={
      start: {lat:1212,lng:4444},
      destination: {lat:1212,lng:4444}
    }
    try{
      const result = await this.http.post(this.API_ROOT_URL+'/api/gps', {"data":itinerary}).toPromise();
      return result;
    }catch(error){
    console.log(error);
    return error
  }
  }
}
