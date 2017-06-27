import { Routes, RouterModule } from '@angular/router';

import { ReactiveFormComponent } from './reactiveForm/reactiveForm.component';
import { FoodFormComponent } from './foodForm/foodForm.component';

const app_routes: Routes = [
  { path: '', pathMatch:'full', redirectTo: '/reactiveform' },
  { path: 'reactiveform',     component: ReactiveFormComponent    },
  { path: 'foodform',       component: FoodFormComponent    }
];

export const app_routing = {
  routes: RouterModule.forRoot(app_routes),
  components: [
                ReactiveFormComponent, FoodFormComponent
              ]
};
