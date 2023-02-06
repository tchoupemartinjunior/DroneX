import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {

  @Input() message: string;
  @Input() type: string;
  @Input() showAlert: boolean;
  @Output() onDismiss = new EventEmitter<void>();

  onCloseAlert(): void {
    this.onDismiss.emit();
  }
}

