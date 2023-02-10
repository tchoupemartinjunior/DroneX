import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {


  @Output() onActivate = new EventEmitter<void>();
  @Input() videoUrl:string;

  private socket: io.Socket<DefaultEventsMap, DefaultEventsMap>;

  constructor(private http: HttpClient) { }

  onCameraStart(): void {
    this.onActivate.emit();
  }
  ngOnInit(): void {

    /*this.socket = io.connect('http://localhost:5000');
    this.socket.on('video_frame', (data) => {
      console.log(data);
      this.videoUrl = data;
    });*/
  }

}
