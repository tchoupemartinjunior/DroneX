import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as io from 'socket.io-client'

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: any;
  private messages: Array<any> | undefined;
  constructor(private http: HttpClient) {}


  public async initServer(){

    try{
      const data = await this.http.get(environment.SERVER_IP_ADDRESS+'api/connection').toPromise();
      console.log(data);
      return data;
    }catch(error){
      console.log(error);
      return error
    }

}


}
