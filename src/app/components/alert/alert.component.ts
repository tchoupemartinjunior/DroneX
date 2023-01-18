import { Component, Input, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  @Input() message: string;
  @Input() type: string;
  @Input() showModal: boolean;


  constructor(public loader: LoaderService) { }

  hideAlert(){
    this.showModal=false;
  }


  ngOnInit(): void {

  }

}
