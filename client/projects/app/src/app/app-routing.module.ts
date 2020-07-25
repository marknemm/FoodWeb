import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from '@nativescript/angular';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'browse', loadChildren: () => import('./browse/browse.module').then((m) => m.BrowseModule) },
    { path: 'search', loadChildren: () => import('./search/search.module').then((m) => m.SearchModule) },
    { path: 'featured', loadChildren: () => import('./featured/featured.module').then((m) => m.FeaturedModule) },
    { path: 'settings', loadChildren: () => import('./settings/settings.module').then((m) => m.SettingsModule) }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
