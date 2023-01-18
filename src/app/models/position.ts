
export interface IPosition {
  lat: number;
  lng: number;
}

export class Position implements IPosition{
  lat: number;
  lng: number;
  constructor(lat: number, lng: number){
    this.lat = lat;
    this.lng = lng;
  }
}
