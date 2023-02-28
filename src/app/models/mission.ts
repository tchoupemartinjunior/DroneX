export interface IMission{
  start:number[];
  destinations:any[];
  distance:number;
  flight_time:number;
  title:string;
}
export class Mission implements IMission{
  start: number[];
  destinations: any[];
  distance: number;
  flight_time: number;
  title: string;

  constructor(start:number[],destinations:any[], distance:number, flight_time:number, title:string){
    this.start = start;
    this.destinations =destinations;
    this.distance = distance;
    this.flight_time = flight_time;
    this.title = title;
  }

}

