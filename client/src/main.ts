import 'hammerjs';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { hmrBootstrap } from './hmr';
require('./app/app.module');

if (environment.production) {
  enableProdMode();
}

(document.URL.indexOf('http://') === 0 || document.URL.indexOf('https://') === 0)
  ? _initWebApp()
  : _initMobileApp();

function _initWebApp() {
  const bootstrap = () => platformBrowserDynamic().bootstrapModule(AppModule);
  if (environment.hmr) {
    if (module['hot']) {
      hmrBootstrap(module, bootstrap);
    } else {
      console.error('HMR is not enabled for webpack-dev-server!');
      console.log('Are you using the --hmr flag for ng serve?');
    }
  } else {
    bootstrap().catch((err) => console.log(err));
  }
}

function _initMobileApp() {
  const onDeviceReady = () => {
    platformBrowserDynamic().bootstrapModule(AppModule);
  };
  document.addEventListener('deviceready', onDeviceReady, false);
}
