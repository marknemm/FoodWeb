import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from '~app/app.module';
import { environment } from '~app/environment';
import { hmrBootstrap } from '~hmr';

if (environment.production) {
  enableProdMode();
}

let bootstrap = () => platformBrowserDynamic().bootstrapModule(AppModule).catch((err) => console.error(err));
if (environment.hmr) {
  if (module['hot']) {
    bootstrap = hmrBootstrap.bind(this, module, bootstrap);
  } else {
    console.error('HMR is not enabled for webpack-dev-server!');
    console.log('Are you using the --hmr flag for ng serve?');
  }
}
document.addEventListener('deviceready', bootstrap, false);
