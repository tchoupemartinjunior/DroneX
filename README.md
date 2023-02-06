# Droneapp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

#installation procedures

## install boostrap
add the boostrap cdn links in the index.html file. links are found on the boostrap official page
## install FontAwesome

best method
- ng add @fortawesome/angular-fontawesome@0.11.0 (check your angular version)

another method
- npm install @fortawesome/fontawesome-svg-core
- npm install @fortawesome/free-brands-svg-icons
- npm install @fortawesome/free-regular-svg-icons
- npm install @fortawesome/free-solid-svg-icons
- npm install @fortawesome/angular-fontawesome 

### add this line in the app.module.ts
- import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
-   import { faPlusCircle, faCamera } from '@fortawesome/free-solid-svg-icons';
in the component.ts


update the app.module.ts
import desired component in the app.component.ts

## install angular google map agm
- https://angular-maps.com/guides/getting-started/
- npm install @agm/core
- npm i @types/googlemaps@3.39.13

## for the backend
- pip install -r requirement.txt
- sudo apt-get install nginx (on linux)

Configure Nginx to proxy pass with CORS headers: You can configure Nginx to add the appropriate CORS headers to the response, by adding the following code to your Nginx configuration file:
- add_header 'Access-Control-Allow-Origin' '*';
- add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';

# DroneX
# DroneX
# DroneX
