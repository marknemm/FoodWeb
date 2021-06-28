import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { BootstrapService } from '~hybrid/bootstrap/services/bootstrap/bootstrap.service';
import { routes as webRoutes } from '~web/app-routing.module';
import { ShellComponent } from '~web/shell/components/shell/shell.component';

/** Inherited routes from the web project's top level routes that are rendered inside the main ShellComponent. */
const inheritedWebRoutes: Routes = webRoutes.find(
  (webRoute: Route) => webRoute.component === ShellComponent
// Ensure that we filter out some web routes that are to be replaced in the hybrid mobile app.
).children.filter(
  (webRoute: Route) => webRoute.path !== 'signup'
);

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  // Redirect web login/signup to app routes.
  { path: 'login', pathMatch: 'full', redirectTo: 'bootstrap/login' },
  { path: 'signup', pathMatch: 'full', redirectTo: 'bootstrap/signup' },
  { path: 'signup/:accountType', redirectTo: 'bootstrap/signup/:accountType' },
  { path: 'bootstrap', loadChildren: () => import('./bootstrap/bootstrap.module').then(mod => mod.BootstrapModule) },
  {
    path: '',
    component: ShellComponent,
    canActivate: [BootstrapService],
    children: inheritedWebRoutes
  },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
