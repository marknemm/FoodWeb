"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var reactiveForm_component_1 = require("./reactiveForm/reactiveForm.component");
var foodForm_component_1 = require("./foodForm/foodForm.component");
var app_routes = [
    { path: '', pathMatch: 'full', redirectTo: '/reactiveform' },
    { path: 'reactiveform', component: reactiveForm_component_1.ReactiveFormComponent },
    { path: 'foodform', component: foodForm_component_1.FoodFormComponent }
];
exports.app_routing = {
    routes: router_1.RouterModule.forRoot(app_routes),
    components: [
        reactiveForm_component_1.ReactiveFormComponent, foodForm_component_1.FoodFormComponent
    ]
};
//# sourceMappingURL=app.routing.js.map