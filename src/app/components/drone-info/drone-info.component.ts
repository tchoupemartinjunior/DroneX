import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-drone-info',
  templateUrl: './drone-info.component.html',
  styleUrls: ['./drone-info.component.css']
})
export class DroneInfoComponent implements OnInit {
  @Input() infoTitle: string;
  @Input() infoValue: any;
  @Input() infoUnit: any;


  constructor() { }

  ngOnInit(): void {
  }

}
