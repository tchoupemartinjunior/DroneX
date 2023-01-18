import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {

  private socket: io.Socket<DefaultEventsMap, DefaultEventsMap>;
  videoUrl: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.socket = io.connect('http://localhost:5000');
    this.socket.on('video_frame', (data) => {
      console.log(data);
      this.videoUrl = data;
    });
  }

}
