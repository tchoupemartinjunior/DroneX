import { Itinerary } from '../models/itinerary';
import { AppComponent } from '../app.component';
import { Injectable } from '@angular/core';
import { IPosition, Position } from '../models/position';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class MissionService {
  API_ROOT_URL =environment.SERVER_IP_ADDRESS
  constructor(private http: HttpClient) { }

  res:any;

  public getStartPosition():void{
    this.res = this.http.get(this.API_ROOT_URL+'api/startPosition').subscribe(data => {
  console.log(data);
  });
}

  public async sendMissionInfo(itinerary:any){
    console.log(itinerary)
    try{
      const result = await this.http.post(this.API_ROOT_URL+'api/mission', {itinerary}).toPromise();
      return result;
    }catch(error){
    console.log(error);
    return error
  }
  }

  public async launchMission(mission:any){
    try{
      const result = await this.http.post(this.API_ROOT_URL+'api/mission/launch', {mission}).toPromise();
      return result;
    }catch(error){
    console.log(error);
    return error
  }
  }

  public async takeOff(){
    try{
      const result = await this.http.get(this.API_ROOT_URL+'api/drone?action=takeOff').toPromise();
      return result;
    }catch(error){
    console.log(error);
    return error
  }
  }
}
