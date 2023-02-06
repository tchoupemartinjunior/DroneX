
export interface IDroneInfo {
  title:string;
  value:any;
  unit:string;
}

export interface IDroneInfoTypes{
  attitude:number[];
  altitude:number;
  speed:number;
  gps_data:String;
  battery_capacity:any;
  battery_time_to_empty:any;
  power_usage:any;
}
