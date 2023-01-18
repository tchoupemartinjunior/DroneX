import { Injectable } from '@angular/core';
import { IPosition, Position } from '../models/position';


@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

  public positionToString(postion:IPosition):String{
    return `${postion.lat.toFixed(6)}, ${postion.lng.toFixed(6)}`
  }

  public toRad(value:number) :number{
    return (value * Math.PI) / 180;
  }

 public calcCrow(lat1:number, lon1:number, lat2:number, lon2:number) : number {
    var R = 6371; // km
    var dLat = this.toRad(lat2 - lat1);
    var dLon = this.toRad(lon2 - lon1);
    lat1 = this.toRad(lat1);
    lat2 = this.toRad(lat2);
    console.log(lat1, dLon);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    console.log(d);
    return d;
  }

  public getDistance(tab:Array<any>):any{
    let distParcourue = 0;
    for (let i = 0; i < tab.length; i++) {
      if (i == tab.length - 1) {
        return distParcourue;
      } else {
        distParcourue += this.calcCrow(
          tab[i][0],
          tab[i][1],
          tab[i + 1][0],
          tab[i + 1][1]
        );
      }
    }
  }

  public calcFightTime(distance:any, speed:any):any{
    return (distance/speed)*60 // time in minutes
  }
}
