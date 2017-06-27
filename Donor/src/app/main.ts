import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import { enableProdMode } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//enableProdMode(); //Uncomment for production
platformBrowserDynamic().bootstrapModule(AppModule)
  .then((success: any) => console.log('App bootstrapped'))
  .catch((err: any) => console.error(err));
