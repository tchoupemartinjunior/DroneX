import { IPosition } from "./position";

export interface IItinerary{
  start:IPosition;
  destination:IPosition;
}
export class Itinerary implements IItinerary{
  start:IPosition;
  destination:IPosition;

  constructor(start:IPosition, destination:IPosition){
    this.start = start;
    this.destination=destination;
  }
}

