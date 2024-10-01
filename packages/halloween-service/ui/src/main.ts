import { environment } from "./environments/environment";
import { enableProdMode } from "@angular/core";

if (environment.production) {
  console.log('Enabling production mode');
  enableProdMode();
} else {
  console.log('Development mode is active');
}

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
