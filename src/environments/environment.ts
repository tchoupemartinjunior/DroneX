// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { GoogleMapsAPIWrapper } from "@agm/core";

export const environment = {
  production: false,
  GoogleMapsAPI_key:'',//AIzaSyANz1hf2rRtU8et_m0h-YCKU5S5MHa6ce0
  // SERVER_IP_ADDRESS: 'http://192.168.1.45:8000/',
  // WEB_SOCKET: 'http://192.168.1.45:8000/'
  SERVER_IP_ADDRESS: 'http://localhost:5000/',
  WEB_SOCKET: 'http://localhost:5000/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
