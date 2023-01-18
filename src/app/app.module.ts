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




@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    AlertComponent,
    VideoComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyANz1hf2rRtU8et_m0h-YCKU5S5MHa6ce0'
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
