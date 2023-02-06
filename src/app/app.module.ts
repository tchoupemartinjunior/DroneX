import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AgmCoreModule} from '@agm/core';
import {ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { LoadingInterceptor } from './loading.interceptor';
import { AlertComponent } from './components/alert/alert.component';
import { VideoComponent } from './components/video/video.component';
import { environment } from 'src/environments/environment';
import { DroneInfoComponent } from './components/drone-info/drone-info.component';
import { alertMsg } from './models/alertMsg';




@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    AlertComponent,
    VideoComponent,
    DroneInfoComponent,
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    AgmCoreModule.forRoot({
      apiKey: environment.GoogleMapsAPI_key
    }),
    ReactiveFormsModule,
    HttpClientModule,

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
