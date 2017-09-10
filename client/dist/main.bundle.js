webpackJsonp(["main"],{

/***/ "../../../../../client lazy recursive":
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	return new Promise(function(resolve, reject) { reject(new Error("Cannot find module '" + req + "'.")); });
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "../../../../../client lazy recursive";

/***/ }),

/***/ "../../../../../client/src/app/app.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../client/src/app/app.component.html":
/***/ (function(module, exports) {

module.exports = "<div style=\"min-height:100%; margin-bottom: 0px; padding-bottom: 0px;\">\r\n    <app-header></app-header>\r\n\r\n    <!-- This is replaced with each component we route to -->\r\n    <router-outlet></router-outlet>\r\n</div>\r\n\r\n<app-footer></app-footer>\r\n"

/***/ }),

/***/ "../../../../../client/src/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var AppComponent = (function () {
    function AppComponent() {
    }
    AppComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'body',
            template: __webpack_require__("../../../../../client/src/app/app.component.html"),
            styles: [__webpack_require__("../../../../../client/src/app/app.component.css")]
        })
    ], AppComponent);
    return AppComponent;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ "../../../../../client/src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__("../../../platform-browser/@angular/platform-browser.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_animations__ = __webpack_require__("../../../platform-browser/@angular/platform-browser/animations.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__("../../../http/@angular/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ng_bootstrap_ng_bootstrap__ = __webpack_require__("../../../../@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_ng2_bootstrap_modal__ = __webpack_require__("../../../../ng2-bootstrap-modal/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_ng2_bootstrap_modal___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_ng2_bootstrap_modal__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__angular_forms__ = __webpack_require__("../../../forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_ng2_img_cropper__ = __webpack_require__("../../../../ng2-img-cropper/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_angular2_busy__ = __webpack_require__("../../../../angular2-busy/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_angular2_busy___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_angular2_busy__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__angular_material__ = __webpack_require__("../../../material/@angular/material.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__app_component__ = __webpack_require__("../../../../../client/src/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__home_home_component__ = __webpack_require__("../../../../../client/src/app/home/home.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__header_header_component__ = __webpack_require__("../../../../../client/src/app/header/header.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__footer_footer_component__ = __webpack_require__("../../../../../client/src/app/footer/footer.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__authentication_login_login_component__ = __webpack_require__("../../../../../client/src/app/authentication/login/login.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__donate_donate_component__ = __webpack_require__("../../../../../client/src/app/donate/donate.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__receive_receive_component__ = __webpack_require__("../../../../../client/src/app/receive/receive.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__cart_cart_component__ = __webpack_require__("../../../../../client/src/app/cart/cart.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__authentication_signup_signup_component__ = __webpack_require__("../../../../../client/src/app/authentication/signup/signup.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__banner_banner_component__ = __webpack_require__("../../../../../client/src/app/banner/banner.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__slick_left_panel_slick_left_panel_component__ = __webpack_require__("../../../../../client/src/app/slick-left-panel/slick-left-panel.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__food_listings_food_listings_filters_food_listings_filters_component__ = __webpack_require__("../../../../../client/src/app/food-listings/food-listings-filters/food-listings-filters.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__food_listings_food_listings_component__ = __webpack_require__("../../../../../client/src/app/food-listings/food-listings.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__food_listings_food_types_food_types_component__ = __webpack_require__("../../../../../client/src/app/food-listings/food-types/food-types.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__authentication_app_user_info_app_user_info_component__ = __webpack_require__("../../../../../client/src/app/authentication/app-user-info/app-user-info.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__common_util_request_service__ = __webpack_require__("../../../../../client/src/app/common-util/request.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__common_util_route_preprocess_service__ = __webpack_require__("../../../../../client/src/app/common-util/route-preprocess.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__common_util_session_data_service__ = __webpack_require__("../../../../../client/src/app/common-util/session-data.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__food_listings_food_types_food_types_service__ = __webpack_require__("../../../../../client/src/app/food-listings/food-types/food-types.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__common_util_date_formatter_pipe__ = __webpack_require__("../../../../../client/src/app/common-util/date-formatter.pipe.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};































var appRoutes = [
    /*{
        path: 'login', // This can be both modal popup and its own page!
        component: LoginComponent
    },*/
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/home'
    },
    {
        path: 'home',
        component: __WEBPACK_IMPORTED_MODULE_12__home_home_component__["a" /* HomeComponent */],
        canActivate: [__WEBPACK_IMPORTED_MODULE_27__common_util_route_preprocess_service__["a" /* RoutePreprocessService */]],
    },
    {
        path: 'donate',
        component: __WEBPACK_IMPORTED_MODULE_16__donate_donate_component__["a" /* DonateComponent */],
        canActivate: [__WEBPACK_IMPORTED_MODULE_27__common_util_route_preprocess_service__["a" /* RoutePreprocessService */]]
    },
    {
        path: 'receive',
        component: __WEBPACK_IMPORTED_MODULE_17__receive_receive_component__["a" /* ReceiveComponent */],
        canActivate: [__WEBPACK_IMPORTED_MODULE_27__common_util_route_preprocess_service__["a" /* RoutePreprocessService */]],
        // Make sure that we get the FoodTypes from the back end before routing to the receiver interface!
        resolve: {
            foodTypes: __WEBPACK_IMPORTED_MODULE_29__food_listings_food_types_food_types_service__["a" /* FoodTypesService */]
        }
    },
    {
        path: 'cart',
        component: __WEBPACK_IMPORTED_MODULE_18__cart_cart_component__["a" /* CartComponent */],
        canActivate: [__WEBPACK_IMPORTED_MODULE_27__common_util_route_preprocess_service__["a" /* RoutePreprocessService */]],
        // Make sure that we get the FoodTypes from the back end before routing to the cart interface!
        resolve: {
            foodTypes: __WEBPACK_IMPORTED_MODULE_29__food_listings_food_types_food_types_service__["a" /* FoodTypesService */]
        }
    },
    {
        path: 'signup',
        component: __WEBPACK_IMPORTED_MODULE_19__authentication_signup_signup_component__["a" /* SignupComponent */],
        canActivate: [__WEBPACK_IMPORTED_MODULE_27__common_util_route_preprocess_service__["a" /* RoutePreprocessService */]]
    },
    {
        path: 'appUserInfo',
        component: __WEBPACK_IMPORTED_MODULE_25__authentication_app_user_info_app_user_info_component__["a" /* AppUserInfoComponent */],
        canActivate: [__WEBPACK_IMPORTED_MODULE_27__common_util_route_preprocess_service__["a" /* RoutePreprocessService */]]
    }
];
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_11__app_component__["a" /* AppComponent */],
                __WEBPACK_IMPORTED_MODULE_12__home_home_component__["a" /* HomeComponent */],
                __WEBPACK_IMPORTED_MODULE_13__header_header_component__["a" /* HeaderComponent */],
                __WEBPACK_IMPORTED_MODULE_14__footer_footer_component__["a" /* FooterComponent */],
                __WEBPACK_IMPORTED_MODULE_15__authentication_login_login_component__["a" /* LoginComponent */],
                __WEBPACK_IMPORTED_MODULE_16__donate_donate_component__["a" /* DonateComponent */],
                __WEBPACK_IMPORTED_MODULE_17__receive_receive_component__["a" /* ReceiveComponent */],
                __WEBPACK_IMPORTED_MODULE_19__authentication_signup_signup_component__["a" /* SignupComponent */],
                __WEBPACK_IMPORTED_MODULE_8_ng2_img_cropper__["b" /* ImageCropperComponent */],
                __WEBPACK_IMPORTED_MODULE_30__common_util_date_formatter_pipe__["a" /* DateFormatterPipe */],
                __WEBPACK_IMPORTED_MODULE_20__banner_banner_component__["a" /* BannerComponent */],
                __WEBPACK_IMPORTED_MODULE_21__slick_left_panel_slick_left_panel_component__["a" /* SlickLeftPanelComponent */],
                __WEBPACK_IMPORTED_MODULE_22__food_listings_food_listings_filters_food_listings_filters_component__["a" /* FoodListingsFiltersComponent */],
                __WEBPACK_IMPORTED_MODULE_23__food_listings_food_listings_component__["a" /* FoodListingsComponent */],
                __WEBPACK_IMPORTED_MODULE_24__food_listings_food_types_food_types_component__["a" /* FoodTypesComponent */],
                __WEBPACK_IMPORTED_MODULE_18__cart_cart_component__["a" /* CartComponent */],
                __WEBPACK_IMPORTED_MODULE_25__authentication_app_user_info_app_user_info_component__["a" /* AppUserInfoComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_4__ng_bootstrap_ng_bootstrap__["b" /* NgbModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_6__angular_router__["b" /* RouterModule */].forRoot(appRoutes),
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_animations__["a" /* BrowserAnimationsModule */],
                __WEBPACK_IMPORTED_MODULE_5_ng2_bootstrap_modal__["BootstrapModalModule"],
                __WEBPACK_IMPORTED_MODULE_3__angular_http__["c" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_7__angular_forms__["f" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_7__angular_forms__["k" /* ReactiveFormsModule */],
                __WEBPACK_IMPORTED_MODULE_9_angular2_busy__["BusyModule"],
                __WEBPACK_IMPORTED_MODULE_10__angular_material__["h" /* MdListModule */],
                __WEBPACK_IMPORTED_MODULE_10__angular_material__["e" /* MdCheckboxModule */],
                __WEBPACK_IMPORTED_MODULE_10__angular_material__["j" /* MdRadioModule */],
                __WEBPACK_IMPORTED_MODULE_10__angular_material__["g" /* MdInputModule */],
                __WEBPACK_IMPORTED_MODULE_10__angular_material__["k" /* MdSelectModule */],
                __WEBPACK_IMPORTED_MODULE_10__angular_material__["d" /* MdButtonModule */],
                __WEBPACK_IMPORTED_MODULE_10__angular_material__["f" /* MdDatepickerModule */],
                __WEBPACK_IMPORTED_MODULE_10__angular_material__["i" /* MdNativeDateModule */]
            ],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_15__authentication_login_login_component__["a" /* LoginComponent */]
            ],
            bootstrap: [
                __WEBPACK_IMPORTED_MODULE_11__app_component__["a" /* AppComponent */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_30__common_util_date_formatter_pipe__["a" /* DateFormatterPipe */],
                __WEBPACK_IMPORTED_MODULE_26__common_util_request_service__["a" /* RequestService */],
                __WEBPACK_IMPORTED_MODULE_28__common_util_session_data_service__["a" /* SessionDataService */],
                __WEBPACK_IMPORTED_MODULE_27__common_util_route_preprocess_service__["a" /* RoutePreprocessService */],
                __WEBPACK_IMPORTED_MODULE_29__food_listings_food_types_food_types_service__["a" /* FoodTypesService */],
                { provide: __WEBPACK_IMPORTED_MODULE_10__angular_material__["a" /* DateAdapter */], useClass: __WEBPACK_IMPORTED_MODULE_10__angular_material__["l" /* NativeDateAdapter */] },
                { provide: __WEBPACK_IMPORTED_MODULE_10__angular_material__["b" /* MD_DATE_FORMATS */], useValue: __WEBPACK_IMPORTED_MODULE_10__angular_material__["c" /* MD_NATIVE_DATE_FORMATS */] }
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ "../../../../../client/src/app/authentication/app-user-info/app-user-info.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "label {\r\n    font-weight: bold;\r\n    font-size: 22px;\r\n    padding-bottom: 0px;\r\n    margin-bottom: 0px;\r\n}\r\n\r\nh2 {\r\n    font-weight: bold;\r\n}\r\n\r\n.classic-link {\r\n    color: blue;\r\n    cursor: pointer;\r\n    cursor: hand;\r\n    display: inline-block;\r\n    padding-right: 40px;\r\n}\r\n\r\n.classic-link:hover {\r\n    text-decoration: underline;\r\n}\r\n\r\nspan {\r\n    font-size: 20px;\r\n    display: block;\r\n    min-height: 50px;\r\n}\r\n\r\nspan > i {\r\n    display: none;\r\n    position: absolute;\r\n    margin-left: 3px;\r\n    margin-top: 5px;\r\n}\r\n\r\nspan:hover > i {\r\n    display: inline-block;\r\n}\r\n\r\ninput:not(.form-control) {\r\n    width: 100%;\r\n}\r\n\r\n.full-width {\r\n    width: 100%;\r\n}\r\n\r\n.input-infix {\r\n    width: 100%;\r\n    padding-right: 30px;\r\n    position: absolute;\r\n    -webkit-transform: translateY(-20px);\r\n            transform: translateY(-20px);\r\n}\r\n\r\n.select-infix {\r\n    position: absolute;\r\n}\r\n\r\n.select-infix md-select {\r\n    -webkit-transform: translateY(-20px);\r\n            transform: translateY(-20px);\r\n}\r\n\r\n.select-infix i {\r\n    -webkit-transform: translateY(-3px);\r\n            transform: translateY(-3px);\r\n}\r\n\r\ninput:not(.form-control), md-select {\r\n    margin-top: 0px;\r\n    font-size: 20px;\r\n}\r\n\r\nmd-icon {\r\n    cursor: pointer;\r\n    cursor: hand;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../client/src/app/authentication/app-user-info/app-user-info.component.html":
/***/ (function(module, exports) {

module.exports = "<div [formGroup]=\"appUserInfoForm\" class=\"container\" [ngBusy]=\"busySaveConfig\" spellcheck=\"false\">\n\n    <h2 class>Identification</h2>\n    <hr>\n    <div class=\"row\">\n\n        <div class=\"col-md-6\">\n            <div class=\"form-group\">\n                <label for=\"firstName\">{{firstNameLabel}}:</label><br>\n                <span *ngIf=\"!editFlags.get('firstName')\" class=\"classic-link\" (click)=\"setEditable('firstName')\" title=\"edit\">\n                    {{controls.firstName.value}}<i class=\"material-icons\">&#xe254;</i>\n                </span>\n                <span *ngIf=\"editFlags.get('firstName')\">\n                    <md-input-container class=\"input-infix\">\n                        <input mdInput id=\"firstName\" formControlName=\"firstName\" (keyup.enter)=\"saveFirstName.click()\" autocomplete=\"on\">\n                        <md-icon #saveFirstName mdSuffix (click)=\"save(controls.firstName, 'firstName')\">\n                            <i class=\"material-icons\">save</i>\n                        </md-icon>\n                        <md-error>Required</md-error>\n                    </md-input-container>\n                </span>\n            </div>\n\n            <div class=\"form-group\">\n                <label for=\"lastName\">{{lastNameLabel}}:</label><br>\n                <span *ngIf=\"!editFlags.get('lastName')\" class=\"classic-link\" (click)=\"setEditable('lastName')\" title=\"edit\">\n                    {{controls.lastName.value}}<i class=\"material-icons\">&#xe254;</i>\n                </span>\n                <span *ngIf=\"editFlags.get('lastName')\">\n                    <md-input-container class=\"input-infix\">\n                        <input mdInput id=\"lastName\" formControlName=\"lastName\" (keyup.enter)=\"saveLastName.click()\" autocomplete=\"on\">\n                        <md-icon #saveLastName mdSuffix (click)=\"save(controls.lastName, 'lastName')\">\n                            <i class=\"material-icons\">save</i>\n                        </md-icon>\n                        <md-error>Required</md-error>\n                    </md-input-container>\n                </span>\n            </div>\n        </div><!-- col 1 -->\n\n        <div class=\"col-md-6\">\n            <div class=\"form-group\">\n                <label for=\"email\">{{emailLabel}}:</label><br>\n                <span *ngIf=\"!editFlags.get('email')\" class=\"classic-link\" (click)=\"setEditable('email')\" title=\"edit\">\n                    {{controls.email.value}}<i class=\"material-icons\">&#xe254;</i>\n                </span>\n                <span *ngIf=\"editFlags.get('email')\">\n                    <md-input-container class=\"input-infix\">\n                        <input mdInput type=\"email\" id=\"email\" formControlName=\"email\" (keyup.enter)=\"saveEmail.click()\" autocomplete=\"on\">\n                        <md-icon #saveEmail mdSuffix (click)=\"save(controls.email, 'email')\">\n                            <i class=\"material-icons\">save</i>\n                        </md-icon>\n                        <md-error>Required</md-error>\n                    </md-input-container>\n                </span>\n            </div>\n\n            <div *ngIf=\"isOrganization\" class=\"form-group\">\n                <label for=\"organizationName\">Organization Name:</label><br>\n                <span *ngIf=\"!editFlags.get('organizationName')\" class=\"classic-link\" (click)=\"setEditable('organizationName')\" title=\"edit\">\n                    {{controls.organizationName.value}}<i class=\"material-icons\">&#xe254;</i>\n                </span>\n                <span *ngIf=\"editFlags.get('organizationName')\">\n                    <md-input-container class=\"input-infix\">\n                        <input mdInput id=\"organizationName\" formControlName=\"organizationName\" (keyup.enter)=\"saveOrganizationName.click()\" autocomplete=\"on\">\n                        <md-icon #saveOrganizationName mdSuffix (click)=\"save(controls.organizationName, 'organizationName')\">\n                            <i class=\"material-icons\">save</i>\n                        </md-icon>\n                        <md-error>Required</md-error>\n                    </md-input-container>\n                </span>\n            </div>\n        </div><!-- col 2 -->\n\n    </div><br><br><!-- row -->\n\n    <h2 class>Contact Info</h2>\n    <hr>\n    <div class=\"row\">\n\n        <div class=\"col-md-6\">\n            <div class=\"form-group\">\n                <label for=\"address\">Street Address:</label><br>\n                <span *ngIf=\"!editFlags.get('address')\" class=\"classic-link\" (click)=\"setEditable('address')\" title=\"edit\">\n                    {{controls.address.value}}<i class=\"material-icons\">&#xe254;</i>\n                </span>\n                <span *ngIf=\"editFlags.get('address')\">\n                    <md-input-container class=\"input-infix\">\n                        <input mdInput id=\"address\" formControlName=\"address\" (keyup.enter)=\"saveAddress.click()\" autocomplete=\"on\">\n                        <md-icon #saveAddress mdSuffix (click)=\"save(controls.address, 'address')\">\n                            <i class=\"material-icons\">save</i>\n                        </md-icon>\n                        <md-error>Required</md-error>\n                    </md-input-container>\n                </span>\n            </div>\n\n            <div class=\"form-group\">\n                <label for=\"city\">City:</label><br>\n                <span *ngIf=\"!editFlags.get('city')\" class=\"classic-link\" (click)=\"setEditable('city')\" title=\"edit\">\n                    {{controls.city.value}}<i class=\"material-icons\">&#xe254;</i>\n                </span>\n                <span *ngIf=\"editFlags.get('city')\">\n                    <md-input-container class=\"input-infix\">\n                        <input mdInput id=\"city\" formControlName=\"city\" (keyup.enter)=\"saveCity.click()\" autocomplete=\"on\">\n                        <md-icon #saveCity mdSuffix (click)=\"save(controls.city, 'city')\">\n                            <i class=\"material-icons\">save</i>\n                        </md-icon>\n                        <md-error>Required</md-error>\n                    </md-input-container>\n                </span>\n            </div>\n\n            <div class=\"form-group\">\n                <label for=\"state\">State:</label><br>\n                <span *ngIf=\"!editFlags.get('state')\" class=\"classic-link\" (click)=\"setEditable('state')\" title=\"edit\">\n                    {{controls.state.value}}<i class=\"material-icons\">&#xe254;</i>\n                </span>\n                <span *ngIf=\"editFlags.get('state')\" class=\"select-infix\">\n                    <md-select id=\"state\" formControlName=\"state\" [value]=\"controls.state.value\" (change)=\"saveState.click()\">\n                        <md-option *ngFor=\"let stateStr of stateList\" [value]=\"stateStr\">{{stateStr}}</md-option>\n                    </md-select>\n                    <md-icon #saveState mdSuffix (click)=\"save(controls.state, 'state')\">\n                        <i class=\"material-icons\">save</i>\n                    </md-icon>\n                </span>\n            </div>\n        </div><!-- col 1 -->\n\n        <div class=\"col-md-6\">\n            <div class=\"form-group\">\n                <label for=\"zip\">ZIP Code:</label><br>\n                <span *ngIf=\"!editFlags.get('zip')\" class=\"classic-link\" (click)=\"setEditable('zip')\" title=\"edit\">\n                    {{controls.zip.value}}<i class=\"material-icons\">&#xe254;</i>\n                </span>\n                <span *ngIf=\"editFlags.get('zip')\">\n                    <md-input-container class=\"input-infix\">\n                        <input mdInput id=\"zip\" formControlName=\"zip\" (keyup.enter)=\"saveZip.click()\" autocomplete=\"on\" maxlength=\"5\">\n                        <md-icon #saveZip mdSuffix (click)=\"save(controls.zip, 'zip')\">\n                            <i class=\"material-icons\">save</i>\n                        </md-icon>\n                        <md-error>Required</md-error>\n                    </md-input-container>\n                </span>\n            </div>\n            \n            <div class=\"form-group\">\n                <label for=\"phone\">Phone Number:</label><br>\n                <span *ngIf=\"!editFlags.get('phone')\" class=\"classic-link\" (click)=\"setEditable('phone')\" title=\"edit\">\n                    {{controls.phone.value}}<i class=\"material-icons\">&#xe254;</i>\n                </span>\n                <span *ngIf=\"editFlags.get('phone')\">\n                    <md-input-container class=\"input-infix\">\n                        <input mdInput id=\"phone\" formControlName=\"phone\" (keyup.enter)=\"savePhone.click()\" autocomplete=\"on\" maxlength=\"12\">\n                        <md-icon #savePhone mdSuffix (click)=\"save(controls.phone, 'phone')\">\n                            <i class=\"material-icons\">save</i>\n                        </md-icon>\n                        <md-error>Required</md-error>\n                    </md-input-container>\n                </span>\n            </div>\n        </div><!-- col 2 -->\n\n    </div><br><br> <!-- row -->\n\n    <h2 class>Password</h2>\n    <hr>\n    <div class=\"row\">\n            \n        <div class=\"col-md-6\">\n            <button md-raised-button color=\"primary\" class=\"button-md\" *ngIf=\"!editFlags.get('password')\" (click)=\"setEditable('password')\">\n                Update Password\n            </button>\n\n            <ng-container *ngIf=\"editFlags.get('password')\">\n                <div class=\"form-group\">\n                    <md-input-container class=\"full-width\">\n                        <input mdInput type=\"password\" placeholder=\"Current Password\" id=\"password\"\n                         formControlName=\"currentPassword\" (keyup.enter)=\"savePassword()\" required>\n                        <md-error>Required</md-error>\n                    </md-input-container>\n                </div>\n                \n                <div class=\"form-group\">\n                    <md-input-container class=\"full-width\">\n                        <input mdInput type=\"password\" placeholder=\"New Password\" id=\"password\" formControlName=\"password\" (keyup.enter)=\"savePassword()\" required>\n                        <md-error>Required</md-error>\n                    </md-input-container>\n                </div>\n\n                <div class=\"form-group\">\n                    <md-input-container class=\"full-width\">\n                        <input mdInput type=\"password\" placeholder=\"Confirm Password\" id=\"password\" formControlName=\"confirmPassword\" (keyup.enter)=\"savePassword()\" required>\n                        <md-error>Required</md-error>\n                    </md-input-container>\n                </div>\n\n                <button md-raised-button color=\"primary\" class=\"button-md\" (click)=\"savePassword()\">Save</button>\n                <button md-raised-button color=\"primary\" class=\"button-md\" (click)=\"this.editFlags.set('password', false)\">Cancel</button>\n            </ng-container>\n        </div><!-- col -->\n\n    </div><!-- row -->\n\n</div><!-- container -->\n"

/***/ }),

/***/ "../../../../../client/src/app/authentication/app-user-info/app-user-info.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppUserInfoComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__("../../../forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_user_update_service__ = __webpack_require__("../../../../../client/src/app/authentication/app-user-info/app-user-update.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_util_session_data_service__ = __webpack_require__("../../../../../client/src/app/common-util/session-data.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__common_util_food_web_busy_config__ = __webpack_require__("../../../../../client/src/app/common-util/food-web-busy-config.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__shared_authentication_app_user_info__ = __webpack_require__("../../../../../shared/authentication/app-user-info.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__shared_common_util_validation__ = __webpack_require__("../../../../../shared/common-util/validation.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var AppUserInfoComponent = (function () {
    function AppUserInfoComponent(formBuilder, appUserUpdateService, sessionDataService) {
        this.formBuilder = formBuilder;
        this.appUserUpdateService = appUserUpdateService;
        this.sessionDataService = sessionDataService;
        var appUserInfo = sessionDataService.getAppUserSessionData();
        this.stateList = ['CA', 'NY', 'IN'];
        // Set some form labels based off of whether or not user is an organization.
        this.isOrganization = (appUserInfo.organizationName != null);
        if (this.isOrganization) {
            this.emailLabel = 'Organization Email';
            this.firstNameLabel = 'Admin First Name';
            this.lastNameLabel = 'Admin Last Name';
        }
        else {
            this.emailLabel = 'Email';
            this.firstNameLabel = 'First Name';
            this.lastNameLabel = 'Last Name';
        }
        this.appUserInfoForm = new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["d" /* FormGroup */]({});
        this.editFlags = new Map();
        // Loader symbol with this configuration will be displayed if we are stuck saving for a noticably long period of time.
        this.busySaveConfig = new __WEBPACK_IMPORTED_MODULE_4__common_util_food_web_busy_config__["a" /* FoodWebBusyConfig */]('Saving');
        // Fill the form group model based off of the properties found in AppUserInfo.
        // Also, add edit flags based off of the properties.
        for (var property in appUserInfo) {
            if (appUserInfo.hasOwnProperty(property)) {
                var validators = [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["l" /* Validators */].required];
                // Add additional needed validators for email and password fields.
                switch (property) {
                    case 'email':
                        validators.push(__WEBPACK_IMPORTED_MODULE_1__angular_forms__["l" /* Validators */].email);
                        break;
                    case 'zip':
                        validators.push(__WEBPACK_IMPORTED_MODULE_1__angular_forms__["l" /* Validators */].pattern(__WEBPACK_IMPORTED_MODULE_6__shared_common_util_validation__["a" /* Validation */].ZIP_REGEX));
                        break;
                    case 'phone':
                        validators.push(__WEBPACK_IMPORTED_MODULE_1__angular_forms__["l" /* Validators */].pattern(__WEBPACK_IMPORTED_MODULE_6__shared_common_util_validation__["a" /* Validation */].PHONE_REGEX));
                        break;
                }
                var initValue = (appUserInfo[property] == null) ? '' : appUserInfo[property];
                this.appUserInfoForm.addControl(property, new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* FormControl */](initValue.toString(), validators));
                this.editFlags.set(property, false);
            }
        }
        // Initialize form with elements that are not part of AppUserInfo object.
        this.appUserInfoForm.addControl('password', new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* FormControl */]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["l" /* Validators */].pattern(__WEBPACK_IMPORTED_MODULE_6__shared_common_util_validation__["a" /* Validation */].PASSWORD_REGEX)]));
        this.appUserInfoForm.addControl('currentPassword', new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* FormControl */]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["l" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["l" /* Validators */].pattern(__WEBPACK_IMPORTED_MODULE_6__shared_common_util_validation__["a" /* Validation */].PASSWORD_REGEX),
            this.passwordConfirmed.bind(this)]));
        this.appUserInfoForm.addControl('confirmPassword', new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* FormControl */]('', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["l" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["l" /* Validators */].pattern(__WEBPACK_IMPORTED_MODULE_6__shared_common_util_validation__["a" /* Validation */].PASSWORD_REGEX),
            this.passwordConfirmed.bind(this)]));
    }
    /**
     * Sets a field in the App User Info form to be editable and focuses the form control used for editing.
     * @param editFormControlId The id of the form control that will be used for editing.
     */
    AppUserInfoComponent.prototype.setEditable = function (editFormControlId) {
        // Reset the validation state of the fields involved in the edit.
        this.controls[editFormControlId].markAsUntouched();
        if (editFormControlId === 'password') {
            this.controls.currentPassword.markAsUntouched();
            this.controls.confirmPassword.markAsUntouched();
        }
        this.editFlags.set(editFormControlId, true);
        // Force processing of form input element after it is shown (via *ngIf) by inserting into end of event queue (via setTimeout).
        setTimeout(function () {
            document.getElementById(editFormControlId).focus();
        }, 0);
    };
    /**
     * Saves the new password value.
     */
    AppUserInfoComponent.prototype.savePassword = function () {
        // Make sure we can see valid state.
        this.forceValidation(this.controls.currentPassword);
        this.forceValidation(this.controls.password);
        this.forceValidation(this.controls.confirmPassword);
        // First validate the current password and confirm password fields before saving the password.
        if (this.isValid(this.controls.currentPassword)
            && this.isValid(this.controls.confirmPassword)) {
            this.save(this.controls.password, 'password');
        }
    };
    /**
     * Saves the value of a field and disables edit mode for the given field if the value of the field is valid.
     * @param saveFormControl The form control that the save is associated with.
     * @param saveFormControlName The name of the form control used for switching off the associated edit flag.
     */
    AppUserInfoComponent.prototype.save = function (saveFormControl, saveFormControlName) {
        var _this = this;
        // Make sure we can see valid state.
        this.forceValidation(saveFormControl);
        if (this.isValid(saveFormControl)) {
            var appUserInfoUpdate = new __WEBPACK_IMPORTED_MODULE_5__shared_authentication_app_user_info__["a" /* AppUserInfo */]();
            // Grab current password entered by user if this is a password update.
            var newPassword = null;
            var currentPassword = null;
            if (saveFormControlName === 'password') {
                newPassword = saveFormControl.value;
                currentPassword = this.controls.currentPassword.value;
            }
            else {
                // Only send entry that is being saved to the server. AppUserInfo field will have same name as corresponding view model form control!
                appUserInfoUpdate[saveFormControlName] = saveFormControl.value;
            }
            // Send save field update to server and listen for response.
            var observable = this.appUserUpdateService.updateAppUserInfo(appUserInfoUpdate, newPassword, currentPassword);
            this.busySaveConfig.busy = observable.subscribe(function (response) {
                if (response.success) {
                    _this.editFlags.set(saveFormControlName, false); // Set edit off for this valid field.
                }
                else {
                    console.log(response.message);
                }
            });
        }
    };
    /**
     * Validator used to check if the password and confirm password values are equal.
     * @return null if they are equal, or { passwordConfirmed: false } object if they are not.
     */
    AppUserInfoComponent.prototype.passwordConfirmed = function () {
        // If the password and confirm password fields match or the fields do not yet exist.
        if (this.controls.password == null
            || this.controls.confirmPassword == null
            || this.controls.password.value === this.controls.confirmPassword.value) {
            return null; // Valid (return no error flag)
        }
        return { passwordConfirmed: true }; // Invalid (return passwordConfirmed error flag)
    };
    /**
     * Forces a given field to validate by marking it touched and dirty.
     * @param validField The field to force validation on.
     */
    AppUserInfoComponent.prototype.forceValidation = function (validField) {
        validField.markAsTouched();
        validField.markAsDirty();
    };
    /**
     * Checks if a given field is valid.
     * @param validField The field to check for validity.
     * @return true if the field is valid, false if not.
     */
    AppUserInfoComponent.prototype.isValid = function (validField) {
        return (validField.errors == null || !validField.touched || !validField.dirty);
    };
    Object.defineProperty(AppUserInfoComponent.prototype, "controls", {
        /**
         * Gets a raw list of the form controls.
         */
        get: function () {
            return this.appUserInfoForm.controls;
        },
        enumerable: true,
        configurable: true
    });
    AppUserInfoComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-app-user-info',
            template: __webpack_require__("../../../../../client/src/app/authentication/app-user-info/app-user-info.component.html"),
            styles: [__webpack_require__("../../../../../client/src/app/authentication/app-user-info/app-user-info.component.css")],
            providers: [__WEBPACK_IMPORTED_MODULE_2__app_user_update_service__["a" /* AppUserUpdateService */]]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_forms__["b" /* FormBuilder */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_forms__["b" /* FormBuilder */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__app_user_update_service__["a" /* AppUserUpdateService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__app_user_update_service__["a" /* AppUserUpdateService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__common_util_session_data_service__["a" /* SessionDataService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__common_util_session_data_service__["a" /* SessionDataService */]) === "function" && _c || Object])
    ], AppUserInfoComponent);
    return AppUserInfoComponent;
    var _a, _b, _c;
}());

//# sourceMappingURL=app-user-info.component.js.map

/***/ }),

/***/ "../../../../../client/src/app/authentication/app-user-info/app-user-update.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppUserUpdateService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_util_request_service__ = __webpack_require__("../../../../../client/src/app/common-util/request.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shared_authentication_update_app_user_message__ = __webpack_require__("../../../../../shared/authentication/update-app-user-message.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AppUserUpdateService = (function () {
    function AppUserUpdateService(requestService) {
        this.requestService = requestService;
    }
    /**
     * Sends App User Update Info to the server and listens for a response.
     * @param appUserInfoUpdate Contains the update information. Any non-null values will be used to update App User information.
     * @param newPassword The password update.
     * @param currentPassword Only required when the password is being updated. Should contain the current password of the user.
     */
    AppUserUpdateService.prototype.updateAppUserInfo = function (appUserInfoUpdate, newPassword, currentPassword) {
        var body = new __WEBPACK_IMPORTED_MODULE_2__shared_authentication_update_app_user_message__["a" /* UpdateAppUserRequest */](appUserInfoUpdate, newPassword, currentPassword);
        var observer = this.requestService.post('/authentication/updateAppUser', body);
        return observer.map(function (response) {
            var appUserUpdateResponse = response.json();
            console.log(appUserUpdateResponse.message);
            // TODO: generate login popup if session ended and resend request upon login response.
            return appUserUpdateResponse;
        });
    };
    AppUserUpdateService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__common_util_request_service__["a" /* RequestService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__common_util_request_service__["a" /* RequestService */]) === "function" && _a || Object])
    ], AppUserUpdateService);
    return AppUserUpdateService;
    var _a;
}());

//# sourceMappingURL=app-user-update.service.js.map

/***/ }),

/***/ "../../../../../client/src/app/authentication/login/login-model.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginModel; });
/**
 * Contains state data for the Login Component.
 */
var LoginModel = (function () {
    function LoginModel() {
        this.loginError = false;
    }
    return LoginModel;
}());

//# sourceMappingURL=login-model.js.map

/***/ }),

/***/ "../../../../../client/src/app/authentication/login/login.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ":host {\r\n\t-webkit-box-flex: 1;\r\n\t    -ms-flex-positive: 1;\r\n\t        flex-grow: 1;\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    text-align: center;\r\n\t-webkit-box-pack: center;\r\n\t    -ms-flex-pack: center;\r\n\t        justify-content: center;\r\n\t-webkit-box-align: center;\r\n\t    -ms-flex-align: center;\r\n\t        align-items: center;\r\n}\r\n\r\nmd-form-field {\r\n    font-size: 25px;\r\n    width: 100%;\r\n}\r\n\r\n.modal-header {\r\n    background-color: #222222;\r\n    color: white;\r\n}\r\n\r\n#login-div {\r\n    text-align: right;\r\n}\r\n\r\n.close {\r\n    color: white;\r\n\tdisplay: block;\r\n    border-radius: 50%;\r\n    font-size: 40px;\r\n    margin: 0px;\r\n    padding: 0px;\r\n    width: 40px;\r\n    height: 40px;\r\n    line-height: 40px;\r\n    text-align: center;\r\n    outline: none;\r\n    transition: -webkit-transform .8s ease-in-out;\r\n    transition: transform .8s ease-in-out;\r\n    transition: transform .8s ease-in-out, -webkit-transform .8s ease-in-out;\r\n}\r\n\r\n.close:hover {\r\n    -webkit-transform: rotate(180deg);\r\n    transform: rotate(180deg);\r\n}\r\n\r\n#loginErr {\r\n\ttext-align: center;\r\n\tcolor: red;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../client/src/app/authentication/login/login.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-dialog\">\n\t<div class=\"modal-content\">\n\t\t<div class=\"modal-header\" style=\"background-color: #222222\">\n\t\t\t<h1 class=\"modal-title\">Login</h1>\n\t\t\t<button type=\"button\" class=\"close\" (click)=\"close()\">&times;</button>\n\t\t</div>\n\t\t<div class=\"modal-body\">\n\t\t\t<form ngNativeValidate (submit)=\"loginUser($event)\">\n                <div>\n                    <md-form-field>\n                        <input #email mdInput placeholder=\"email\" id=\"email\" name=\"username\"\n                         [(ngModel)]=\"loginModel.username\" type=\"text\" required spellcheck=\"false\" autocomplete=\"on\">\n                    </md-form-field>\n                </div>\n                <div>\n                    <md-form-field>\n                        <input #password mdInput placeholder=\"password\" id=\"password\" name=\"password\" [(ngModel)]=\"loginModel.password\" type=\"password\" required autocomplete=\"on\">\n                    </md-form-field>\n                </div>\n                <div id=\"login-div\" class=\"input\">\n                    <button md-raised-button color=\"primary\" class=\"button-md\" type=\"submit\">Login</button>\n                </div>\n\t\t\t</form>\n\t\t</div>\n\t\t<div class=\"modal-footer\" *ngIf=\"loginModel.loginError\">\n\t\t\t<p id=\"loginErr\">Incorrect login information. Please Try Again.</p>\n\t\t</div>\n\t</div>\n</div>\n"

/***/ }),

/***/ "../../../../../client/src/app/authentication/login/login.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap_modal__ = __webpack_require__("../../../../ng2-bootstrap-modal/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap_modal___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap_modal__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__login_service__ = __webpack_require__("../../../../../client/src/app/authentication/login/login.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__login_model__ = __webpack_require__("../../../../../client/src/app/authentication/login/login-model.ts");
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var LoginComponent = (function (_super) {
    __extends(LoginComponent, _super);
    function LoginComponent(dialogService, authenticationService) {
        var _this = _super.call(this, dialogService) || this;
        _this.dialogService = dialogService;
        _this.authenticationService = authenticationService;
        _this.loginModel = new __WEBPACK_IMPORTED_MODULE_3__login_model__["a" /* LoginModel */]();
        return _this;
    }
    LoginComponent_1 = LoginComponent;
    LoginComponent.prototype.ngOnInit = function () {
        // Required to fix bug where autofocus does not work when opening dialog more than once (cannot just use HTML autofocus property)!
        var emailInput = document.getElementById('email');
        emailInput.focus();
    };
    LoginComponent.display = function (dialogService) {
        return dialogService.addDialog(LoginComponent_1, 
        // Dialog Initalization Data
        null, 
        // DialogOptions
        {
            closeByClickingOutside: true,
            backdropColor: '#444444',
        });
    };
    LoginComponent.prototype.loginUser = function (event) {
        var _this = this;
        event.preventDefault();
        var observer = this.authenticationService.login(this.loginModel);
        // This is the promise we get
        observer.subscribe(function (data) {
            // See if Login is a success.
            if (data.success)
                _this.close();
            else
                _this.loginModel.loginError = true;
        }, function (error) {
            console.log(error);
            // Shouldn't happen!
        });
        // TODO: We should put some loading symbol in login popup here!!!
    };
    LoginComponent = LoginComponent_1 = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-login',
            template: __webpack_require__("../../../../../client/src/app/authentication/login/login.component.html"),
            styles: [__webpack_require__("../../../../../client/src/app/authentication/login/login.component.css")],
            providers: [__WEBPACK_IMPORTED_MODULE_2__login_service__["a" /* LoginService */]]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap_modal__["DialogService"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap_modal__["DialogService"]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__login_service__["a" /* LoginService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__login_service__["a" /* LoginService */]) === "function" && _b || Object])
    ], LoginComponent);
    return LoginComponent;
    var LoginComponent_1, _a, _b;
}(__WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap_modal__["DialogComponent"]));

//# sourceMappingURL=login.component.js.map

/***/ }),

/***/ "../../../../../client/src/app/authentication/login/login.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/@angular/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_util_session_data_service__ = __webpack_require__("../../../../../client/src/app/common-util/session-data.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shared_authentication_login_message__ = __webpack_require__("../../../../../shared/authentication/login-message.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var LoginService = (function () {
    function LoginService(http, sessionDataService) {
        this.http = http;
        this.sessionDataService = sessionDataService;
    }
    LoginService.prototype.login = function (loginModel) {
        var _this = this;
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Headers */]({
            'Content-Type': 'application/json'
        });
        // NOTE: Should user raw http request here instead of RequestService wrapper since RequestService depends on this LoginService (prevent circular dependency)!
        var observer = this.http.post('/authentication/login', new __WEBPACK_IMPORTED_MODULE_3__shared_authentication_login_message__["a" /* LoginRequest */](loginModel.username, loginModel.password), { headers: headers });
        return observer.map(function (response) {
            var loginResponse = response.json();
            console.log(loginResponse.message);
            if (loginResponse.success) {
                _this.sessionDataService.updateAppUserSessionData(loginResponse.appUserInfo);
            }
            return { success: loginResponse.success, message: loginResponse.message };
        });
    };
    LoginService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__common_util_session_data_service__["a" /* SessionDataService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__common_util_session_data_service__["a" /* SessionDataService */]) === "function" && _b || Object])
    ], LoginService);
    return LoginService;
    var _a, _b;
}());

//# sourceMappingURL=login.service.js.map

/***/ }),

/***/ "../../../../../client/src/app/authentication/misc/logout.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LogoutService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_util_request_service__ = __webpack_require__("../../../../../client/src/app/common-util/request.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_util_session_data_service__ = __webpack_require__("../../../../../client/src/app/common-util/session-data.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var LogoutService = (function () {
    function LogoutService(router, requestService, sessionDataService) {
        this.router = router;
        this.requestService = requestService;
        this.sessionDataService = sessionDataService;
    }
    LogoutService.prototype.logout = function () {
        var _this = this;
        this.requestService.get('/authentication/logout').subscribe(function () {
            _this.sessionDataService.clearSessionData();
            _this.router.navigate(['/home']);
        });
        // Not interested in the response...
    };
    LogoutService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__common_util_request_service__["a" /* RequestService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__common_util_request_service__["a" /* RequestService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__common_util_session_data_service__["a" /* SessionDataService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__common_util_session_data_service__["a" /* SessionDataService */]) === "function" && _c || Object])
    ], LogoutService);
    return LogoutService;
    var _a, _b, _c;
}());

//# sourceMappingURL=logout.service.js.map

/***/ }),

/***/ "../../../../../client/src/app/authentication/signup/signup.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "#signup-error {\r\n\ttext-align: center;\r\n    color: red;\r\n    font-weight: bold;\r\n    font-size: 20px;\r\n}\r\n\r\nlabel, md-radio-group {\r\n    font-weight: bold;\r\n    font-size: 22px;\r\n}\r\n\r\nh2 {\r\n    font-weight: bold;\r\n}\r\n\r\n.button-md {\r\n    margin-left: 15px;\r\n}\r\n\r\nmd-input-container, md-select {\r\n    width: 100%;\r\n}\r\n\r\nmd-select {\r\n    margin-bottom: 20px;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../client/src/app/authentication/signup/signup.component.html":
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"!signupComplete\" class=\"container\">\r\n\r\n    <form ngNativeValidate (submit)=\"signupUser($event)\">\r\n        <h2 class=\"center-text\">What Type of User Are You</h2>\r\n        <hr>\r\n        <md-radio-group class=\"row center-text\" required>\r\n            <div class=\"col-md-6\">\r\n                <md-radio-button name=\"accountType\" value=\"business\" (click)=\"setAppUserType('business')\">\r\n                    Business\r\n                </md-radio-button>\r\n            </div>\r\n            <div class=\"col-md-6\">\r\n                <md-radio-button name=\"accountType\" value=\"personal\" (click)=\"setAppUserType('personal')\">\r\n                    Personal\r\n                </md-radio-button>\r\n            </div>\r\n        </md-radio-group>\r\n\r\n        <ng-container *ngIf=\"appUserTypeSelected\">\r\n            <br><br><br><br>\r\n\r\n            <h2 class=\"center-text\">What Will You Be Doing</h2>\r\n            <hr>\r\n            <md-radio-group class=\"row center-text\" required>\r\n                <div class=\"col-md-4\">\r\n                    <md-radio-button name=\"accountFunction\" value=\"donor\" (click)=\"setAppUserFunction('donor')\">\r\n                        Donating\r\n                    </md-radio-button>\r\n                </div>\r\n                <div class=\"col-md-4\">\r\n                    <md-radio-button name=\"accountFunction\" value=\"receiver\" (click)=\"setAppUserFunction('receiver')\">\r\n                        Receiving\r\n                    </md-radio-button>\r\n                </div>\r\n                <div class=\"col-md-4\">\r\n                    <md-radio-button name=\"accountFunction\" value=\"both\" (click)=\"setAppUserFunction('both')\">\r\n                        Both\r\n                    </md-radio-button>\r\n                </div>\r\n            </md-radio-group>\r\n            <br><br><br><br>\r\n        </ng-container>\r\n\r\n        <ng-container *ngIf=\"appUserTypeSelected && appUserFunctionSelected\">\r\n            <h2 class=\"center-text\">Credentials and Contact Info</h2>\r\n            <hr>\r\n            <div class=\"row\">\r\n                <div class=\"col-md-6\">\r\n                    <md-input-container class=\"form-group\">\r\n                        <input mdInput [placeholder]=\"emailLabel\" type=\"email\" name=\"username\" [(ngModel)]=\"appUserSignupInfo.email\" required autocomplete=\"off\">\r\n                    </md-input-container>\r\n\r\n                    <md-input-container class=\"form-group\">\r\n                        <input mdInput placeholder=\"Password\" type=\"password\" name=\"password\" [(ngModel)]=\"password\" required autocomplete=\"new-password\">\r\n                    </md-input-container>\r\n\r\n                    <md-input-container class=\"form-group\" *ngIf=\"isBusiness\">\r\n                        <input mdInput placeholder=\"Organization Name\" name=\"organizationName\" [(ngModel)]=\"appUserSignupInfo.organizationName\" required>\r\n                    </md-input-container>\r\n\r\n                    <md-input-container class=\"form-group\">\r\n                        <input mdInput [placeholder]=\"firstNameLabel\" name=\"fname\" [(ngModel)]=\"appUserSignupInfo.firstName\" required>\r\n                    </md-input-container>\r\n\r\n                    <md-input-container class=\"form-group\">\r\n                        <input mdInput [placeholder]=\"lastNameLabel\" name=\"lname\" [(ngModel)]=\"appUserSignupInfo.lastName\" required>\r\n                    </md-input-container>\r\n                </div>\r\n\r\n                <div class=\"col-md-6\">\r\n                    <md-input-container class=\"form-group\">\r\n                        <input mdInput placeholder=\"Street Address\" name=\"address\" [(ngModel)]=\"appUserSignupInfo.address\" required>\r\n                    </md-input-container>\r\n\r\n                    <md-input-container class=\"form-group\">\r\n                        <input mdInput placeholder=\"City\" name=\"city\" [(ngModel)]=\"appUserSignupInfo.city\" required>\r\n                    </md-input-container>\r\n\r\n                    <div class=\"form-group\">\r\n                        <md-select name=\"state\" placeholder=\"State\" [(ngModel)]=\"appUserSignupInfo.state\" required>\r\n                            <md-option *ngFor=\"let stateStr of stateList\" [value]=\"stateStr\">{{stateStr}}</md-option>\r\n                        </md-select>\r\n                    </div>\r\n\r\n                    <md-input-container class=\"form-group\">\r\n                        <input mdInput placeholder=\"ZIP Code\" name=\"zip\" maxlength=\"5\" [(ngModel)]=\"appUserSignupInfo.zip\" required>\r\n                    </md-input-container>\r\n                    \r\n                    <md-input-container class=\"form-group\">\r\n                        <input mdInput placeholder=\"Phone\" name=\"phone\" [(ngModel)]=\"appUserSignupInfo.phone\" minlength=\"12\" maxlength=\"12\" required>\r\n                    </md-input-container>\r\n                </div>\r\n\r\n                <button md-raised-button color=\"primary\" class=\"button-md\" type=\"submit\">Submit</button>\r\n            </div>\r\n        </ng-container>\r\n    </form>\r\n    <div *ngIf=\"signupError != null\" id=\"signup-error\">{{signupError}}</div>\r\n</div>\r\n\r\n\r\n<div *ngIf=\"signupComplete\" class=\"container\">\r\n    <p>\r\n        Thank-you for joining Food Web!\r\n    </p>\r\n    <br>\r\n    \r\n    <p *ngIf=\"isBusiness\">\r\n        We will contact you by phone to verify your signup. Please allow up to 2 business days to receive a call from us.\r\n    </p>\r\n    <p *ngIf=\"!isBusiness\">\r\n        A confirmation link will be sent to you via email. Please follow the link to confirm your signup.\r\n    </p>\r\n</div>\r\n"

/***/ }),

/***/ "../../../../../client/src/app/authentication/signup/signup.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SignupComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__signup_service__ = __webpack_require__("../../../../../client/src/app/authentication/signup/signup.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shared_authentication_app_user_info__ = __webpack_require__("../../../../../shared/authentication/app-user-info.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var SignupComponent = (function () {
    function SignupComponent(router, signupService) {
        this.router = router;
        this.signupService = signupService;
        this.appUserSignupInfo = new __WEBPACK_IMPORTED_MODULE_3__shared_authentication_app_user_info__["a" /* AppUserInfo */]();
        this.stateList = ['CA', 'NY', 'IN'];
        this.signupError = null;
        this.signupComplete = false;
        this.appUserTypeSelected = false;
        this.appUserFunctionSelected = false;
        this.isBusiness = false;
    }
    SignupComponent.prototype.ngOnInit = function () { };
    SignupComponent.prototype.signupUser = function (event) {
        var _this = this;
        event.preventDefault();
        var observer = this.signupService.signup(this.appUserSignupInfo, this.password);
        observer.subscribe(
        // When we have no errors connecting to server.
        function (signupResponse) {
            if (signupResponse.success) {
                _this.signupError = null;
                _this.signupComplete = true;
                scroll(0, 0);
            }
            else {
                _this.signupError = signupResponse.message;
            }
        }, 
        // When we have errors connecting to server.
        function (err) {
            _this.signupError = 'Error: could not communication with server';
            console.log(err);
        });
    };
    SignupComponent.prototype.setAppUserType = function (appUserType) {
        if (appUserType.toLowerCase() === 'personal') {
            this.emailLabel = 'Email';
            this.firstNameLabel = 'First Name';
            this.lastNameLabel = 'Last Name';
            this.isBusiness = false;
        }
        else {
            this.emailLabel = 'Organization Email';
            this.firstNameLabel = 'Admin First Name';
            this.lastNameLabel = 'Admin Last Name';
            this.isBusiness = true;
        }
        this.appUserTypeSelected = true;
    };
    SignupComponent.prototype.setAppUserFunction = function (appUserFunction) {
        // First set all possible App User functions to true, and turn certain ones off based on given function.
        this.appUserSignupInfo.isDonor = true;
        this.appUserSignupInfo.isReceiver = true;
        switch (appUserFunction.toLowerCase()) {
            case 'donor':
                this.appUserSignupInfo.isReceiver = false;
                break;
            case 'receiver':
                this.appUserSignupInfo.isDonor = false;
                break;
            case 'both': break;
            default: throw new Error('Incorrect App User Function set: ' + appUserFunction);
        }
        this.appUserFunctionSelected = true;
    };
    SignupComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Component"])({
            selector: 'app-signup',
            template: __webpack_require__("../../../../../client/src/app/authentication/signup/signup.component.html"),
            styles: [__webpack_require__("../../../../../client/src/app/authentication/signup/signup.component.css")],
            providers: [__WEBPACK_IMPORTED_MODULE_2__signup_service__["a" /* SignupService */]]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_router__["a" /* Router */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__signup_service__["a" /* SignupService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__signup_service__["a" /* SignupService */]) === "function" && _b || Object])
    ], SignupComponent);
    return SignupComponent;
    var _a, _b;
}());

//# sourceMappingURL=signup.component.js.map

/***/ }),

/***/ "../../../../../client/src/app/authentication/signup/signup.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SignupService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_util_request_service__ = __webpack_require__("../../../../../client/src/app/common-util/request.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_util_session_data_service__ = __webpack_require__("../../../../../client/src/app/common-util/session-data.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shared_authentication_signup_message__ = __webpack_require__("../../../../../shared/authentication/signup-message.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var SignupService = (function () {
    function SignupService(requestService, sessionDataService) {
        this.requestService = requestService;
        this.sessionDataService = sessionDataService;
    }
    SignupService.prototype.signup = function (appUserSignupInfo, password) {
        var _this = this;
        var body = new __WEBPACK_IMPORTED_MODULE_3__shared_authentication_signup_message__["a" /* SignupRequest */](appUserSignupInfo, password);
        var observer = this.requestService.post('/authentication/signup', body);
        return observer.map(function (response) {
            var signupResponse = response.json();
            console.log(signupResponse.message);
            // On successful signup, cache the App User's data in global front end session storage.
            if (signupResponse.success) {
                _this.sessionDataService.updateAppUserSessionData(appUserSignupInfo);
            }
            return signupResponse;
        });
    };
    SignupService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__common_util_request_service__["a" /* RequestService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__common_util_request_service__["a" /* RequestService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__common_util_session_data_service__["a" /* SessionDataService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__common_util_session_data_service__["a" /* SessionDataService */]) === "function" && _b || Object])
    ], SignupService);
    return SignupService;
    var _a, _b;
}());

//# sourceMappingURL=signup.service.js.map

/***/ }),

/***/ "../../../../../client/src/app/banner/banner.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "#banner {\r\n\tposition: relative;\r\n\twidth: 100%;\r\n\tmargin-top: -75px; /*Bring the banner up to be positioned within the header just below the nav!*/\r\n}\r\n\r\n@media screen and (max-width: 767px) {\r\n\t#banner {\r\n\t\tvisibility: hidden;\r\n\t\tposition: absolute;\r\n\t}\r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../client/src/app/banner/banner.component.html":
/***/ (function(module, exports) {

module.exports = "<img id=\"banner\" [src]=\"bannerSrc\" [style.height]=\"bannerHeight\">\n"

/***/ }),

/***/ "../../../../../client/src/app/banner/banner.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BannerComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var BannerComponent = (function () {
    function BannerComponent() {
    }
    BannerComponent.prototype.ngOnInit = function () {
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], BannerComponent.prototype, "bannerSrc", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], BannerComponent.prototype, "bannerHeight", void 0);
    BannerComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-banner',
            template: __webpack_require__("../../../../../client/src/app/banner/banner.component.html"),
            styles: [__webpack_require__("../../../../../client/src/app/banner/banner.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], BannerComponent);
    return BannerComponent;
}());

//# sourceMappingURL=banner.component.js.map

/***/ }),

/***/ "../../../../../client/src/app/cart/cart.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "label {\r\n    padding-bottom: 0px;\r\n    margin-bottom: 0px;\r\n}\r\n\r\n@media only screen and (max-width: 1200px) {\r\n    #food-listings {\r\n        float: none;\r\n        padding-left: 40px;\r\n        margin-left: auto;\r\n        margin-right: auto;\r\n    }\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../client/src/app/cart/cart.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid\">\r\n    <div id=\"cart-row\" class=\"row\" style=\"padding-top:2vh\">\r\n        <div class=\"col-md-3\" id=\"filters\">\r\n            <app-food-listings-filters header=\"Cart Filters\" [formGroup]=\"foodListingsFilters.filtersForm\"\r\n             id=\"food-listings-filters\" [defaultLatestExpireNow]=\"false\" #foodListingsFilters>\r\n\r\n                <ng-container *ngIf=\"isDonorAndReceiver\" top>\r\n                    <h4>Listings Status:</h4>\r\n                    <div class=\"form-group\">\r\n                        <md-radio-group formControlName=\"listingsStatus\">\r\n                            <label for=\"claimed\" class=\"checkbox-compress\">\r\n                                <md-radio-button type=\"radio\" id=\"claimed\" name=\"listingsStatus\" checked=\"checked\" [value]=\"LISTINGS_STATUS.myClaimedListings\">\r\n                                    Claimed\r\n                                </md-radio-button>\r\n                            </label>\r\n                            <br>\r\n                            <label for=\"donated\" class=\"checkbox-compress\">\r\n                                <md-radio-button type=\"radio\" id=\"donated\" name=\"listingsStatus\" [value]=\"LISTINGS_STATUS.myDonatedListings\">\r\n                                    Donated\r\n                                </md-radio-button>\r\n                            </label>\r\n                        </md-radio-group>\r\n                    </div>\r\n                </ng-container>\r\n\r\n            </app-food-listings-filters>\r\n        </div>\r\n\r\n        <div id=\"cart-listings-col\" class=\"col-md-9\">\r\n            <app-food-listings [header]=\"getFoodListingsTitle()\" id=\"food-listings\" #foodListings>\r\n                <ng-container details-modal-footer>\r\n                    <button md-raised-button color=\"primary\" class=\"button-md\" *ngIf=\"isClaimedCart()\" (click)=\"unclaimSelectedFoodListing()\">Unclaim</button>\r\n                    <button md-raised-button color=\"primary\" class=\"button-md\" *ngIf=\"isDonatedCart()\" (click)=\"removeSelectedFoodListing()\">Remove Donation</button>\r\n                </ng-container>\r\n            </app-food-listings>\r\n        </div>\r\n    </div>\r\n</div>"

/***/ }),

/***/ "../../../../../client/src/app/cart/cart.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CartComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__("../../../forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__food_listings_food_listings_filters_food_listings_filters_component__ = __webpack_require__("../../../../../client/src/app/food-listings/food-listings-filters/food-listings-filters.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__food_listings_food_listings_component__ = __webpack_require__("../../../../../client/src/app/food-listings/food-listings.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__food_listings_claim_unclaim_food_listing_service__ = __webpack_require__("../../../../../client/src/app/food-listings/claim-unclaim-food-listing.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__food_listings_add_remove_food_listing_service__ = __webpack_require__("../../../../../client/src/app/food-listings/add-remove-food-listing.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__common_util_session_data_service__ = __webpack_require__("../../../../../client/src/app/common-util/session-data.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__shared_food_listings_food_listings_filters__ = __webpack_require__("../../../../../shared/food-listings/food-listings-filters.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var CartComponent = (function () {
    function CartComponent(sessionDataService, claimFoodListingService, addRemoveFoodListingService) {
        this.sessionDataService = sessionDataService;
        this.claimFoodListingService = claimFoodListingService;
        this.addRemoveFoodListingService = addRemoveFoodListingService;
        // Need to declare LISTINGS_STATUS enum inside component to be used in the HTML template!
        this.LISTINGS_STATUS = __WEBPACK_IMPORTED_MODULE_7__shared_food_listings_food_listings_filters__["a" /* LISTINGS_STATUS */];
    }
    CartComponent.prototype.ngOnInit = function () {
        var appUserInfo = this.sessionDataService.getAppUserSessionData();
        /**
         *  Retrieves user data from session storage to
         *  determine initial cart type and mutability of cart type
         */
        this.isDonorAndReceiver = (appUserInfo.isReceiver && appUserInfo.isDonor);
        if (appUserInfo.isReceiver) {
            // If both receiver and donor, then default to receiver mode!
            this.foodListingsFiltersComponent.addControl('listingsStatus', new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* FormControl */](__WEBPACK_IMPORTED_MODULE_7__shared_food_listings_food_listings_filters__["a" /* LISTINGS_STATUS */].myClaimedListings));
        }
        else {
            this.foodListingsFiltersComponent.addControl('listingsStatus', new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* FormControl */](__WEBPACK_IMPORTED_MODULE_7__shared_food_listings_food_listings_filters__["a" /* LISTINGS_STATUS */].myDonatedListings));
        }
    };
    /**
     * Executed after all of the view children have been initialized (so safest to interact with them now).
     */
    CartComponent.prototype.ngAfterViewInit = function () {
        this.foodListingsComponent.refreshFoodListings(this.foodListingsFiltersComponent.getFilterValues());
        this.foodListingsFiltersComponent.onFiltersUpdate(this.foodListingsComponent.refreshFoodListings.bind(this.foodListingsComponent));
    };
    CartComponent.prototype.getFoodListingsTitle = function () {
        return (this.isClaimedCart() ? 'Claimed Food'
            : 'Donated Food');
    };
    CartComponent.prototype.isClaimedCart = function () {
        return (this.foodListingsFiltersComponent.getFilterValues().listingsStatus === __WEBPACK_IMPORTED_MODULE_7__shared_food_listings_food_listings_filters__["a" /* LISTINGS_STATUS */].myClaimedListings);
    };
    CartComponent.prototype.isDonatedCart = function () {
        return (this.foodListingsFiltersComponent.getFilterValues().listingsStatus === __WEBPACK_IMPORTED_MODULE_7__shared_food_listings_food_listings_filters__["a" /* LISTINGS_STATUS */].myDonatedListings);
    };
    CartComponent.prototype.unclaimSelectedFoodListing = function () {
        var _this = this;
        if (confirm('Are you sure you want to unclaim the food?\nThis cannot be undone.')) {
            var selectedFoodListing = this.foodListingsComponent.getSelectedFoodListing();
            var observer = this.claimFoodListingService.unclaimFoodListing(selectedFoodListing.foodListingKey);
            observer.subscribe(function () {
                _this.foodListingsComponent.removeSelectedFoodListing();
            }, function (err) {
                console.log(err);
            });
        }
    };
    CartComponent.prototype.removeSelectedFoodListing = function () {
        var _this = this;
        var selectedFoodListing = this.foodListingsComponent.getSelectedFoodListing();
        var observer = this.addRemoveFoodListingService.removeFoodListing(selectedFoodListing.foodListingKey);
        observer.subscribe(function () {
            _this.foodListingsComponent.removeSelectedFoodListing();
        }, function (err) {
            console.log(err);
        });
    };
    // Changes status of listings in a use cart through left panel buttons or modal buttons
    CartComponent.prototype.mutateListingStatus = function (singleListingFlag, upgradeListingFlag) {
        var selectedFoodListings;
        if (singleListingFlag) {
            // For changing the status of only one listing (via modal button)
            selectedFoodListings = [this.foodListingsComponent.getSelectedFoodListing()];
        }
        else {
            // For changing the status of all cart listings (via left panel button)
            selectedFoodListings = this.foodListingsComponent.getDisplayedListings();
        }
        if (upgradeListingFlag) {
            // Send chosen food listings to backend for status upgrade
        }
        else {
            // Send chosen food listings to backend for status downgrade
        }
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('foodListingsFilters'),
        __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__food_listings_food_listings_filters_food_listings_filters_component__["a" /* FoodListingsFiltersComponent */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__food_listings_food_listings_filters_food_listings_filters_component__["a" /* FoodListingsFiltersComponent */]) === "function" && _a || Object)
    ], CartComponent.prototype, "foodListingsFiltersComponent", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('foodListings'),
        __metadata("design:type", typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__food_listings_food_listings_component__["a" /* FoodListingsComponent */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__food_listings_food_listings_component__["a" /* FoodListingsComponent */]) === "function" && _b || Object)
    ], CartComponent.prototype, "foodListingsComponent", void 0);
    CartComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-cart',
            template: __webpack_require__("../../../../../client/src/app/cart/cart.component.html"),
            styles: [__webpack_require__("../../../../../client/src/app/cart/cart.component.css")],
            providers: [
                __WEBPACK_IMPORTED_MODULE_6__common_util_session_data_service__["a" /* SessionDataService */],
                __WEBPACK_IMPORTED_MODULE_4__food_listings_claim_unclaim_food_listing_service__["a" /* ClaimFoodListingService */],
                __WEBPACK_IMPORTED_MODULE_5__food_listings_add_remove_food_listing_service__["a" /* AddRemoveFoodListingService */]
            ]
        }),
        __metadata("design:paramtypes", [typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_6__common_util_session_data_service__["a" /* SessionDataService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_6__common_util_session_data_service__["a" /* SessionDataService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__food_listings_claim_unclaim_food_listing_service__["a" /* ClaimFoodListingService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__food_listings_claim_unclaim_food_listing_service__["a" /* ClaimFoodListingService */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_5__food_listings_add_remove_food_listing_service__["a" /* AddRemoveFoodListingService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__food_listings_add_remove_food_listing_service__["a" /* AddRemoveFoodListingService */]) === "function" && _e || Object])
    ], CartComponent);
    return CartComponent;
    var _a, _b, _c, _d, _e;
}());

//# sourceMappingURL=cart.component.js.map

/***/ }),

/***/ "../../../../../client/src/app/common-util/date-formatter.pipe.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DateFormatterPipe; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shared_common_util_date_formatter__ = __webpack_require__("../../../../../shared/common-util/date-formatter.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var DateFormatterPipe = (function () {
    function DateFormatterPipe() {
    }
    DateFormatterPipe.prototype.transform = function (value, args) {
        return __WEBPACK_IMPORTED_MODULE_1__shared_common_util_date_formatter__["a" /* DateFormatter */].dateToMonthDayYearString(value);
    };
    DateFormatterPipe = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Pipe"])({
            name: 'dateFormatter'
        })
    ], DateFormatterPipe);
    return DateFormatterPipe;
}());

//# sourceMappingURL=date-formatter.pipe.js.map

/***/ }),

/***/ "../../../../../client/src/app/common-util/food-web-busy-config.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FoodWebBusyConfig; });
/**
 * Default configuration for a busy loading symbol when wating for responses.
 */
var FoodWebBusyConfig = (function () {
    function FoodWebBusyConfig(message, backdrop, delay, minDuration) {
        if (message === void 0) { message = 'Please Wait'; }
        if (backdrop === void 0) { backdrop = true; }
        if (delay === void 0) { delay = 100; }
        if (minDuration === void 0) { minDuration = 0; }
        this.message = message;
        this.backdrop = backdrop;
        this.delay = delay;
        this.minDuration = minDuration;
        this.busy = null;
    }
    return FoodWebBusyConfig;
}());

//# sourceMappingURL=food-web-busy-config.js.map

/***/ }),

/***/ "../../../../../client/src/app/common-util/request.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RequestService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/@angular/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__("../../../../rxjs/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ng2_bootstrap_modal__ = __webpack_require__("../../../../ng2-bootstrap-modal/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ng2_bootstrap_modal___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_ng2_bootstrap_modal__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__common_util_session_data_service__ = __webpack_require__("../../../../../client/src/app/common-util/session-data.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__authentication_login_login_component__ = __webpack_require__("../../../../../client/src/app/authentication/login/login.component.ts");
/* unused harmony reexport Response */
/* TODO: This file is a hell of a lot confusing... simplify in future. For now, just made lots of comments. */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







/**
 * All requests made to the server should be processed through this service. There should be no raw http requests.
 * This service acts as client side middleware that checks the error state of the response to see if it can remedy the error
 * (like in cases where a login is required) and resend the request.
 */
var RequestService = (function () {
    function RequestService(http, dialogService, sessionDataService) {
        this.http = http;
        this.dialogService = dialogService;
        this.sessionDataService = sessionDataService;
    }
    /**
     * Performs an HTTP POST Request. The result will be examined to determine if the user needs to re-login.
     * If so, then it will automatically trigger the Login Component (popup) to display. If the login is successful,
     * then it will resend the request. If not, then it will fail with appropriate error flag and message.
     * @param url The destination URL for the request. Can be a relative URL.
     * @param body The body or payload of the request. This will be sent in JSON format.
     */
    RequestService.prototype.post = function (url, body) {
        /* Wrap the request in a function so that it can recursively be called by response handler if necessary.
           Such cases would include when the user must login and they successfully login (repeat request). */
        var sendRequest = function () {
            var _this = this;
            var options = {
                headers: new __WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Headers */]({
                    'Content-Type': 'application/json'
                })
            };
            return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].create(function (observer) {
                _this.http.post(url, body, options).subscribe(function (response) {
                    // Make the response handler its own Observable because it can evaluate to a recursive call to sendRequest()!
                    _this.handleResponse(sendRequest, response).subscribe(function (response) {
                        observer.next(response);
                        observer.complete();
                    });
                });
            });
        }
            .bind(this);
        return sendRequest();
    };
    /**
     * Performs an HTTP GET Request. The result will be examined to determine if the user needs to re-login.
     * If so, then it will automatically trigger the Login Component (popup) to display. If the login is successful,
     * then it will resend the request. If not, then it will fail with appropriate error flag and message.
     * @param url The destination URL for the request. Can be a relative URL.
     */
    RequestService.prototype.get = function (url) {
        /* Wrap the request in a function so that it can recursively be called by response handler if necessary.
           Such cases would include when the user must login and they successfully login (repeat request). */
        var sendRequest = function () {
            var _this = this;
            return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].create(function (observer) {
                _this.http.get(url).subscribe(function (response) {
                    // Make the response handler its own Observable because it can evaluate to a recursive call to sendRequest()!
                    _this.handleResponse(sendRequest, response).subscribe(function (response) {
                        observer.next(response);
                        observer.complete();
                    });
                });
            });
        }
            .bind(this);
        return sendRequest();
    };
    /**
     * Handles the response of either an HTTP POST or GET request. Determines if re-login is required and acts accordingly.
     * @param retrySendRequestCallback A callback function that may be called to recursively retry the request.
     * @param response The response of either an HTTP POST or GET request.
     */
    RequestService.prototype.handleResponse = function (retrySendRequestCallback, response) {
        var _this = this;
        var foodWebResponse = response.json();
        // Check if the user must confirm their signup in order to successfully perform the related request/action.
        if (foodWebResponse.signupConfirmRequired) {
            alert('Sorry, you must confirm your registration by following the email confirmation link sent to your email account before performing this action.');
        }
        else if (foodWebResponse.loginRequired) {
            // Mark the session ended (or not logged in) in this client.
            this.sessionDataService.clearSessionData();
            // Wrap login result in a newly created Observable.
            return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].create(function (observer) {
                // Attempt login.
                __WEBPACK_IMPORTED_MODULE_5__authentication_login_login_component__["a" /* LoginComponent */].display(_this.dialogService).subscribe(function () {
                    // If login successful, then re-send original request and go through this process recursively.
                    if (_this.sessionDataService.sessionDataAvailable()) {
                        retrySendRequestCallback().subscribe(function (response) {
                            observer.next(response);
                            observer.complete();
                        });
                    }
                    else {
                        observer.next(response);
                        observer.complete();
                    }
                });
            });
        }
        // No problems with signup confirmation or login detected!
        return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].of(response);
    };
    RequestService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3_ng2_bootstrap_modal__["DialogService"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3_ng2_bootstrap_modal__["DialogService"]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_4__common_util_session_data_service__["a" /* SessionDataService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__common_util_session_data_service__["a" /* SessionDataService */]) === "function" && _c || Object])
    ], RequestService);
    return RequestService;
    var _a, _b, _c;
}());

//# sourceMappingURL=request.service.js.map

/***/ }),

/***/ "../../../../../client/src/app/common-util/route-preprocess.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RoutePreprocessService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ng2_bootstrap_modal__ = __webpack_require__("../../../../ng2-bootstrap-modal/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ng2_bootstrap_modal___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_ng2_bootstrap_modal__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__request_service__ = __webpack_require__("../../../../../client/src/app/common-util/request.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__session_data_service__ = __webpack_require__("../../../../../client/src/app/common-util/session-data.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__authentication_login_login_component__ = __webpack_require__("../../../../../client/src/app/authentication/login/login.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






/**
 * Contains route preprocessing logic. Re-authenticates the user whenever there is a route change.
 * Also, makes a user login if they visit restricted routes which require login.
 */
var RoutePreprocessService = (function () {
    function RoutePreprocessService(requestService, router, dialogService, authSessionService) {
        this.requestService = requestService;
        this.router = router;
        this.dialogService = dialogService;
        this.authSessionService = authSessionService;
    }
    RoutePreprocessService_1 = RoutePreprocessService;
    /**
     * Determines if a given target route can be activated (or followed). Will check credentials on server regardless of whether or not
     * the given route is in the LOGIN_RESTRICTED_ROUTES list.
     * @param route The route that is being activated.
     * @param state The state of the router.
     * @return An observable that will resolve to true if the route can be activated, and false if it cannot.
     */
    RoutePreprocessService.prototype.canActivate = function (route, state) {
        var _this = this;
        // Check with server to check if we are logged in!
        var observer = this.requestService.get('/authentication/reAuthenticate');
        // Finally, check the response from the server and react appropriately.
        return observer.map(function (response) {
            var reAuthenticateResponse = response.json();
            console.log(reAuthenticateResponse.message);
            // Make sure we update the session info we are holding.
            _this.authSessionService.updateAppUserSessionData(reAuthenticateResponse.appUserInfo);
            // If not authenticated, and we are visiting a route that requires us to be logged in, then redirect to login.
            if (!reAuthenticateResponse.success && RoutePreprocessService_1.LOGIN_RESTRICTED_ROUTES.indexOf(state.url) >= 0) {
                _this.attemptLoginAndRedirect(state.url);
                return false;
            }
            return true;
        });
    };
    /**
     * Generates a login dialog that the user can login with. If login is successful, then the user is redirected to their original target route.
     * @param toUrl THe url that the user was trying to access before reAuthentication.
     */
    RoutePreprocessService.prototype.attemptLoginAndRedirect = function (toUrl) {
        var _this = this;
        // Generate the login dialog.
        var dialogObserver = __WEBPACK_IMPORTED_MODULE_5__authentication_login_login_component__["a" /* LoginComponent */].display(this.dialogService);
        // Observe what the dialog result is.
        dialogObserver.subscribe(function () {
            // After done with login dialog, if we are logged in, then we can redirect to original intended link!
            if (_this.authSessionService.sessionDataAvailable()) {
                _this.router.navigate([toUrl]);
            }
        });
    };
    /**
     * List of login restricted routes. User must be logged in to visit these pages!
     */
    RoutePreprocessService.LOGIN_RESTRICTED_ROUTES = ['/donate', '/appUserInfo', '/cart'];
    RoutePreprocessService = RoutePreprocessService_1 = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_3__request_service__["a" /* RequestService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__request_service__["a" /* RequestService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2_ng2_bootstrap_modal__["DialogService"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2_ng2_bootstrap_modal__["DialogService"]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__session_data_service__["a" /* SessionDataService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__session_data_service__["a" /* SessionDataService */]) === "function" && _d || Object])
    ], RoutePreprocessService);
    return RoutePreprocessService;
    var RoutePreprocessService_1, _a, _b, _c, _d;
}());

//# sourceMappingURL=route-preprocess.service.js.map

/***/ }),

/***/ "../../../../../client/src/app/common-util/session-data.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SessionDataService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var SessionDataService = (function () {
    function SessionDataService() {
    }
    SessionDataService_1 = SessionDataService;
    /**
     * Updates the client's session data based off of given App User info.
     * @param appUserInfo The App User info to update the client session data with.
     */
    SessionDataService.prototype.updateAppUserSessionData = function (appUserInfo) {
        SessionDataService_1.appUserInfo = appUserInfo;
    };
    /**
     * Fills and returns an AppUserInfo container with available client session data.
     * @return The filled AppUserInfo container.
     */
    SessionDataService.prototype.getAppUserSessionData = function () {
        return SessionDataService_1.appUserInfo;
    };
    /**
     * convenience method for retrieving the full name of a logged in organization or individual user.
     */
    SessionDataService.prototype.getFullName = function () {
        if (SessionDataService_1.appUserInfo != null) {
            if (SessionDataService_1.appUserInfo.organizationName != null) {
                return SessionDataService_1.appUserInfo.organizationName;
            }
            return (SessionDataService_1.appUserInfo.firstName + ' ' + SessionDataService_1.appUserInfo.lastName);
        }
        return null;
    };
    /**
     * Clears the current session data.
     */
    SessionDataService.prototype.clearSessionData = function () {
        SessionDataService_1.appUserInfo = null;
    };
    /**
     * Determines if any session data is currently available or being held.
     * @return true if session data is available, false if not (it is clear).
     */
    SessionDataService.prototype.sessionDataAvailable = function () {
        return (SessionDataService_1.appUserInfo != null);
    };
    /**
     * Raw client session data. The App User Info belonging to the current signed in user.
     */
    SessionDataService.appUserInfo = null;
    SessionDataService = SessionDataService_1 = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [])
    ], SessionDataService);
    return SessionDataService;
    var SessionDataService_1;
}());

//# sourceMappingURL=session-data.service.js.map

/***/ }),

/***/ "../../../../../client/src/app/donate/donate.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "label:not(.perishable-label) {\r\n    font-weight: bold;\r\n    font-size: 25px;\r\n}\r\n\r\ninput[type=checkbox]\r\n{\r\n  /* Double-sized Checkboxes */\r\n  transform: scale(2);\r\n  -ms-transform: scale(2); /* IE */\r\n  -moz-transform: scale(2); /* FF */\r\n  -webkit-transform: scale(2); /* Safari and Chrome */\r\n  -o-transform: scale(2); /* Opera */\r\n  padding: 10px;\r\n  margin-left: 10px;\r\n}\r\n\r\n#perishable-yes {\r\n    margin-right: 20px;\r\n}\r\n\r\nmd-form-field, md-input-container {\r\n    width: 100%;\r\n}\r\n\r\n.inline-error, md-form-field, md-input-container {\r\n    font-size: 20px;\r\n}\r\n\r\n:host ::ng-deep .mat-form-field-infix {\r\n    border: none;\r\n}\r\n\r\n.inline-error {\r\n    line-height: 20px;\r\n    vertical-align: top;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../client/src/app/donate/donate.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"container\">\n    <h1 class=\"primary-background\">Donor Form</h1>\n    <hr>\n\n    <div [hidden]=\"submitted\" class=\"row\">\n        <div class=\"col-md-5\">\n            <label>Upload Image</label>\n            <img-cropper [image]=\"this\" [settings]=\"cropperSettings\"></img-cropper>\n        </div>\n\n        <div class=\"col-md-7\">\n            <form [formGroup]=\"foodForm\" (ngSubmit)=\"onSubmit(foodForm, $event)\">\n\n                <div class=\"form-group\">\n                    <label>Food Types</label>\n                    <app-food-types [initiallyChecked]=\"false\" [numColumns]=\"2\" [required]=\"true\" [extraValidation]=\"forceValidation\" #FoodTypesComponent></app-food-types>\n                    <!--<div class=\"alert alert-danger\" [hidden]=\"!shouldFireRequireValidation(foodForm.controls.foodType)\">At least one Food Type is required</div>-->\n                </div>\n\n                <div class=\"form-group\">\n                    <label>Perishable</label><br>\n                    <md-radio-group [ngClass]=\"{'warn-foreground': isInvalid(perishable)}\" formControlName=\"perishable\" required>\n                        <label for=\"perishable-yes-check\" id=\"perishable-yes\" class=\"perishable-label no-select\">\n                            <md-radio-button name=\"perishable\" id=\"perishable-yes-check\" [value]=\"true\">Yes</md-radio-button>\n                        </label>\n                        <label for=\"perishable-no-check\" class=\"perishable-label no-select\">\n                            <md-radio-button name=\"perishable\" id=\"perishable-no-check\" [value]=\"false\">No</md-radio-button>\n                        </label>\n                        <!--<div class=\"warn-foreground inline-error\" [hidden]=\"!isInvalid(perishable)\">*</div>-->\n                    </md-radio-group>\n                </div>\n\n                <div class=\"form-group\">\n                    <label for=\"foodDescription\">Description</label>\n                    <md-input-container class=\"input-group\" floatPlaceholder=\"never\">\n                        <textarea mdInput mdTextareaAutosize id=\"foodDescription\" placeholder=\"Describe donation here\"\n                            formControlName=\"foodDescription\" [errorStateMatcher]=\"isInvalid.bind(this)\" required></textarea>\n                    </md-input-container>\n                </div>\n\n                <div class=\"form-group\">\n                    <label for=\"expirationDate\">Expiration Date</label>\n                    <md-input-container class=\"input-group\" floatPlaceholder=\"never\">\n                        <input mdInput id=\"expirationDate\" [mdDatepicker]=\"picker\" placeholder=\"mm/dd/yyyy\"\n                            formControlName=\"expirationDate\" [errorStateMatcher]=\"isInvalid.bind(this)\" required>\n                        <md-datepicker-toggle mdSuffix [for]=\"picker\"></md-datepicker-toggle>\n                        <md-datepicker touchUi=\"true\" #picker opened=\"true\"></md-datepicker>\n                    </md-input-container>\n                </div>\n\n                <button md-raised-button color=\"primary\" class=\"button-md\">Submit</button>\n\n            </form>\n        </div>\n    </div>\n\n\n    <div *ngIf=\"submitted\">\n        <h2>Thank-you for submitting the following:</h2>\n\n        <div class=\"row\">\n            <div class=\"col-md-2\">Food Type</div>\n            <div class=\"col-md-10 pull-left\">{{ foodTypesComponent.getSelectedFoodTypes() }}</div>\n        </div>\n\n        <div class=\"row\">\n            <div class=\"col-md-2\">Description</div>\n            <div class=\"col-md-10 pull-left\">{{ foodForm.controls.foodDescription.value }}</div>\n        </div>\n\n        <div class=\"row\">\n            <div class=\"col-md-2\">Perishabe</div>\n            <div class=\"col-md-10 pull-left\">{{ (foodForm.controls.perishable.value === true) ? 'true' : 'false' }}</div>\n        </div>\n\n        <div class=\"row\">\n            <div class=\"col-md-2\">Expiration Date</div>\n            <div class=\"col-md-10 pull-left\">{{ foodForm.controls.expirationDate.value | dateFormatter }}</div>\n        </div>\n        <br>\n\n        <button md-raised-button color=\"primary\" class=\"button-md\" (click)=\"donateAgain()\">Donate Again</button>\n        <button md-raised-button color=\"primary\" class=\"button-md\" >Edit Donation</button>\n    </div>\n</div>"

/***/ }),

/***/ "../../../../../client/src/app/donate/donate.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DonateComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__("../../../forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ng2_img_cropper__ = __webpack_require__("../../../../ng2-img-cropper/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__food_listings_add_remove_food_listing_service__ = __webpack_require__("../../../../../client/src/app/food-listings/add-remove-food-listing.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__common_util_date_formatter_pipe__ = __webpack_require__("../../../../../client/src/app/common-util/date-formatter.pipe.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__food_listings_food_types_food_types_component__ = __webpack_require__("../../../../../client/src/app/food-listings/food-types/food-types.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var DonateComponent = (function () {
    function DonateComponent(formBuilder, addRemoveFoodListingService, dateFormatter) {
        this.formBuilder = formBuilder;
        this.addRemoveFoodListingService = addRemoveFoodListingService;
        this.dateFormatter = dateFormatter;
        // Want to force validators to process on submit. Non-text fields will only validate on submit too!
        this.forceValidation = false;
        this.submitted = false;
        this.cropperSettings = new __WEBPACK_IMPORTED_MODULE_2_ng2_img_cropper__["a" /* CropperSettings */]();
        this.cropperSettings.width = 100;
        this.cropperSettings.height = 100;
        this.cropperSettings.croppedWidth = 100;
        this.cropperSettings.croppedHeight = 100;
        this.cropperSettings.canvasWidth = 400;
        this.cropperSettings.canvasHeight = 300;
    }
    DonateComponent.prototype.ngOnInit = function () {
        this.foodForm = this.formBuilder.group({
            perishable: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["l" /* Validators */].required],
            foodDescription: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["l" /* Validators */].required],
            expirationDate: [null, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["l" /* Validators */].required]
        });
    };
    DonateComponent.prototype.isInvalid = function (validField) {
        return validField.errors != null && (validField.touched || this.forceValidation);
    };
    DonateComponent.prototype.onSubmit = function (_a, event) {
        var _this = this;
        var value = _a.value, valid = _a.valid;
        event.preventDefault();
        this.forceValidation = true;
        // Make sure we get all the selected Food Types.
        value.foodTypes = this.foodTypesComponent.getSelectedFoodTypes();
        valid = (valid && value.foodTypes.length !== 0);
        if (valid) {
            var observer = this.addRemoveFoodListingService.addFoodListing(value, this.image);
            observer.subscribe(function (valueKey) {
                // TODO: Add functionality for edit of added food listing using the returned key!
                _this.submitted = true;
            }, function (err) {
                alert('An error has occured which caused your donation to fail.\nPlease contact Food Web for assistnace.\n\nThank-you.');
                console.log(err);
            });
        }
    };
    DonateComponent.prototype.donateAgain = function () {
        this.foodForm.reset();
        this.foodForm.markAsPristine();
        this.foodForm.markAsUntouched();
        this.foodTypesComponent.reset();
        this.forceValidation = false;
        this.submitted = false;
    };
    Object.defineProperty(DonateComponent.prototype, "perishable", {
        get: function () {
            return this.foodForm.controls.perishable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DonateComponent.prototype, "foodDescription", {
        get: function () {
            return this.foodForm.controls.foodDescription;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DonateComponent.prototype, "expirationDate", {
        get: function () {
            return this.foodForm.controls.expirationDate;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('FoodTypesComponent'),
        __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_5__food_listings_food_types_food_types_component__["a" /* FoodTypesComponent */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__food_listings_food_types_food_types_component__["a" /* FoodTypesComponent */]) === "function" && _a || Object)
    ], DonateComponent.prototype, "foodTypesComponent", void 0);
    DonateComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-donate',
            template: __webpack_require__("../../../../../client/src/app/donate/donate.component.html"),
            providers: [__WEBPACK_IMPORTED_MODULE_3__food_listings_add_remove_food_listing_service__["a" /* AddRemoveFoodListingService */]],
            styles: [__webpack_require__("../../../../../client/src/app/donate/donate.component.css")]
        }),
        __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_forms__["b" /* FormBuilder */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_forms__["b" /* FormBuilder */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__food_listings_add_remove_food_listing_service__["a" /* AddRemoveFoodListingService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__food_listings_add_remove_food_listing_service__["a" /* AddRemoveFoodListingService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__common_util_date_formatter_pipe__["a" /* DateFormatterPipe */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__common_util_date_formatter_pipe__["a" /* DateFormatterPipe */]) === "function" && _d || Object])
    ], DonateComponent);
    return DonateComponent;
    var _a, _b, _c, _d;
}());

//# sourceMappingURL=donate.component.js.map

/***/ }),

/***/ "../../../../../client/src/app/food-listings/add-remove-food-listing.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AddRemoveFoodListingService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_util_request_service__ = __webpack_require__("../../../../../client/src/app/common-util/request.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shared_food_listings_add_food_listing_message__ = __webpack_require__("../../../../../shared/food-listings/add-food-listing-message.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shared_food_listings_claim_food_listing_message__ = __webpack_require__("../../../../../shared/food-listings/claim-food-listing-message.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AddRemoveFoodListingService = (function () {
    function AddRemoveFoodListingService(requestService) {
        this.requestService = requestService;
    }
    /**
     * Adds a food listing on the server.
     * @param foodListing The food listing to be added.
     * @param imageUpload The image component of the food listing that is to be added.
     * @return An observable that on success will provide the added food listings key (unique ID).
     */
    AddRemoveFoodListingService.prototype.addFoodListing = function (foodListingUpload, imageUpload) {
        foodListingUpload.imageUpload = imageUpload;
        var body = new __WEBPACK_IMPORTED_MODULE_2__shared_food_listings_add_food_listing_message__["a" /* AddFoodListingRequest */](foodListingUpload);
        var observer = this.requestService.post('/foodListings/addFoodListing', body);
        return observer.map(function (response) {
            var addFoodListingResponse = response.json();
            console.log(addFoodListingResponse.message);
            if (addFoodListingResponse.success) {
                return addFoodListingResponse.foodListingKey;
            }
            throw new Error(addFoodListingResponse.message);
        });
    };
    /**
     * Permanently removes a food listing from the server. Also triggers the removal of all claims on the food listing as well.
     * @param foodListingKey The key identifier of the food listing that is to be removed.
     */
    AddRemoveFoodListingService.prototype.removeFoodListing = function (foodListingKey) {
        var body = new __WEBPACK_IMPORTED_MODULE_3__shared_food_listings_claim_food_listing_message__["a" /* ClaimFoodListingRequest */](foodListingKey);
        var observer = this.requestService.post('/foodListings/removeFoodListing', body);
        return observer.map(function (response) {
            var removeFoodListingResponse = response.json();
            console.log(removeFoodListingResponse.message);
            if (!removeFoodListingResponse.success) {
                throw new Error(removeFoodListingResponse.message);
            }
        });
    };
    AddRemoveFoodListingService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__common_util_request_service__["a" /* RequestService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__common_util_request_service__["a" /* RequestService */]) === "function" && _a || Object])
    ], AddRemoveFoodListingService);
    return AddRemoveFoodListingService;
    var _a;
}());

//# sourceMappingURL=add-remove-food-listing.service.js.map

/***/ }),

/***/ "../../../../../client/src/app/food-listings/claim-unclaim-food-listing.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClaimFoodListingService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_util_request_service__ = __webpack_require__("../../../../../client/src/app/common-util/request.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shared_food_listings_claim_food_listing_message__ = __webpack_require__("../../../../../shared/food-listings/claim-food-listing-message.ts");

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ClaimFoodListingService = (function () {
    function ClaimFoodListingService(requestService) {
        this.requestService = requestService;
    }
    /**
     * Claims a given Food Listing.
     * @param foodListingKey The key (identifier) for the Food Listing that is to be claimed.
     * @return An observable that has no payload (simply resolves on success).
     */
    ClaimFoodListingService.prototype.claimFoodListing = function (foodListingKey) {
        return this.claimOrUnclaimFoodListing(foodListingKey, true);
    };
    /**
     * Unclaims a given Food Listing.
     * @param foodListingKey The key (identifier) for the Food Listing that is to be unclaimed.
     * @return An observable that has no payload (simply resolves on success).
     */
    ClaimFoodListingService.prototype.unclaimFoodListing = function (foodListingKey) {
        return this.claimOrUnclaimFoodListing(foodListingKey, false);
    };
    /**
     * Uniform function for sending both claim and unclaim food listing messages to server.
     * @param foodListingKey The key identifier of the food listing that is to be claimed or unclaimed.
     * @param isClaim Set to true if this is a claim, set to false if it is an unclaim.
     * @return An observable that has no payload (simply resolves on success).
     */
    ClaimFoodListingService.prototype.claimOrUnclaimFoodListing = function (foodListingKey, isClaim) {
        var body = new __WEBPACK_IMPORTED_MODULE_2__shared_food_listings_claim_food_listing_message__["a" /* ClaimFoodListingRequest */](foodListingKey);
        var observer = this.requestService.post('/foodListings/' + (isClaim ? '' : 'un') + 'claimFoodListing', body);
        // Listen for a response now.
        return observer.map(function (response) {
            var claimFoodListingResponse = response.json();
            // On failure.
            if (!claimFoodListingResponse.success) {
                console.log(claimFoodListingResponse.message);
                throw new Error(claimFoodListingResponse.message);
            }
        });
    };
    ClaimFoodListingService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__common_util_request_service__["a" /* RequestService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__common_util_request_service__["a" /* RequestService */]) === "function" && _a || Object])
    ], ClaimFoodListingService);
    return ClaimFoodListingService;
    var _a;
}());

//# sourceMappingURL=claim-unclaim-food-listing.service.js.map

/***/ }),

/***/ "../../../../../client/src/app/food-listings/food-listings-filters/food-listings-filters.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "md-input-container, input {\r\n    cursor: pointer;\r\n    cursor: hand;\r\n}\r\n\r\n:host ::ng-deep .mat-form-field-infix {\r\n    border: none;\r\n}\r\n\r\nmd-input-container, input, md-datepicker-toggle {\r\n    font-size: 20px;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../client/src/app/food-listings/food-listings-filters/food-listings-filters.component.html":
/***/ (function(module, exports) {

module.exports = "<app-slick-left-panel [buttonTitle]=\"header\">\n    \n    <h2>{{header}}</h2>\n    <hr>\n    <div [formGroup]=\"filtersForm\">\n\n        <!-- Any additional filters will be transclused here -->\n        <ng-content select=\"[top]\"></ng-content>\n\n        <h4>Food Types:</h4>\n        <app-food-types #FoodTypesComponent></app-food-types>\n        <br>\n\n        <h4>Expiration Date:</h4>\n        <md-input-container floatPlaceholder=\"never\" (click)=\"picker.open()\">\n            <input mdInput [mdDatepicker]=\"picker\" placeholder=\"mm/dd/yyyy\" formControlName=\"earliestExpireDate\" readonly=\"true\">\n            <md-datepicker-toggle mdSuffix [for]=\"picker\"></md-datepicker-toggle>\n            <md-datepicker touchUi=\"true\" #picker></md-datepicker>\n        </md-input-container>\n        <br>\n\n        <h4>Perishability:</h4>\n        <div>\n            <label class=\"checkbox-compress\">\n                <md-checkbox formControlName=\"perishable\">Perishable</md-checkbox>\n            </label>\n            <br>\n            <label class=\"checkbox-compress\">\n                <md-checkbox formControlName=\"notPerishable\">Not Perishable</md-checkbox>\n            </label>\n        </div>\n\n        <!-- Any additional filters will be transclused here -->\n        <ng-content select=\"[botton]\"></ng-content>\n\n    </div>\n    <hr>\n\n</app-slick-left-panel>\n"

/***/ }),

/***/ "../../../../../client/src/app/food-listings/food-listings-filters/food-listings-filters.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FoodListingsFiltersComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__("../../../forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__food_types_food_types_component__ = __webpack_require__("../../../../../client/src/app/food-listings/food-types/food-types.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var FoodListingsFiltersComponent = (function () {
    function FoodListingsFiltersComponent(formBuilder) {
        this.formBuilder = formBuilder;
        this.header = 'Filters';
        this.defaultLatestExpireNow = true;
        // Must default initialize form so when referenced in parent, it is not null!
        this.filtersForm = new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["d" /* FormGroup */]({});
    }
    FoodListingsFiltersComponent.prototype.ngOnInit = function () {
        // Actual form group initialization requires Input to be evaluated, so must be in init!
        this.addControl('earliestExpireDate', new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* FormControl */](this.defaultLatestExpireNow ? new Date() : null));
        this.addControl('perishable', new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* FormControl */](true));
        this.addControl('notPerishable', new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* FormControl */](true));
        this.quantityVals = ["Car", "Van", "Truck"];
        this.tFrameVals = ["0-6 Days", "6-12 Days", "12+ Days"];
        this.distVals = ["0-6 Miles", "6-12 Miles", "12+ Miles"];
    };
    /**
     * Adds a form control to the underlying filters form model.
     * @param name The name of the form control.
     * @param control The logical representation of the form control.
     */
    FoodListingsFiltersComponent.prototype.addControl = function (name, control) {
        this.filtersForm.addControl(name, control);
    };
    /**
     * Called whenever there is an update to the filters. Will provide the caller with updated filter values via a callback function.
     * @param callback The callback function that will be given the updated filter values.
     * @param excludeDisabled Optionally set to true if caller does not want to get filter values pertaining to filters that
     *                        are not enabled or visible (due to a false *ngIf condition). Default is false (which means get these values).
     */
    FoodListingsFiltersComponent.prototype.onFiltersUpdate = function (callback, excludeDisabled) {
        var _this = this;
        if (excludeDisabled === void 0) { excludeDisabled = false; }
        // Liisten for changes in all values excluding Food Types.
        this.filtersForm.valueChanges.subscribe(function (data) {
            callback(_this.genFilterValues(excludeDisabled));
        });
        // Listen for changes in child Food Types component.
        this.foodTypesComponent.onFoodTypesUpdate(function (foodTypes) {
            callback(_this.genFilterValues(excludeDisabled, foodTypes));
        });
    };
    /**
     * Gets the current values of all filters.
     * @param excludeDisabled Optionally set to true if caller does not want to get filter values pertaining to filters that
     *                        are not enabled or visible (due to a false *ngIf condition). Default is false (which means get these values).
     * @return The retrieved filter values.
     */
    FoodListingsFiltersComponent.prototype.getFilterValues = function (excludeDisabled) {
        if (excludeDisabled === void 0) { excludeDisabled = false; }
        return this.genFilterValues(excludeDisabled);
    };
    /**
     * Gets the filter values according to the current state of the form and its associated form group (view model).
     * @param excludeDisabled Optionally set to true if caller does not want to get filter values pertaining to filters that
     *                        are not enabled or visible (due to a false *ngIf condition). Default is false (which means get these values).
     * @param foodTypes Optionally provide food types value that has already been obtained in the caller. Obtaining the food types value
     *                  is a bit more expensive than normally obaining form values since a transformation happens with the contained form
     *                  values. So, provide this value whenever possible.
     * @return The Food Listings filter values.
     */
    FoodListingsFiltersComponent.prototype.genFilterValues = function (excludeDisabled, foodTypes) {
        if (excludeDisabled === void 0) { excludeDisabled = false; }
        var foodListingsFilters = (excludeDisabled ? this.filtersForm.value : this.filtersForm.getRawValue());
        // See if we have been passed foodTypes or if we need to retrieve them from the Food Types component.
        foodListingsFilters.foodTypes = (foodTypes == null) ? this.foodTypesComponent.getSelectedFoodTypes()
            : foodListingsFilters.foodTypes = foodTypes;
        return foodListingsFilters;
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], FoodListingsFiltersComponent.prototype, "header", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], FoodListingsFiltersComponent.prototype, "defaultLatestExpireNow", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('FoodTypesComponent'),
        __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__food_types_food_types_component__["a" /* FoodTypesComponent */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__food_types_food_types_component__["a" /* FoodTypesComponent */]) === "function" && _a || Object)
    ], FoodListingsFiltersComponent.prototype, "foodTypesComponent", void 0);
    FoodListingsFiltersComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-food-listings-filters',
            template: __webpack_require__("../../../../../client/src/app/food-listings/food-listings-filters/food-listings-filters.component.html"),
            styles: [__webpack_require__("../../../../../client/src/app/food-listings/food-listings-filters/food-listings-filters.component.css")]
        }),
        __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_forms__["b" /* FormBuilder */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_forms__["b" /* FormBuilder */]) === "function" && _b || Object])
    ], FoodListingsFiltersComponent);
    return FoodListingsFiltersComponent;
    var _a, _b;
}());

//# sourceMappingURL=food-listings-filters.component.js.map

/***/ }),

/***/ "../../../../../client/src/app/food-listings/food-listings.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".food-listing-img {\r\n    display: inline-block;\r\n    vertical-align: top;\r\n}\r\n\r\n.food-listing-contents, .food-listing-img {\r\n    display: inline-block;\r\n    margin-left: 1vw;\r\n}\r\n\r\n.link-content {\r\n    color: green;\r\n}\r\n\r\n.link-content:hover {\r\n    color: goldenrod;\r\n}\r\n\r\n.modal-img {\r\n    margin-right: 10px;\r\n    margin-bottom: 10px;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../client/src/app/food-listings/food-listings.component.html":
/***/ (function(module, exports) {

module.exports = "<h2>{{header}}</h2>\n<hr>\n\n<ng-container *ngFor=\"let foodListing of foodListings; let i = index\">\n    <img *ngIf=\"foodListing.imgUrl != null\" [src]=\"foodListing.imgUrl\" class=\"food-listing-img\">\n\n    <div class=\"food-listing-contents\" style=\"text-align:left;\">\n        <h5 class=\"link-content\">\n            <a (click)=\"showDetails(detailsHTML, i)\" title=\"Click for Details\">{{foodListing.foodDescription}}</a>\n        </h5>\n\n        <p>\n            Donated By:\n            <ng-container *ngIf=\"foodListing.donorOrganizationName != null\">\n                    <b>{{foodListing.donorOrganizationName}}</b>\n            </ng-container>\n            <ng-container *ngIf=\"foodListing.donorOrganizationName == null\">\n                    <b>{{foodListing.donorFirstName}} {{foodListing.donorLastName}}</b>\n            </ng-container>\n            <br>\n            Present food types:\n            <ng-container *ngFor=\"let foodType of foodListing.foodTypes; let i = index;\">\n                <b>\n                    {{foodType}}<ng-container *ngIf=\"i !== (foodListing.foodTypes.length - 1)\">,</ng-container>\n                </b>\n            </ng-container>\n            <br>\n            Expires: <b>{{foodListing.expirationDate}}</b> <!--Requires a {{foodListing.quantityClass}}-->\n\n            <ng-content select=\"[food-listing-info]\"></ng-content>\n        </p>\n    </div>\n    <hr>\n</ng-container>\n\n\n<ng-template #detailsHTML let-c=\"close\" let-d=\"dismss\">\n    <div class=\"modal-header\">\n        <h4 class=\"modal-title\">Donation-{{foodListings[selectedFoodListingIndex].foodListingKey}}</h4>\n        <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"c('Cross click')\">\n            <span aria-hidden=\"true\">&times;</span>\n        </button>\n    </div>\n\n    <div class=\"modal-body\">\n        <img *ngIf=\"foodListings[selectedFoodListingIndex].imgUrl != null\" [src]=\"foodListings[selectedFoodListingIndex].imgUrl\"\n         id=\"details-img\" align=\"left\" class=\"img-thumbnail modal-img\">\n        <p>{{foodListings[selectedFoodListingIndex].foodDescription}}</p>\n        <ng-content select=\"[details-modal-body]\"></ng-content>\n    </div>\n    \n    <div class=\"modal-footer\">\n        <ng-content select=\"[details-modal-footer]\"></ng-content>\n        <button md-raised-button color=\"primary\" class=\"button-md\" (click)=\"c('Close')\">Close</button>\n    </div>\n</ng-template>\n"

/***/ }),

/***/ "../../../../../client/src/app/food-listings/food-listings.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FoodListingsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__ = __webpack_require__("../../../../@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__get_food_listings_service__ = __webpack_require__("../../../../../client/src/app/food-listings/get-food-listings.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var FoodListingsComponent = (function () {
    function FoodListingsComponent(modalService, getFoodListingsService) {
        this.modalService = modalService;
        this.getFoodListingsService = getFoodListingsService;
        this.header = 'Food Listings';
        this.foodListings = new Array();
        this.selectedFoodListingIndex = null;
        this.modalFoodListingDetails = null;
    }
    /**
     * Refreshes the food listings using the new set of filters criteria. The offset used to retreive a certain range of food listings will be
     * reset to 0.
     * @param filters The filter criteria.
     */
    FoodListingsComponent.prototype.refreshFoodListings = function (filters) {
        var _this = this;
        var observer = this.getFoodListingsService.getFoodListings(filters);
        observer.subscribe(function (foodListings) {
            _this.foodListings = foodListings;
        });
    };
    /**
     * Displays a Food Listing details modal popup.
     * @param detailsHTML The Food Listing detals modal HTML Element.
     * @param selectedFoodListing The selected Food Listing.
     */
    FoodListingsComponent.prototype.showDetails = function (detailsHTML, selectedFoodListingIndex) {
        this.selectedFoodListingIndex = selectedFoodListingIndex;
        this.modalFoodListingDetails = this.modalService.open(detailsHTML);
        this.modalFoodListingDetails.result.then(function (result) {
            // Don't really need to listen for any signals from details modal popup since parent will be handling any non-close button presses!
        });
    };
    /**
     * Gets the selected Food Listing.
     * @return The selected Food Listing.
     */
    FoodListingsComponent.prototype.getSelectedFoodListing = function () {
        if (this.selectedFoodListingIndex != null) {
            return this.foodListings[this.selectedFoodListingIndex];
        }
        return null;
    };
    /**
     * Removes the selected Food Listing.
     */
    FoodListingsComponent.prototype.removeSelectedFoodListing = function () {
        // Close any modal details popup related to the Food Listing we are deleting.
        if (this.modalFoodListingDetails != null) {
            this.modalFoodListingDetails.close();
            this.modalFoodListingDetails = null;
        }
        // Remove the Food Listing from the contained array model.
        this.foodListings.splice(this.selectedFoodListingIndex, 1);
        this.selectedFoodListingIndex = null;
    };
    // Gets the entire array of current Food Listings
    FoodListingsComponent.prototype.getDisplayedListings = function () {
        return this.foodListings;
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], FoodListingsComponent.prototype, "header", void 0);
    FoodListingsComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-food-listings',
            template: __webpack_require__("../../../../../client/src/app/food-listings/food-listings.component.html"),
            styles: [__webpack_require__("../../../../../client/src/app/food-listings/food-listings.component.css")],
            providers: [__WEBPACK_IMPORTED_MODULE_2__get_food_listings_service__["a" /* GetFoodListingsService */]]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["a" /* NgbModal */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["a" /* NgbModal */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__get_food_listings_service__["a" /* GetFoodListingsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__get_food_listings_service__["a" /* GetFoodListingsService */]) === "function" && _b || Object])
    ], FoodListingsComponent);
    return FoodListingsComponent;
    var _a, _b;
}());

//# sourceMappingURL=food-listings.component.js.map

/***/ }),

/***/ "../../../../../client/src/app/food-listings/food-types/food-types.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".column-6 {\r\n    display: inline-block;\r\n    min-width: 40%;\r\n    margin-right: 30px;\r\n    vertical-align: top;\r\n}\r\n\r\n.column-4 {\r\n    display: inline-block;\r\n    min-width: 30%;\r\n    margin-right: 30px;\r\n    vertical-align: top;\r\n}\r\n\r\n.column-3 {\r\n    display: inline-block;\r\n    min-width: 22%;\r\n    margin-right: 30px;\r\n    vertical-align: top;\r\n}\r\n\r\n.error-message {\r\n    font-size: 20px;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../client/src/app/food-listings/food-types/food-types.component.html":
/***/ (function(module, exports) {

module.exports = "<!-- This will be data driven by the Food Types stored on the server -->\n<div [formGroup]=\"foodTypesForm\">\n\n    <!-- Loop through split columns (if split mode, then columns will numColumns - must generate array of numbers from 0 ... numColumns) -->\n    <ng-container *ngFor=\"let column of createColumnsRange()\">\n        <div [ngClass]=\"{\n                            'column-6': (numColumns === 2),\n                            'column-4': (numColumns === 3),\n                            'column-3': (numColumns >= 4),\n                            'warn-foreground': (required && numSelections() === 0 && extraValidation)\n                        }\">\n\n            <!-- Loop through segments of Food Types based on numColumns -->\n            <ng-container *ngFor=\"let foodTypeInd of createFoodTypesRange(column)\">\n                <label class=\"checkbox-compress no-select\">\n                    <md-checkbox [formControlName]=\"foodTypes[foodTypeInd]\">{{foodTypes[foodTypeInd]}}</md-checkbox>\n                </label>\n                <br>\n            </ng-container>\n\n        </div>\n    </ng-container>\n\n    <!-- <div *ngIf=\"required && numSelections() === 0 && extraValidation\" class=\"warn-foreground error-message\">\n        * at least 1 required\n    </div> -->\n\n</div>\n"

/***/ }),

/***/ "../../../../../client/src/app/food-listings/food-types/food-types.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FoodTypesComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__("../../../forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__food_types_service__ = __webpack_require__("../../../../../client/src/app/food-listings/food-types/food-types.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


// import { ActivatedRoute } from "@angular/router";

var FoodTypesComponent = (function () {
    function FoodTypesComponent(// private routerSnapshot: ActivatedRoute,
        foodTypesService) {
        this.foodTypesService = foodTypesService;
        /**
         * Determines if the Food Type checkboxes should initially be checked. Default is true.
         */
        this.initiallyChecked = true;
        /**
         * The number of columns that the Food Types checkboxes will be displayed in. Default is 1, and make is 4.
         */
        this.numColumns = 1;
        /**
         * Determines if at least one selection is required. Default is false.
         */
        this.required = false;
        /**
         * Any extra required validation constraint. Ignored on default.
         */
        this.extraValidation = true;
        this.foodTypes = [];
        this.foodTypesForm = new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["d" /* FormGroup */]({});
        this.foodTypesLoaded = false;
    }
    FoodTypesComponent.prototype.ngOnInit = function () {
        // this.foodTypes = this.routerSnapshot.data['value']['foodTypes'];
        var _this = this;
        /* Ideally, this should resolve immediately because of a resolver used in route to parent component! The Food Types should have
           already been fetched and cached from the server before this component was initialize and rendered, but just in case we will
           call getFoodTypes instead of directly getting results form ActiveRoute. */
        this.foodTypesService.getFoodTypes().subscribe(function (foodTypes) {
            _this.foodTypes = foodTypes;
            for (var i = 0; i < _this.foodTypes.length; i++) {
                _this.foodTypesForm.addControl(_this.foodTypes[i], new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* FormControl */](_this.initiallyChecked));
            }
            _this.foodTypesLoaded = true;
            _this.foodTypesForm.updateValueAndValidity(); // When finished adding all food type controls, then trigger a value update so callback will
            // get the selected food types.
        });
    };
    /**
     * Called whenever there is an update to the Food Types form controls. Will provide the caller with a (string) list of the selected Food Types.
     * @param callback The callback function that will be given the selected Food Types.
     */
    FoodTypesComponent.prototype.onFoodTypesUpdate = function (callback) {
        var _this = this;
        this.foodTypesForm.valueChanges.subscribe(function (data) {
            /* Only signal callback that food types selection(s) have updated if they have been completely loaded. Otherwise, will fire every time
               a food type control is added in ngOnInit(). */
            if (_this.foodTypesLoaded) {
                callback(_this.getSelectedFoodTypes());
            }
        });
    };
    /**
     * Gets the currently selected Food Types.
     * @return A list of the currently selected Food Types.
     */
    FoodTypesComponent.prototype.getSelectedFoodTypes = function () {
        return this.foodTypesService.getFoodTypesAssocWithTrue(this.foodTypesForm.value);
    };
    /**
     * Resets the checkboxes to their initial checked value. Also resets any associated validation.
     */
    FoodTypesComponent.prototype.reset = function () {
        for (var i = 0; i < this.foodTypes.length; i++) {
            this.foodTypesForm.controls[this.foodTypes[i]].setValue(this.initiallyChecked);
        }
        this.foodTypesForm.markAsPristine();
        this.foodTypesForm.markAsUntouched();
    };
    /**
     * Gets the number of selected Food Types.
     * @return The number of selected Food Types.
     */
    FoodTypesComponent.prototype.numSelections = function () {
        return this.foodTypesService.getFoodTypesAssocWithTrue(this.foodTypesForm.value).length;
    };
    /**
     * Creates an array/range containing incremental integers representing each column (for *ngFor column iterations).
     * @return The array or range of column numbers.
     */
    FoodTypesComponent.prototype.createColumnsRange = function () {
        return Array.from(Array(this.numColumns).keys());
    };
    /**
     * Creates an array/range containing incremental integers representing the Food Types array indexes of all Food Types that
     * should be placed in a given column.
     * @param column The column that the numeric range shall be generated for (columns are zero based!).
     * @return The array or range of Food Type indexes that are to be rendered in the column.
     */
    FoodTypesComponent.prototype.createFoodTypesRange = function (column) {
        var range = [];
        /* Calculate the number of extra Food Types that must be added to the first column if the total number of Food TYpes is not
           evenly divisble by the number of columns! Also, all other ranges (column begins) must be offset by this amount! */
        var remainder = (this.foodTypes.length % this.numColumns);
        // Base range parameters off of number of columns specified by parent component and the number of Food Types from server.
        var rangeLength = Math.floor(this.foodTypes.length / this.numColumns);
        var rangeBegin = (column * rangeLength) + (column !== 0 ? remainder : 0);
        var rangeEnd = (rangeBegin + rangeLength) + (column === 0 ? remainder : 0);
        for (var i = rangeBegin; i < rangeEnd; i++) {
            range.push(i);
        }
        return range;
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], FoodTypesComponent.prototype, "initiallyChecked", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Number)
    ], FoodTypesComponent.prototype, "numColumns", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], FoodTypesComponent.prototype, "required", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Boolean)
    ], FoodTypesComponent.prototype, "extraValidation", void 0);
    FoodTypesComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-food-types',
            template: __webpack_require__("../../../../../client/src/app/food-listings/food-types/food-types.component.html"),
            styles: [__webpack_require__("../../../../../client/src/app/food-listings/food-types/food-types.component.css")]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__food_types_service__["a" /* FoodTypesService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__food_types_service__["a" /* FoodTypesService */]) === "function" && _a || Object])
    ], FoodTypesComponent);
    return FoodTypesComponent;
    var _a;
}());

//# sourceMappingURL=food-types.component.js.map

/***/ }),

/***/ "../../../../../client/src/app/food-listings/food-types/food-types.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FoodTypesService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__ = __webpack_require__("../../../../rxjs/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_util_request_service__ = __webpack_require__("../../../../../client/src/app/common-util/request.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



/**
 * A global service that is used to load Food Types before displaying certain components or pages.
 */
var FoodTypesService = (function () {
    function FoodTypesService(requestService) {
        this.requestService = requestService;
    }
    FoodTypesService_1 = FoodTypesService;
    /**
     * Retrieves food types from the server if they have not previously been retrieved. Otherwise, fetches them from contained cache.
     * @return An observable object that resolves to an array of food type strings.
     */
    FoodTypesService.prototype.resolve = function (route, state) {
        return this.getFoodTypes();
    };
    /**
     * Retrieves food types from the server if they have not previously been retrieved. Otherwise, fetches them from contained cache.
     * @return An observable object that resolves to an array of food type strings.
     */
    FoodTypesService.prototype.getFoodTypes = function () {
        // If we do not have cached Food Types, then we will contact the server.
        if (FoodTypesService_1.foodTypesCache === null) {
            var observer = this.requestService.get('/foodListings/getFoodTypes');
            return observer.map(function (response) {
                var getFoodTypesResponse = response.json();
                console.log(getFoodTypesResponse.message);
                if (getFoodTypesResponse.success) {
                    FoodTypesService_1.foodTypesCache = getFoodTypesResponse.foodTypes;
                    return getFoodTypesResponse.foodTypes;
                }
                // On failure, simply goto catch callback below!
                throw new Error(getFoodTypesResponse.message);
            })
                .catch(function (err, caught) {
                console.log(err);
                // Simply fill the Food Types with dummy data for now if cannot properly communicate with the server.
                FoodTypesService_1.foodTypesCache = ['Food Type 1', 'Food Type 2', 'Food Type 3'];
                return __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].of(FoodTypesService_1.foodTypesCache);
            });
        }
        else {
            return __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].of(FoodTypesService_1.foodTypesCache);
        }
    };
    /**
     * Examines an object with Food Type keys and boolean values and extracts the Food Types that are associated with true.
     * @param foodTypeBooleans An object that contains Food Type keys associated with boolean values.
     */
    FoodTypesService.prototype.getFoodTypesAssocWithTrue = function (foodTypeBooleans) {
        var foodTypesAssocWithTrue = [];
        var allFoodTypes = Object.keys(foodTypeBooleans);
        // Iterate through all the food types and add those that are associated w/ true to the return list.
        for (var i = 0; i < allFoodTypes.length; i++) {
            if (foodTypeBooleans[allFoodTypes[i]] === true) {
                foodTypesAssocWithTrue.push(allFoodTypes[i]);
            }
        }
        return foodTypesAssocWithTrue;
    };
    // We will cache any Food Types that come back from the server so we only need to contact server once!
    FoodTypesService.foodTypesCache = null;
    FoodTypesService = FoodTypesService_1 = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__common_util_request_service__["a" /* RequestService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__common_util_request_service__["a" /* RequestService */]) === "function" && _a || Object])
    ], FoodTypesService);
    return FoodTypesService;
    var FoodTypesService_1, _a;
}());

;
//# sourceMappingURL=food-types.service.js.map

/***/ }),

/***/ "../../../../../client/src/app/food-listings/get-food-listings.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GetFoodListingsService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_util_request_service__ = __webpack_require__("../../../../../client/src/app/common-util/request.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shared_food_listings_food_listings_filters__ = __webpack_require__("../../../../../shared/food-listings/food-listings-filters.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shared_food_listings_get_food_listings_message__ = __webpack_require__("../../../../../shared/food-listings/get-food-listings-message.ts");

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/*const MODELS: FoodListing[] = [
    {
        name: "Beef Stew",
        foodListingKey: 0,
        donorOrganizationName: "Stew's Stews",
        donorOrganizationAddress: "800 Beef Lane",
        donorOrganizationCity: "Williamsville",
        donorOrganizationState: "New York",
        donorOrganizationZip: 14221,
        donorLastName: "Stew",
        donorFirstName: "Steven",
        donorDistance: 6,
        foodTypeDescription: "Meat, Vegetable, Drink",
        foodDescription: "Quite the beefy stew...",
        preishable: true,
        expirationDate: "13/32/2017",
        quantityClass: "Car",
        imgUrl: "https://i5.walmartimages.com/asr/4026d667-1824-48e3-acab-c46642521070_1.a0a61552b58949ce15a4990a2e02b050.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF"
    }
]*/
var GetFoodListingsService = (function () {
    function GetFoodListingsService(requestService) {
        this.requestService = requestService;
        this.retrievalOffset = 0;
    }
    GetFoodListingsService_1 = GetFoodListingsService;
    /**
     * Retrieves food listings based off of filter criteria.
     * @param filters The selected filter criteria used to limit the food listings that are retrieved on the server.
     * @param getMoreListings Set to true if the server should get more listings to be diplayed, otherwise, it will get food listings to replace
     *                        the current ones with (will start back at 0 retrieval offset).
     * @return An observable object that resolves to an object that contains the array of FoodListing objects.
     */
    GetFoodListingsService.prototype.getFoodListings = function (filters, getMoreListings) {
        if (getMoreListings === void 0) { getMoreListings = false; }
        // If we are simply getting more food listings, then we will set the retrievalOffset to the beginning of next segment of entries.
        (getMoreListings) ? this.retrievalOffset += GetFoodListingsService_1.RETRIEVAL_AMOUNT
            : this.retrievalOffset = 0;
        // Set our retrieval range information for the server to filter by.
        filters.retrievalOffset = this.retrievalOffset;
        filters.retrievalAmount = GetFoodListingsService_1.RETRIEVAL_AMOUNT;
        // Determine the route based off of the requested Food Listings' status (Are we getting food listings for receive or cart interface).
        var route = (filters.listingsStatus == null || filters.listingsStatus === __WEBPACK_IMPORTED_MODULE_2__shared_food_listings_food_listings_filters__["a" /* LISTINGS_STATUS */].unclaimedListings)
            ? '/foodListings/getReceiverFoodListings'
            : '/foodListings/getCartFoodListings';
        var body = new __WEBPACK_IMPORTED_MODULE_3__shared_food_listings_get_food_listings_message__["a" /* GetFoodListingsRequest */](filters);
        var observer = this.requestService.post(route, body);
        // Listen for a response now.                                                 
        return observer.map(function (response) {
            var getFoodListingsResponse = response.json();
            console.log(getFoodListingsResponse.message);
            if (getFoodListingsResponse.success) {
                return getFoodListingsResponse.foodListings;
            }
            // If the response success flag is false, then we will simply send back an empty array to the calling component.
            return new Array();
        });
    };
    GetFoodListingsService.RETRIEVAL_AMOUNT = 20;
    GetFoodListingsService = GetFoodListingsService_1 = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__common_util_request_service__["a" /* RequestService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__common_util_request_service__["a" /* RequestService */]) === "function" && _a || Object])
    ], GetFoodListingsService);
    return GetFoodListingsService;
    var GetFoodListingsService_1, _a;
}());

//# sourceMappingURL=get-food-listings.service.js.map

/***/ }),

/***/ "../../../../../client/src/app/footer/footer.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "footer {\r\n    width: 100%;\r\n    background-color: lightgray;\r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../client/src/app/footer/footer.component.html":
/***/ (function(module, exports) {

module.exports = "<footer>\r\n    Copyright &copy; Food Web\r\n</footer>\r\n"

/***/ }),

/***/ "../../../../../client/src/app/footer/footer.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FooterComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var FooterComponent = (function () {
    function FooterComponent() {
    }
    FooterComponent.prototype.ngOnInit = function () {
    };
    FooterComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-footer',
            template: __webpack_require__("../../../../../client/src/app/footer/footer.component.html"),
            styles: [__webpack_require__("../../../../../client/src/app/footer/footer.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], FooterComponent);
    return FooterComponent;
}());

//# sourceMappingURL=footer.component.js.map

/***/ }),

/***/ "../../../../../client/src/app/header/header.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".nav-link {\r\n    /* Make border same color as navigation bar background when not in hover state so size remains consistent */\r\n    border-right: 1px solid #292B2C;\r\n    border-left: 1px solid #292B2C;\r\n    font-size: 30px;\r\n    height: 100%;\r\n    min-height: 75px;\r\n    display: inline-block;\r\n    text-align: center;\r\n    outline: none;\r\n    transition: background 0.5s ease, color 0.5s ease;\r\n    -webkit-transition: background 0.5s ease, color 0.5s ease;\r\n    -moz-transition: background 0.5s ease, color 0.5s ease;\r\n    -ms-transition: background 0.5s ease, color 0.5s ease;\r\n    -o-transition: background 0.5s ease, color 0.5s ease;\r\n}\r\n\r\n.nav-link:hover {\r\n    background-color: #444444;\r\n    color: goldenrod !important;\r\n    cursor: pointer;\r\n    cursor: hand;\r\n    border-right: 1px solid #555555;\r\n    border-left: 1px solid #555555;\r\n}\r\n\r\n.nav-item {\r\n    margin: 0px 10px 0px 10px;\r\n    white-space: nowrap;\r\n}\r\n\r\n.navbar-toggler {\r\n    height: 70px;\r\n    font-size: 30px;\r\n    padding: 0px;\r\n    text-align: center;\r\n    outline: none;\r\n    transition: background 0.5s ease;\r\n    -webkit-transition: background 0.5s ease;\r\n    -moz-transition: background 0.5s ease;\r\n    -ms-transition: background 0.5s ease;\r\n    -o-transition: background 0.5s ease;\r\n}\r\n\r\n.navbar-toggler:hover {\r\n    background-color: #444444;\r\n    cursor: pointer;\r\n    cursor: hand;\r\n}\r\n\r\nheader {\r\n\ttext-align: center;\r\n\tfont-size: 30px;\r\n\theight: 150px;\r\n\tposition: absolute;\r\n\tleft: 0px;\r\n\ttop: 0px;\r\n\twidth: 100%;\r\n\tz-index: 100; /*Keep this on top!*/\r\n}\r\n\r\n#logo {\r\n\theight: 150px;\r\n\tposition: absolute;\r\n\tleft: 0px;\r\n\ttop: 0px;\r\n\twidth: 262px;\r\n\tpadding: 0;\r\n\tmargin: 0;\r\n}\r\n\r\nnav {\r\n\tmax-height: 75px;\r\n    margin-left: 262px;\r\n    padding: 0px 2px 0px 2px;\r\n}\r\n\r\n#vertSpacer {\r\n\tposition: relative;\r\n\tmargin-top: 150px; /* Everything must fall below the header on the page!*/\r\n}\r\n\r\n@media screen and (max-width: 767px) {\r\n\tnav {\r\n\t\tmax-height: 100%;\r\n\t\tmin-height: 65px;\r\n\t\tmargin-left: 0px;\r\n\t}\r\n\r\n\theader {\r\n\t\theight: auto;\r\n\t\tposition: relative;\r\n\t}\r\n\r\n\t#logo {\r\n\t\tvisibility: hidden;\r\n\t}\r\n\r\n\t#vertSpacer {\r\n\t\tvisibility: hidden;\r\n\t\tposition: absolute;\r\n\t}\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../client/src/app/header/header.component.html":
/***/ (function(module, exports) {

module.exports = "<header>\r\n    <img id=\"logo\" class=\"navbar-brand\" src=\"./assets/HeaderImg.jpg\" [routerLink]=\"['/home']\">\r\n\r\n    <nav class=\"navbar navbar-toggleable-sm navbar-inverse bg-inverse no-select\">\r\n        <button md-button class=\"navbar-toggler\" (click)=\"isExpanded = !isExpanded\" [attr.aria-expanded]=\"!isExpanded\" aria-controls=\"navbarContent\">\r\n            <span class=\"navbar-toggler-icon\"></span>\r\n        </button>\r\n\r\n        <div class=\"collapse navbar-collapse\" [ngbCollapse]=\"!isExpanded\">\r\n            <ul class=\"navbar-nav mr-auto\">\r\n                <button md-button class='nav-link' [routerLink]=\"['/home']\"><li class=\"nav-item\">Home</li></button>\r\n                <button md-button class='nav-link' [routerLink]=\"['/donate']\"><li class=\"nav-item\">Donate</li></button>\r\n                <button md-button class='nav-link' [routerLink]=\"['/receive']\"><li class=\"nav-item\">Receive</li></button>\r\n            </ul>\r\n\r\n            <ul class=\"navbar-nav navbar-right\">\r\n                <button md-button *ngIf=\"!sessionDataAvailable()\" class='nav-link' (click)=\"showLogin()\"><li class=\"nav-item\">Login</li></button>\r\n                <button md-button *ngIf=\"!sessionDataAvailable()\" class='nav-link' [routerLink]=\"['/signup']\"><li class=\"nav-item\">Signup</li></button>\r\n                <button md-button *ngIf=\"sessionDataAvailable()\" class='nav-link' [routerLink]=\"['/cart']\"><li class=\"nav-item\">Cart</li></button>\r\n                <button md-button *ngIf=\"sessionDataAvailable()\" class='nav-link' [routerLink]=\"['/appUserInfo']\"><li class=\"nav-item\">Account</li></button>\r\n                <button md-button *ngIf=\"sessionDataAvailable()\" class='nav-link' (click)=\"logout()\"><li class=\"nav-item\">Logout</li></button>\r\n            </ul>\r\n        </div>\r\n    </nav>\r\n</header>\r\n<div id=\"vertSpacer\"></div>"

/***/ }),

/***/ "../../../../../client/src/app/header/header.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HeaderComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap_modal__ = __webpack_require__("../../../../ng2-bootstrap-modal/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap_modal___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap_modal__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__authentication_login_login_component__ = __webpack_require__("../../../../../client/src/app/authentication/login/login.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_util_session_data_service__ = __webpack_require__("../../../../../client/src/app/common-util/session-data.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__authentication_misc_logout_service__ = __webpack_require__("../../../../../client/src/app/authentication/misc/logout.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var HeaderComponent = (function () {
    function HeaderComponent(dialogService, sessionDataService, logoutService) {
        this.dialogService = dialogService;
        this.sessionDataService = sessionDataService;
        this.logoutService = logoutService;
    }
    HeaderComponent.prototype.showLogin = function () {
        var dialogObserver = __WEBPACK_IMPORTED_MODULE_2__authentication_login_login_component__["a" /* LoginComponent */].display(this.dialogService);
        // Necessary so that observable action takes place!
        dialogObserver.subscribe(function () { });
    };
    HeaderComponent.prototype.logout = function () {
        this.logoutService.logout();
    };
    HeaderComponent.prototype.sessionDataAvailable = function () {
        return this.sessionDataService.sessionDataAvailable();
    };
    HeaderComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-header',
            template: __webpack_require__("../../../../../client/src/app/header/header.component.html"),
            styles: [__webpack_require__("../../../../../client/src/app/header/header.component.css")],
            providers: [__WEBPACK_IMPORTED_MODULE_4__authentication_misc_logout_service__["a" /* LogoutService */]]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap_modal__["DialogService"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap_modal__["DialogService"]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__common_util_session_data_service__["a" /* SessionDataService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__common_util_session_data_service__["a" /* SessionDataService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_4__authentication_misc_logout_service__["a" /* LogoutService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__authentication_misc_logout_service__["a" /* LogoutService */]) === "function" && _c || Object])
    ], HeaderComponent);
    return HeaderComponent;
    var _a, _b, _c;
}());

//# sourceMappingURL=header.component.js.map

/***/ }),

/***/ "../../../../../client/src/app/home/home.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../client/src/app/home/home.component.html":
/***/ (function(module, exports) {

module.exports = "<app-banner bannerSrc=\"../assets/BannerImg.jpg\" bannerHeight=\"680px\"></app-banner>\n"

/***/ }),

/***/ "../../../../../client/src/app/home/home.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomeComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var HomeComponent = (function () {
    function HomeComponent() {
    }
    HomeComponent.prototype.ngOnInit = function () {
    };
    HomeComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-home',
            template: __webpack_require__("../../../../../client/src/app/home/home.component.html"),
            styles: [__webpack_require__("../../../../../client/src/app/home/home.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], HomeComponent);
    return HomeComponent;
}());

//# sourceMappingURL=home.component.js.map

/***/ }),

/***/ "../../../../../client/src/app/receive/receive.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "#details-img {\r\n    float: left;\r\n}\r\n\r\n/* When the screen gets small and the filters panel goes into mobile mode, then center the food listings */\r\n@media only screen and (max-width: 1200px) {\r\n    #food-listings {\r\n        float: none;\r\n        padding-left: 40px;\r\n        margin-left: auto;\r\n        margin-right: auto;\r\n    }\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../client/src/app/receive/receive.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid\">\r\n    <div id=\"receivers-row\" class=\"row\">\r\n        <div class=\"col-md-3\" id=\"filters\">\r\n            <app-food-listings-filters header=\"Search Filters\" [formGroup]=\"foodListingsFiltersComponent.filtersForm\" #foodListingsFilters>\r\n            </app-food-listings-filters>\r\n        </div>\r\n\r\n        <div id=\"food-listings\" class=\"col-md-9\">\r\n            <app-food-listings header=\"Available Food\" #foodListings>\r\n                <ng-container details-modal-footer>\r\n                    <button md-raised-button color=\"primary\" class=\"button-md\" (click)=\"claimSelectedFoodListing()\">Claim</button>\r\n                </ng-container>\r\n            </app-food-listings>\r\n        </div>\r\n    </div>\r\n</div>"

/***/ }),

/***/ "../../../../../client/src/app/receive/receive.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ReceiveComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__food_listings_food_listings_component__ = __webpack_require__("../../../../../client/src/app/food-listings/food-listings.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__food_listings_food_listings_filters_food_listings_filters_component__ = __webpack_require__("../../../../../client/src/app/food-listings/food-listings-filters/food-listings-filters.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__food_listings_claim_unclaim_food_listing_service__ = __webpack_require__("../../../../../client/src/app/food-listings/claim-unclaim-food-listing.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ReceiveComponent = (function () {
    function ReceiveComponent(claimFoodListingService) {
        this.claimFoodListingService = claimFoodListingService;
    }
    /**
     * Executed after all of the view children have been initialized (so safest to interact with them now).
     */
    ReceiveComponent.prototype.ngAfterViewInit = function () {
        this.foodListingsComponent.refreshFoodListings(this.foodListingsFiltersComponent.getFilterValues());
        this.foodListingsFiltersComponent.onFiltersUpdate(this.foodListingsComponent.refreshFoodListings.bind(this.foodListingsComponent));
    };
    /**
     * Claims the currently selected Food Listing.
     */
    ReceiveComponent.prototype.claimSelectedFoodListing = function () {
        var _this = this;
        var selectedFoodListing = this.foodListingsComponent.getSelectedFoodListing();
        var observer = this.claimFoodListingService.claimFoodListing(selectedFoodListing.foodListingKey);
        // Listen for result.
        observer.subscribe(function () {
            // On success, simply remove the Food Listing from the Receiver Food Listings interface.
            _this.foodListingsComponent.removeSelectedFoodListing();
        }, function (err) {
            console.log(err);
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('foodListingsFilters'),
        __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__food_listings_food_listings_filters_food_listings_filters_component__["a" /* FoodListingsFiltersComponent */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__food_listings_food_listings_filters_food_listings_filters_component__["a" /* FoodListingsFiltersComponent */]) === "function" && _a || Object)
    ], ReceiveComponent.prototype, "foodListingsFiltersComponent", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('foodListings'),
        __metadata("design:type", typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__food_listings_food_listings_component__["a" /* FoodListingsComponent */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__food_listings_food_listings_component__["a" /* FoodListingsComponent */]) === "function" && _b || Object)
    ], ReceiveComponent.prototype, "foodListingsComponent", void 0);
    ReceiveComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-receive',
            template: __webpack_require__("../../../../../client/src/app/receive/receive.component.html"),
            styles: [__webpack_require__("../../../../../client/src/app/receive/receive.component.css")],
            providers: [__WEBPACK_IMPORTED_MODULE_3__food_listings_claim_unclaim_food_listing_service__["a" /* ClaimFoodListingService */]]
        }),
        __metadata("design:paramtypes", [typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__food_listings_claim_unclaim_food_listing_service__["a" /* ClaimFoodListingService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__food_listings_claim_unclaim_food_listing_service__["a" /* ClaimFoodListingService */]) === "function" && _c || Object])
    ], ReceiveComponent);
    return ReceiveComponent;
    var _a, _b, _c;
}());

//# sourceMappingURL=receive.component.js.map

/***/ }),

/***/ "../../../../../client/src/app/slick-left-panel/slick-left-panel.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "#slick-left-panel {\r\n    position: absolute;\r\n    z-index: 100;\r\n    padding-left: 10px;\r\n    padding-right: 25px;\r\n    word-wrap: break-word;\r\n    width: calc(100vw - 20px);\r\n    max-width: 400px; /* This is (4 / 12) of 1200px so that we will never overlap anything to the right in non-mobile mode! */\r\n    background-color: inherit;\r\n}\r\n\r\n#slick-left-panel-button {\r\n    position: absolute;\r\n    height: 100%;\r\n    width: 25px;\r\n    right: -25px;\r\n    top:0;\r\n    background: darkgray;\r\n    cursor: pointer;\r\n    cursor: hand;\r\n    visibility: hidden;\r\n    transition: background 0.5s ease, right 0.5s linear;\r\n    -webkit-transition: background 0.5s ease, right 0.5s linear;\r\n    -moz-transition: background 0.5s ease, right 0.5s linear;\r\n    -ms-transition: background 0.5s ease, right 0.5s linear;\r\n    -o-transition: background 0.5s ease, right 0.5s linear;\r\n    z-index: 101;\r\n    opacity: 0.67;\r\n}\r\n\r\n#slick-left-panel-button:hover {\r\n    background: black;\r\n}\r\n\r\n@media only screen and (max-width: 1200px) {\r\n    #slick-left-panel {\r\n        right: 100%; /* The default state in mobile mode is to be off the screen to the left */\r\n        transition: -webkit-transform 0.5s linear;\r\n        transition: transform 0.5s linear;\r\n        transition: transform 0.5s linear, -webkit-transform 0.5s linear;\r\n        -webkit-transition: -webkit-transform 0.5s linear;\r\n        -moz-transition: -moz-transform 0.5s linear;\r\n        -ms-transition: -ms-transform 0.5s linear;\r\n        -o-transition: -o-transform 0.5s linear;\r\n        background: white;\r\n    }\r\n\r\n    .toggle-into-view {\r\n        transform: translateX(100%);\r\n        -webkit-transform: translateX(100%);\r\n        -moz-transform: translateX(100%);\r\n        -ms-transform: translateX(100%);\r\n        -o-transform: translateX(100%);\r\n    }\r\n\r\n    #slick-left-panel-button {\r\n        visibility: visible;\r\n    }\r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../client/src/app/slick-left-panel/slick-left-panel.component.html":
/***/ (function(module, exports) {

module.exports = "<div id=\"slick-left-panel\" #slickLeftPanel>\n\n    <button type=\"button\" class=\"navbar-toggler arrow right\" id=\"slick-left-panel-button\" [title]=\"buttonTitle\"\n     #slickLeftPanelButton (click)=\"togglePanelVisibility(slickLeftPanel, slickLeftPanelButton)\"></button>\n\n    <ng-content></ng-content>\n    \n</div>\n"

/***/ }),

/***/ "../../../../../client/src/app/slick-left-panel/slick-left-panel.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SlickLeftPanelComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var SlickLeftPanelComponent = (function () {
    function SlickLeftPanelComponent() {
        this.buttonTitle = "toggle";
    }
    SlickLeftPanelComponent.prototype.ngOnInit = function () {
        // We want to handle scroll events to determine when we should start fixing the slickLeftPanel at top of viewport!
        //window.onscroll = this.monitorScrollForStickyTop.bind(this);
    };
    /**
     * Called whenever the slickLeftPanelButton is pressed. Handles the toggling of the slickLeftPanel when in mobile mode.
     * @param slickLeftPanel The slickLeftPanel (div) element which will be toggled in or out of the viewport.
     * @param slickLeftPanelButton The slickLeftPanelButton (button) element which was pressed.
     */
    SlickLeftPanelComponent.prototype.togglePanelVisibility = function (slickLeftPanel, slickLeftPanelButton) {
        // If our slickLeftPanel div is outside the viewport, and we are translating it into the viewport
        if (!this.isPanelToggledIntoView(slickLeftPanel)) {
            this.toggleIntoView(slickLeftPanel, slickLeftPanelButton);
        }
        else {
            this.toggleOutOfView(slickLeftPanel, slickLeftPanelButton);
        }
    };
    /**
     * Determines if the slick left panel is toggled into the viewport.
     * @param slickLeftPanel The slick left panel (div) element.
     */
    SlickLeftPanelComponent.prototype.isPanelToggledIntoView = function (slickLeftPanel) {
        // If it is in view, then there will be a translation value!
        return slickLeftPanel.classList.contains('toggle-into-view');
    };
    /**
     * Toggles the slickLeftPanel into the viewport.
     * @param slickLeftPanel The slickLeftPanel (div) element which will be toggled into the viewport.
     * @param slickLeftPanelButton The slickLeftPanelButton (button) element which was pressed.
     */
    SlickLeftPanelComponent.prototype.toggleIntoView = function (slickLeftPanel, slickLeftPanelButton) {
        // The toggle-into-view css class contains the translation.
        slickLeftPanel.classList.add('toggle-into-view');
        slickLeftPanelButton.style.right = '0px';
    };
    /**
     * Toggles the slickLeftPanel out of the viewport.
     * @param slickLeftPanel The slickLeftPanel (div) element which will be toggled out of the viewport.
     * @param slickLeftPanelButton The slickLeftPanelButton (button) element which was pressed.
     */
    SlickLeftPanelComponent.prototype.toggleOutOfView = function (slickLeftPanel, slickLeftPanelButton) {
        slickLeftPanel.classList.remove('toggle-into-view');
        slickLeftPanelButton.style.right = '-' + slickLeftPanelButton.offsetWidth + 'px';
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], SlickLeftPanelComponent.prototype, "buttonTitle", void 0);
    SlickLeftPanelComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-slick-left-panel',
            template: __webpack_require__("../../../../../client/src/app/slick-left-panel/slick-left-panel.component.html"),
            styles: [__webpack_require__("../../../../../client/src/app/slick-left-panel/slick-left-panel.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], SlickLeftPanelComponent);
    return SlickLeftPanelComponent;
}());

//# sourceMappingURL=slick-left-panel.component.js.map

/***/ }),

/***/ "../../../../../client/src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var environment = {
    production: false
};
//# sourceMappingURL=environment.js.map

/***/ }),

/***/ "../../../../../client/src/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__("../../../platform-browser-dynamic/@angular/platform-browser-dynamic.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__("../../../../../client/src/app/app.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("../../../../../client/src/environments/environment.ts");




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["enableProdMode"])();
}
Object(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ "../../../../../shared/authentication/app-user-info.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppUserInfo; });
/**
 * Encapsulates information pertaining to an AppUser that is shared between client and server.
 */
var AppUserInfo = (function () {
    function AppUserInfo(email, lastName, firstName, address, city, state, zip, phone, isDonor, isReceiver, organizationName) {
        this.email = email;
        this.lastName = lastName;
        this.firstName = firstName;
        this.address = address;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.phone = phone;
        this.isDonor = isDonor;
        this.isReceiver = isReceiver;
        this.organizationName = organizationName;
    }
    return AppUserInfo;
}());

//# sourceMappingURL=app-user-info.js.map

/***/ }),

/***/ "../../../../../shared/authentication/login-message.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginRequest; });
/* unused harmony export LoginResponse */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__message_protocol_food_web_response__ = __webpack_require__("../../../../../shared/message-protocol/food-web-response.ts");
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var LoginRequest = (function () {
    function LoginRequest(email, password) {
        this.email = email;
        this.password = password;
    }
    return LoginRequest;
}());

var LoginResponse = (function (_super) {
    __extends(LoginResponse, _super);
    function LoginResponse(
        /**
         * The shared info related to the App User that has successfully signed up.
         */
        appUserInfo, 
        /**
         * Indicates whether or not the operation on the back end was successful.
         */
        success, 
        /**
         * A message containing information pertaining to what happened during processing on the back end. If successful, then it should
         * contain a simple success message. If unsuccessful, then it should contain the error message (without leaking sensitive data).
         */
        message, 
        /**
         * Indicates if there is a need for the user to login to perform the related operation on the server.
         */
        loginRequired, 
        /**
         * Indicates if there is a need for the user to have their signup confirmed before performing certain functionality.
         */
        signupConfirmRequired) {
        if (loginRequired === void 0) { loginRequired = false; }
        if (signupConfirmRequired === void 0) { signupConfirmRequired = false; }
        var _this = _super.call(this, success, message, loginRequired, signupConfirmRequired) || this;
        _this.appUserInfo = appUserInfo;
        _this.success = success;
        _this.message = message;
        _this.loginRequired = loginRequired;
        _this.signupConfirmRequired = signupConfirmRequired;
        return _this;
    }
    return LoginResponse;
}(__WEBPACK_IMPORTED_MODULE_0__message_protocol_food_web_response__["a" /* FoodWebResponse */]));

//# sourceMappingURL=login-message.js.map

/***/ }),

/***/ "../../../../../shared/authentication/signup-message.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SignupRequest; });
/**
 * Contains data that should be sent during a signup request.
 */
var SignupRequest = (function () {
    function SignupRequest(appUserInfo, password) {
        this.appUserInfo = appUserInfo;
        this.password = password;
    }
    return SignupRequest;
}());

// No signup response necessary since all the necessary information was submitted from the front end (nothing needs to be sent back).
//# sourceMappingURL=signup-message.js.map

/***/ }),

/***/ "../../../../../shared/authentication/update-app-user-message.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UpdateAppUserRequest; });
/**
 * Contains data that should be sent during an update app user request.
 */
var UpdateAppUserRequest = (function () {
    function UpdateAppUserRequest(appUserUpdateInfo, newPassword, currentPassword) {
        this.appUserUpdateInfo = appUserUpdateInfo;
        this.newPassword = newPassword;
        this.currentPassword = currentPassword;
    }
    return UpdateAppUserRequest;
}());

//# sourceMappingURL=update-app-user-message.js.map

/***/ }),

/***/ "../../../../../shared/common-util/date-formatter.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DateFormatter; });
var DateFormatter = (function () {
    // Pure static class!
    function DateFormatter() {
    }
    DateFormatter.dateToMonthDayYearString = function (date) {
        if (date != null) {
            // Check to see if we are in fact passed a Date object (may have been stringified in JSON response)!
            if (!(date instanceof Date)) {
                date = new Date(date);
            }
            return (date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear());
        }
        return '';
    };
    return DateFormatter;
}());

//# sourceMappingURL=date-formatter.js.map

/***/ }),

/***/ "../../../../../shared/common-util/validation.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Validation; });
/**
 * Validation definitions that can commonly be used by front end angular forms and back end node logic.
 */
var Validation = (function () {
    function Validation() {
    }
    /**
     * Checks if an email string is in the correct format.
     * @param email The email string to check.
     * @return true if it is, false if not.
     */
    Validation.emailValidator = function (email) {
        // RFC 2822 compliant regex
        return email.match(Validation.EMAIL_REGEX).length != null;
    };
    /**
     * Checks if a password string is in the correct format.
     * @param password The password string to check.
     * @return true if it is, false if not.
     */
    Validation.passwordValidator = function (password) {
        // {6,20}           - Assert password is between 6 and 20 characters
        // (?=.*[0-9])      - Assert a string has at least one number
        return password.match(Validation.PASSWORD_REGEX).length != null;
    };
    /**
     * Checks if a 7 digit phone number with dashes (string) is in the correct format.
     * @param phone The phone number string to check.
     * @return true if it is, false if not.
     */
    Validation.phoneValidator = function (phone) {
        return phone.match(Validation.PHONE_REGEX).length != null;
    };
    /**
     * Checks if a 5 digit ZIP code is in the correct format.
     * @param zip The ZIP code to check.
     * @return true if it is, false if not.
     */
    Validation.zipValidator = function (zip) {
        return zip.match(Validation.ZIP_REGEX).length != null;
    };
    /**
     * Validates given app user information and password.
     * @param appUserInfo The app user info to validate.
     * @param password The password to validate.
     * @return On successful validation, null. On unsuccess, then an error is returned.
     */
    Validation.validateAppUserInfo = function (appUserInfo, password) {
        if (appUserInfo.email != null && !Validation.emailValidator(appUserInfo.email)) {
            return new Error('Provided email not in correct format.');
        }
        if (password != null && !Validation.passwordValidator(password)) {
            return new Error('Incorrect password format. Password must contain a minimum of 6 characters and at least one number');
        }
        if (appUserInfo.zip != null && !Validation.zipValidator(appUserInfo.zip.toString())) {
            return new Error('Incorrect ZIP code format. The ZIP code must contain exactly 5 numbers.');
        }
        return null;
    };
    /**
     * Regular expression used for verifying email correctness.
     */
    Validation.EMAIL_REGEX = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    /**
     * Regular expression used for verifying password correctness.
     */
    Validation.PASSWORD_REGEX = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,20}$/;
    /**
     * Regular expression used for verifying 10 digit phone numbers with dashes.
     */
    Validation.PHONE_REGEX = /^\d{3}\-\d{3}\-\d{4}$/;
    /**
     * Regular expression used for verifying 5 digit ZIP codes.
     */
    Validation.ZIP_REGEX = /^\d{5}$/;
    return Validation;
}());

//# sourceMappingURL=validation.js.map

/***/ }),

/***/ "../../../../../shared/food-listings/add-food-listing-message.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AddFoodListingRequest; });
/* unused harmony export AddFoodListingResponse */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__message_protocol_food_web_response__ = __webpack_require__("../../../../../shared/message-protocol/food-web-response.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__food_listing_upload__ = __webpack_require__("../../../../../shared/food-listings/food-listing-upload.ts");
/* unused harmony reexport FoodListingUpload */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var AddFoodListingRequest = (function () {
    function AddFoodListingRequest(foodListingUpload) {
        this.foodListingUpload = foodListingUpload;
    }
    return AddFoodListingRequest;
}());

var AddFoodListingResponse = (function (_super) {
    __extends(AddFoodListingResponse, _super);
    function AddFoodListingResponse(
        /**
         * The key of the added food listing. Can be used to edit the added listing.
         */
        foodListingKey, 
        /**
         * Indicates whether or not the operation on the back end was successful.
         */
        success, 
        /**
         * A message containing information pertaining to what happened during processing on the back end. If successful, then it should
         * contain a simple success message. If unsuccessful, then it should contain the error message (without leaking sensitive data).
         */
        message, 
        /**
         * Indicates if there is a need for the user to login to perform the related operation on the server.
         */
        loginRequired, 
        /**
         * Indicates if there is a need for the user to have their signup confirmed before performing certain functionality.
         */
        signupConfirmRequired) {
        if (loginRequired === void 0) { loginRequired = false; }
        if (signupConfirmRequired === void 0) { signupConfirmRequired = false; }
        var _this = _super.call(this, success, message, loginRequired, signupConfirmRequired) || this;
        _this.foodListingKey = foodListingKey;
        _this.success = success;
        _this.message = message;
        _this.loginRequired = loginRequired;
        _this.signupConfirmRequired = signupConfirmRequired;
        return _this;
    }
    return AddFoodListingResponse;
}(__WEBPACK_IMPORTED_MODULE_0__message_protocol_food_web_response__["a" /* FoodWebResponse */]));

//# sourceMappingURL=add-food-listing-message.js.map

/***/ }),

/***/ "../../../../../shared/food-listings/claim-food-listing-message.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClaimFoodListingRequest; });
/**
 * The expected request for the (un)claim food listings operation. Should be sent from the client to the server.
 */
var ClaimFoodListingRequest = (function () {
    function ClaimFoodListingRequest(
        /**
         * The key identifier of the Food Listing to be claimed.
         */
        foodListingKey) {
        this.foodListingKey = foodListingKey;
    }
    return ClaimFoodListingRequest;
}());

//# sourceMappingURL=claim-food-listing-message.js.map

/***/ }),

/***/ "../../../../../shared/food-listings/food-listing-upload.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export FoodListingUpload */
/**
 * A container for holding data used in the upload of a new food listing.
 */
var FoodListingUpload = (function () {
    function FoodListingUpload(foodListingKey, foodTypes, foodDescription, perishable, 
        /**
         * Expiration date of the format mm/dd/yyyy
         */
        expirationDate, 
        /**
         * The string representation of the image associated with the listing.
         * Should only be populated for the addition or upload of a new Food Listing.
         */
        imageUpload) {
        this.foodListingKey = foodListingKey;
        this.foodTypes = foodTypes;
        this.foodDescription = foodDescription;
        this.perishable = perishable;
        this.expirationDate = expirationDate;
        this.imageUpload = imageUpload;
    }
    return FoodListingUpload;
}());

//# sourceMappingURL=food-listing-upload.js.map

/***/ }),

/***/ "../../../../../shared/food-listings/food-listing.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export FoodListing */
/**
 * A single Food Listing entry that mainly contains data that is relavent to the user when browsing food listings.
 */
var FoodListing = (function () {
    function FoodListing(foodListingKey, donorOrganizationName, donorOrganizationAddress, donorOrganizationCity, donorOrganizationState, donorOrganizationZip, donorLastName, donorFirstName, 
        /**
         * The distance of the donor from the receiver that is browsing the food listings.
         */
        donorDistance, foodTypes, foodDescription, quantityClass, perishable, 
        /**
         * Expiration date of the format mm/dd/yyyy
         */
        expirationDate, 
        /**
         * The url of a saved Food Listing that will be used to display the associated image.
         */
        imgUrl) {
        this.foodListingKey = foodListingKey;
        this.donorOrganizationName = donorOrganizationName;
        this.donorOrganizationAddress = donorOrganizationAddress;
        this.donorOrganizationCity = donorOrganizationCity;
        this.donorOrganizationState = donorOrganizationState;
        this.donorOrganizationZip = donorOrganizationZip;
        this.donorLastName = donorLastName;
        this.donorFirstName = donorFirstName;
        this.donorDistance = donorDistance;
        this.foodTypes = foodTypes;
        this.foodDescription = foodDescription;
        this.quantityClass = quantityClass;
        this.perishable = perishable;
        this.expirationDate = expirationDate;
        this.imgUrl = imgUrl;
    }
    return FoodListing;
}());

//# sourceMappingURL=food-listing.js.map

/***/ }),

/***/ "../../../../../shared/food-listings/food-listings-filters.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LISTINGS_STATUS; });
/* unused harmony export FoodListingsFilters */
/**
 * An emumeration of different food listing statuses to filter on.
 */
var LISTINGS_STATUS;
(function (LISTINGS_STATUS) {
    LISTINGS_STATUS[LISTINGS_STATUS["unclaimedListings"] = 0] = "unclaimedListings";
    LISTINGS_STATUS[LISTINGS_STATUS["myClaimedListings"] = 1] = "myClaimedListings";
    LISTINGS_STATUS[LISTINGS_STATUS["myDonatedListings"] = 2] = "myDonatedListings";
})(LISTINGS_STATUS || (LISTINGS_STATUS = {}));
;
/**
 * A basic container for Food Listing filter data that may be sent to/from the server/client.
 */
var FoodListingsFilters = (function () {
    function FoodListingsFilters(
        /**
         * Determines what food types the results should contain.
         */
        foodTypes, 
        /**
         * Determines if results should include perishable elements.
         */
        perishable, 
        /**
         * Determines if results should include non-perishable elements.
         */
        notPerishable, 
        /**
         * Determines the minimum date that retrieved items may expire after.
         */
        earliestExpireDate, 
        /**
         * Determines the maximum distance from the requesting entity that donations must fall within.
         */
        maxDistance, 
        /**
         * Determines the offset used when retrieving a limited segment of food listings.
         */
        retrievalOffset, 
        /**
         * Determines the number of food listings that will be contained in the limited segment of retrievals.
         */
        retrievalAmount, 
        /**
         * Determines what food listings we should bring back based off of their status (unclaimed, claimed, or donated relative to the current user).
         */
        listingsStatus) {
        if (listingsStatus === void 0) { listingsStatus = LISTINGS_STATUS.unclaimedListings; }
        this.foodTypes = foodTypes;
        this.perishable = perishable;
        this.notPerishable = notPerishable;
        this.earliestExpireDate = earliestExpireDate;
        this.maxDistance = maxDistance;
        this.retrievalOffset = retrievalOffset;
        this.retrievalAmount = retrievalAmount;
        this.listingsStatus = listingsStatus;
    }
    return FoodListingsFilters;
}());

//# sourceMappingURL=food-listings-filters.js.map

/***/ }),

/***/ "../../../../../shared/food-listings/get-food-listings-message.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GetFoodListingsRequest; });
/* unused harmony export GetFoodListingsResponse */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__food_listings_food_listings_filters__ = __webpack_require__("../../../../../shared/food-listings/food-listings-filters.ts");
/* unused harmony reexport FoodListingsFilters */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__message_protocol_food_web_response__ = __webpack_require__("../../../../../shared/message-protocol/food-web-response.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__food_listings_food_listing__ = __webpack_require__("../../../../../shared/food-listings/food-listing.ts");
/* unused harmony reexport FoodListing */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





/**
 * The expected request for the get food listings operation. Should be sent from the client to the server.
 */
var GetFoodListingsRequest = (function () {
    function GetFoodListingsRequest(
        /**
         * Filters to use when getting food listings.
         */
        filters) {
        this.filters = filters;
    }
    return GetFoodListingsRequest;
}());

/**
 * The expected response from the get food listings operation. Should be sent form the server to the client.
 */
var GetFoodListingsResponse = (function (_super) {
    __extends(GetFoodListingsResponse, _super);
    function GetFoodListingsResponse(
        /**
         * The food listings that were retrieved during the server operation.
         */
        foodListings, 
        /**
         * Indicates whether or not the operation on the back end was successful.
         */
        success, 
        /**
         * A message containing information pertaining to what happened during processing on the back end. If successful, then it should
         * contain a simple success message. If unsuccessful, then it should contain the error message (without leaking sensitive data).
         */
        message, 
        /**
         * Indicates if there is a need for the user to login to perform the related operation on the server.
         */
        loginRequired, 
        /**
         * Indicates if there is a need for the user to have their signup confirmed before performing certain functionality.
         */
        signupConfirmRequired) {
        if (loginRequired === void 0) { loginRequired = false; }
        if (signupConfirmRequired === void 0) { signupConfirmRequired = false; }
        var _this = _super.call(this, success, message, loginRequired, signupConfirmRequired) || this;
        _this.foodListings = foodListings;
        _this.success = success;
        _this.message = message;
        _this.loginRequired = loginRequired;
        _this.signupConfirmRequired = signupConfirmRequired;
        return _this;
    }
    return GetFoodListingsResponse;
}(__WEBPACK_IMPORTED_MODULE_1__message_protocol_food_web_response__["a" /* FoodWebResponse */]));

//# sourceMappingURL=get-food-listings-message.js.map

/***/ }),

/***/ "../../../../../shared/message-protocol/food-web-response.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FoodWebResponse; });
/**
 * Basic format for responses from the server. All responses should follow this interface!
 */
var FoodWebResponse = (function () {
    function FoodWebResponse(
        /**
         * Indicates whether or not the operation on the back end was successful.
         */
        success, 
        /**
         * A message containing information pertaining to what happened during processing on the back end. If successful, then it should
         * contain a simple success message. If unsuccessful, then it should contain the error message (without leaking sensitive data).
         */
        message, 
        /**
         * Indicates if there is a need for the user to login to perform the related operation on the server.
         */
        loginRequired, 
        /**
         * Indicates if there is a need for the user to have their signup confirmed before performing certain functionality.
         */
        signupConfirmRequired) {
        if (loginRequired === void 0) { loginRequired = false; }
        if (signupConfirmRequired === void 0) { signupConfirmRequired = false; }
        this.success = success;
        this.message = message;
        this.loginRequired = loginRequired;
        this.signupConfirmRequired = signupConfirmRequired;
    }
    return FoodWebResponse;
}());

//# sourceMappingURL=food-web-response.js.map

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("../../../../../client/src/main.ts");


/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map