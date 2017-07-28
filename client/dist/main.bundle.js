webpackJsonp([1],{

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
exports.push([module.i, "html, body {\r\n    height: 100%;\r\n    padding: 0;\r\n    margin: 0;\r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../client/src/app/app.component.html":
/***/ (function(module, exports) {

module.exports = "<!--The whole content below can be removed with the new code.-->\r\n<div id=\"fullPage\">\r\n\t<app-header id='appHeader'></app-header>\r\n\r\n\t<router-outlet></router-outlet>\r\n\r\n\t<app-footer id='appFooter'></app-footer>\r\n</div>\r\n"

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
            selector: 'app-root',
            template: __webpack_require__("../../../../../client/src/app/app.component.html"),
            styles: [__webpack_require__("../../../../../client/src/app/app.component.css")]
        })
    ], AppComponent);
    return AppComponent;
}());

//# sourceMappingURL=C:/Users/User Name/ConnectFood/client/dist/app/app.component.js.map

/***/ }),

/***/ "../../../../../client/src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__("../../../platform-browser/@angular/platform-browser.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__("../../../http/@angular/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ng_bootstrap_ng_bootstrap__ = __webpack_require__("../../../../@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ng2_bootstrap_modal__ = __webpack_require__("../../../../ng2-bootstrap-modal/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ng2_bootstrap_modal___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_ng2_bootstrap_modal__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_forms__ = __webpack_require__("../../../forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__app_component__ = __webpack_require__("../../../../../client/src/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__home_home_component__ = __webpack_require__("../../../../../client/src/app/home/home.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__header_header_component__ = __webpack_require__("../../../../../client/src/app/header/header.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__footer_footer_component__ = __webpack_require__("../../../../../client/src/app/footer/footer.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__authentication_login_component__ = __webpack_require__("../../../../../client/src/app/authentication/login.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__donor_donor_component__ = __webpack_require__("../../../../../client/src/app/donor/donor.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__receiver_receiver_component__ = __webpack_require__("../../../../../client/src/app/receiver/receiver.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_ng2_img_cropper__ = __webpack_require__("../../../../ng2-img-cropper/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__shared_date_formatter_pipe__ = __webpack_require__("../../../../../client/src/app/shared/date-formatter.pipe.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__authentication_auth_gaurd_service__ = __webpack_require__("../../../../../client/src/app/authentication/auth-gaurd.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__authentication_signup_component__ = __webpack_require__("../../../../../client/src/app/authentication/signup.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__receiver_cart_receiver_cart_component__ = __webpack_require__("../../../../../client/src/app/receiver-cart/receiver-cart.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



















var appRoutes = [
    {
        path: 'login',
        component: __WEBPACK_IMPORTED_MODULE_11__authentication_login_component__["a" /* LoginComponent */]
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/home'
    },
    {
        path: 'home',
        component: __WEBPACK_IMPORTED_MODULE_8__home_home_component__["a" /* HomeComponent */]
    },
    {
        path: 'donor',
        component: __WEBPACK_IMPORTED_MODULE_12__donor_donor_component__["a" /* DonorComponent */],
        canActivate: [__WEBPACK_IMPORTED_MODULE_16__authentication_auth_gaurd_service__["a" /* AuthGaurdService */]]
    },
    {
        path: 'receiver',
        component: __WEBPACK_IMPORTED_MODULE_13__receiver_receiver_component__["a" /* ReceiverComponent */]
    },
    {
        path: 'signup',
        component: __WEBPACK_IMPORTED_MODULE_17__authentication_signup_component__["a" /* SignupComponent */]
    }
];
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_7__app_component__["a" /* AppComponent */],
                __WEBPACK_IMPORTED_MODULE_8__home_home_component__["a" /* HomeComponent */],
                __WEBPACK_IMPORTED_MODULE_9__header_header_component__["a" /* HeaderComponent */],
                __WEBPACK_IMPORTED_MODULE_10__footer_footer_component__["a" /* FooterComponent */],
                __WEBPACK_IMPORTED_MODULE_11__authentication_login_component__["a" /* LoginComponent */],
                __WEBPACK_IMPORTED_MODULE_12__donor_donor_component__["a" /* DonorComponent */],
                __WEBPACK_IMPORTED_MODULE_13__receiver_receiver_component__["a" /* ReceiverComponent */],
                __WEBPACK_IMPORTED_MODULE_17__authentication_signup_component__["a" /* SignupComponent */],
                __WEBPACK_IMPORTED_MODULE_14_ng2_img_cropper__["b" /* ImageCropperComponent */],
                __WEBPACK_IMPORTED_MODULE_15__shared_date_formatter_pipe__["a" /* DateFormatterPipe */],
                __WEBPACK_IMPORTED_MODULE_18__receiver_cart_receiver_cart_component__["a" /* ReceiverCartComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_3__ng_bootstrap_ng_bootstrap__["b" /* NgbModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_5__angular_router__["b" /* RouterModule */].forRoot(appRoutes),
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_4_ng2_bootstrap_modal__["BootstrapModalModule"],
                __WEBPACK_IMPORTED_MODULE_2__angular_http__["c" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_6__angular_forms__["b" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_6__angular_forms__["e" /* ReactiveFormsModule */]
            ],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_11__authentication_login_component__["a" /* LoginComponent */]
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_7__app_component__["a" /* AppComponent */]],
            providers: [
                __WEBPACK_IMPORTED_MODULE_15__shared_date_formatter_pipe__["a" /* DateFormatterPipe */],
                __WEBPACK_IMPORTED_MODULE_16__authentication_auth_gaurd_service__["a" /* AuthGaurdService */]
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=C:/Users/User Name/ConnectFood/client/dist/app/app.module.js.map

/***/ }),

/***/ "../../../../../client/src/app/authentication/auth-gaurd.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthGaurdService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__("../../../http/@angular/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ng2_bootstrap_modal__ = __webpack_require__("../../../../ng2-bootstrap-modal/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ng2_bootstrap_modal___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_ng2_bootstrap_modal__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__login_component__ = __webpack_require__("../../../../../client/src/app/authentication/login.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var AuthGaurdService = (function () {
    function AuthGaurdService(http, router, dialogService) {
        this.http = http;
        this.router = router;
        this.dialogService = dialogService;
    }
    AuthGaurdService.prototype.canActivate = function (route, state) {
        var _this = this;
        // If we aren't even marked as logged in locally, then we don't even need to ask server if we are logged in.
        if (sessionStorage.getItem('appUserKey') == null) {
            this.attemptLoginAndRedirect(state.url);
            return false;
        }
        // We are marked as logged in locally, but check with server to ensure we are still authenticated!
        var headers = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Headers */]({
            'Content-Type': 'application/json'
        });
        var observer = this.http.get('/authentication/reAuthenticate');
        // Finally, check the response from the server and react appropriately.
        return observer.map(function (response) {
            var body = response.json();
            // If not a success, then redirect to login.
            if (!body.success) {
                _this.attemptLoginAndRedirect(state.url);
            }
            return body.success;
        });
    };
    /**
     * Generates a login dialog that the user can login with. If login is successful, then the user is redirected to their original target route.
     * @param toUrl THe url that the user was trying to access before reAuthentication.
     */
    AuthGaurdService.prototype.attemptLoginAndRedirect = function (toUrl) {
        var _this = this;
        var dialogObserver = this.dialogService.addDialog(__WEBPACK_IMPORTED_MODULE_4__login_component__["a" /* LoginComponent */], 
        // Dialog Initalization Data
        null, 
        // DialogOptions
        {
            closeByClickingOutside: true,
            backdropColor: '#222222',
        });
        // Observe what the dialog result is.
        dialogObserver.subscribe(function (isConfirmed) {
            // After done with login dialog, if we are logged in, then we can redirect to original intended link!
            if (sessionStorage.getItem('appUserKey') != null) {
                _this.router.navigate([toUrl]);
            }
        });
    };
    AuthGaurdService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__angular_http__["b" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_http__["b" /* Http */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3_ng2_bootstrap_modal__["DialogService"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3_ng2_bootstrap_modal__["DialogService"]) === "function" && _c || Object])
    ], AuthGaurdService);
    return AuthGaurdService;
    var _a, _b, _c;
}());

//# sourceMappingURL=C:/Users/User Name/ConnectFood/client/dist/app/authentication/auth-gaurd.service.js.map

/***/ }),

/***/ "../../../../../client/src/app/authentication/login-model.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginModel; });
/**
 * Contains state data for the Login Component.
 */
var LoginModel = (function () {
    function LoginModel() {
        // Clear these out whenever the user may be redirected to Login by the server!
        sessionStorage.removeItem('appUserKey');
        sessionStorage.removeItem('username');
        this.loginError = false;
    }
    /**
     * Processes a JSON Login Result from the server.
     * -- INPUTS --
     * data: The JSON result from the server. Should be of the format { appUserKey, username }.
     * -- OUTPUT --
     * True if the login was successful, false if it was not.
     */
    LoginModel.prototype.processLoginResult = function (success, appUserKey, username) {
        // Check to see if we got back a response that says the user is logged in.
        if (success) {
            this.appUserKey = appUserKey;
            this.username = username;
            // Set the sessionStorage global items in the client side cache for session info on client!
            // This basically tells the client that we are logged in.
            sessionStorage.setItem('appUserKey', '' + this.appUserKey);
            sessionStorage.setItem('username', this.username);
        }
        // If we reach here, then the response indicated that the user did not login successfully.
        this.loginError = !success;
    };
    return LoginModel;
}());

//# sourceMappingURL=C:/Users/User Name/ConnectFood/client/dist/app/authentication/login-model.js.map

/***/ }),

/***/ "../../../../../client/src/app/authentication/login.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ":host {\r\n\t-webkit-box-flex: 1;\r\n\t    -ms-flex-positive: 1;\r\n\t        flex-grow: 1;\r\n\tdisplay: -webkit-box;\r\n\tdisplay: -ms-flexbox;\r\n\tdisplay: flex;\r\n\t-webkit-box-pack: center;\r\n\t    -ms-flex-pack: center;\r\n\t        justify-content: center;\r\n\t-webkit-box-align: center;\r\n\t    -ms-flex-align: center;\r\n\t        align-items: center;\r\n}\r\n\r\ndiv.input {\r\n\tposition: relative;\r\n}\r\n\r\ndiv.input label {\r\n\tposition: absolute;\r\n\ttop: 0;\r\n\t-webkit-transform: translateY(-50%);\r\n\t        transform: translateY(-50%);\r\n\tleft: 10px;\r\n\tbackground: white;\r\n\tpadding: 5px 2px;\r\n}\r\n\r\ndiv.input input {\r\n\tpadding: 10px 20px;\r\n\tfont-size: 25px;\r\n\toutline: 0;\r\n}\r\n\r\ndiv.input {\r\n\tmargin-top: 20px;\r\n}\r\n\r\n.close {\r\n\tdisplay: block;\r\n\theight: 25px;\r\n\twidth: 25px;\r\n\tborder-radius: 50%;\r\n\tbackground-color: red;\r\n\tborder: 1px solid red;\r\n}\r\n\r\n#loginErr {\r\n\ttext-align: center;\r\n\tcolor: red;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../client/src/app/authentication/login.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-dialog\">\n\t<div class=\"modal-content\">\n\t\t<div class=\"modal-header\">\n\t\t\t<h1 class=\"modal-title\">Sign In</h1>\n\t\t\t<button type=\"button\" class=\"close\" (click)=\"close()\" >&times;</button>\n\t\t</div>\n\t\t<div class=\"modal-body\">\n\t\t\t<form ngNativeValidate (submit)=\"loginUser($event)\">\n\t\t\t\t<div class=\"input\">\n\t\t\t\t\t<label>Username</label>\n\t\t\t\t\t<input name=\"Username\" [(ngModel)]=\"loginModel.username\" type=\"text\" required autofocus>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"input\">\n\t\t\t\t\t<label>Password</label>\n\t\t\t\t\t<input name=\"Password\" [(ngModel)]=\"loginModel.password\" type=\"password\" required>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"input\">\n\t\t\t\t\t<input type=\"submit\" value=\"Login\">\n\t\t\t\t</div>\n\t\t\t</form>\n\t\t</div>\n\t\t<div class=\"modal-footer\">\n\t\t\t<p *ngIf=\"loginModel.loginError\" id=\"loginErr\">Incorrect login information. Please Try Again.</p>\n\t\t</div>\n\t</div>\n</div>\n"

/***/ }),

/***/ "../../../../../client/src/app/authentication/login.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap_modal__ = __webpack_require__("../../../../ng2-bootstrap-modal/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap_modal___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap_modal__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__login_service__ = __webpack_require__("../../../../../client/src/app/authentication/login.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__login_model__ = __webpack_require__("../../../../../client/src/app/authentication/login-model.ts");
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
    LoginComponent.prototype.loginUser = function (event) {
        var _this = this;
        event.preventDefault();
        var observer = this.authenticationService.login(this.loginModel);
        // This is the promise we get
        observer.subscribe(function (data) {
            // Fill our model with the JSON result and see if Login is a success.
            _this.loginModel.processLoginResult(data.success, data.appUserKey, data.username);
            if (data.success)
                _this.close();
        }, function (error) {
            console.log(error);
            // Shouldn't happen!
        });
        // TODO: We should put some loading symbol in login popup here!!!
    };
    LoginComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-login',
            template: __webpack_require__("../../../../../client/src/app/authentication/login.component.html"),
            styles: [__webpack_require__("../../../../../client/src/app/authentication/login.component.css")],
            providers: [__WEBPACK_IMPORTED_MODULE_2__login_service__["a" /* LoginService */]]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap_modal__["DialogService"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap_modal__["DialogService"]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__login_service__["a" /* LoginService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__login_service__["a" /* LoginService */]) === "function" && _b || Object])
    ], LoginComponent);
    return LoginComponent;
    var _a, _b;
}(__WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap_modal__["DialogComponent"]));

//# sourceMappingURL=C:/Users/User Name/ConnectFood/client/dist/app/authentication/login.component.js.map

/***/ }),

/***/ "../../../../../client/src/app/authentication/login.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/@angular/http.es5.js");
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
    function LoginService(http) {
        this.http = http;
    }
    LoginService.prototype.login = function (loginModel) {
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Headers */]({
            'Content-Type': 'application/json'
        });
        var observer = this.http.post('/authentication/login', JSON.stringify(loginModel), { headers: headers });
        return observer.map(function (response) { return response.json(); });
    };
    LoginService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */]) === "function" && _a || Object])
    ], LoginService);
    return LoginService;
    var _a;
}());

//# sourceMappingURL=C:/Users/User Name/ConnectFood/client/dist/app/authentication/login.service.js.map

/***/ }),

/***/ "../../../../../client/src/app/authentication/logout.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LogoutService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/@angular/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
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
    function LogoutService(http, router) {
        this.http = http;
        this.router = router;
    }
    LogoutService.prototype.logout = function () {
        sessionStorage.clear();
        this.http.get('/authentication/logout');
        this.router.navigate(['/home']);
        // Not interested in the response...
    };
    LogoutService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* Router */]) === "function" && _b || Object])
    ], LogoutService);
    return LogoutService;
    var _a, _b;
}());

//# sourceMappingURL=C:/Users/User Name/ConnectFood/client/dist/app/authentication/logout.service.js.map

/***/ }),

/***/ "../../../../../client/src/app/authentication/signup-model.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SignupModel; });
/**
 * Contains state data for the Signup Component.
 */
var SignupModel = (function () {
    //stateList = ['CA', 'NY', 'IN'];
    function SignupModel() {
        this.stateList = ['CA', 'NY', 'IN'];
    }
    /**
     * Processes the result of a signup (from the server).
     * @param success The flag that determines if the server successfully processed the signup.
     * @param message The message form the server pertaining to the result (an error message if success is false).
     * @param appUserKey The app user key for the new signed up user. Will be null if the signup failed.
     */
    SignupModel.prototype.processSignupResult = function (success, message, appUserKey) {
        if (success) {
            this.signupError = null; // Be sure to clear any existing error message.
            this.appUserKey = appUserKey;
            sessionStorage.setItem('appUserKey', '' + this.appUserKey);
            sessionStorage.setItem('username', this.username);
        }
        else {
            this.signupError = message;
        }
    };
    return SignupModel;
}());

//# sourceMappingURL=C:/Users/User Name/ConnectFood/client/dist/app/authentication/signup-model.js.map

/***/ }),

/***/ "../../../../../client/src/app/authentication/signup.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".layout{\r\n    display: table;\r\n    border: 1px solid gray;\r\n    border-radius: 25px;\r\n    width: 385px;\r\n    margin: auto;\r\n    margin-top: 50px;\r\n    padding: 2px;\r\n\r\n}\r\n\r\n.checkOptions{\r\n    text-align: left;\r\n}\r\n\r\n\r\n\r\n.rowLayout{\r\n    display: table-row;\r\n    padding: 2px; \r\n}\r\n\r\n.tableCell{\r\n    display: table-cell;\r\n    \r\n}\r\n\r\nh2{\r\n    text-align: center;\r\n\r\n}\r\n\r\ninput {\r\n    display: block;\r\n    margin: 0 auto;\r\n    width: 200px;\r\n}\r\n\r\nform{\r\n    text-align: center;\r\n}\r\n\r\n#signupErr {\r\n\ttext-align: center;\r\n\tcolor: red;\r\n}\r\n\r\n.checkbox{\r\n\r\n}\r\n\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../client/src/app/authentication/signup.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"layout\">\r\n<br/>\r\n  <h2>Create your account</h2>\r\n  <hr/>\r\n  <form ngNativeValidate (submit)=\"signupUser($event)\" (select)=\"showStates($array)\" >\r\n  <br/>\r\n    \r\n  <!--<input type=\"checkbox\">Sign up as a Donor \r\n  <input type=\"checkbox\">Sign up as a Receiver <br/>-->\r\n    \r\n      <br/>\r\n      Enter Your First Name:<br/>\r\n      <input type=\"text\" name=\"firstName\" [(ngModel)]=\"signupModel.firstName\" required autofocus autocomplete=\"on\"> \r\n      <br/>\r\n\r\n      Enter your Last Name:<br/> \r\n      <input type=\"text\" name=\"lastName\" [(ngModel)]=\"signupModel.lastName\" required autocomplete=\"on\">\r\n      <br/>\r\n\r\n      Enter your email address:<br/>\r\n      <input type=\"email\" name=\"email\" [(ngModel)]=\"signupModel.email\" required autocomplete=\"on\">\r\n      <br/>\r\n\r\n      <!--Enter your address:<br/>\r\n      <input type=\"text\" name=\"address\" [(ngModel)]=\"signupModel.address\" required >\r\n      <br/>\r\n\r\n      Enter your city:<br/>\r\n      <input type=\"text\" name=\"city\" [(ngModel)]=\"signupModel.city\" required>\r\n      <br/>\r\n\r\n      Enter your state:<br/>\r\n      <select >\r\n      <option *ngFor=\"let state of signupModel.stateList\" [value]=\"state\">{{state}} </option>\r\n      </select>\r\n      <br/>\r\n      <br/>\r\n     \r\n      Enter your ZIP Code:<br/>\r\n      <input type=\"text\" name=\"zip\" maxlength=\"5\" [(ngModel)]=\"signupModel.zip\" required >\r\n      <br/>\r\n\r\n      Enter your phone number:<br/>\r\n      <input type=\"text\" name=\"phone\" [(ngModel)]=\"signupModel.phone\" minlength=\"10\" maxlength=\"10\" required> \r\n      <br/>-->\r\n\r\n\r\n      Create a username:<br/> \r\n      <input type=\"text\" name=\"username\" [(ngModel)]=\"signupModel.username\" required autocomplete=\"on\">\r\n      <br/>\r\n\r\n      Create a password:<br/> \r\n      <input type=\"password\" name=\"password\" [(ngModel)]=\"signupModel.password\" required>\r\n      <br/>\r\n\r\n\r\n\r\n      <button type=\"submit\">Sign Up</button>\r\n      <br/>\r\n\r\n\r\n  </form>\r\n\r\n  <div *ngIf=\"signupModel.signupError != null\" id=\"signupErr\">{{signupModel.signupError}}</div>\r\n\r\n</div>\r\n\r\n"

/***/ }),

/***/ "../../../../../client/src/app/authentication/signup.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SignupComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__signup_model__ = __webpack_require__("../../../../../client/src/app/authentication/signup-model.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__signup_service__ = __webpack_require__("../../../../../client/src/app/authentication/signup.service.ts");
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
    function SignupComponent(signupService, router) {
        this.signupService = signupService;
        this.router = router;
        this.signupModel = new __WEBPACK_IMPORTED_MODULE_2__signup_model__["a" /* SignupModel */]();
    }
    SignupComponent.prototype.ngOnInit = function () {
    };
    SignupComponent.prototype.signupUser = function (event) {
        var _this = this;
        event.preventDefault();
        var observer = this.signupService.signup(this.signupModel);
        // This is the promise we get
        observer.subscribe(function (data) {
            // Fill our model with the JSON result and see if Login is a success.
            console.log(data.message);
            // Will set global local storage internally if success.
            _this.signupModel.processSignupResult(data.success, data.message, data.appUserKey);
            if (data.success) {
                _this.router.navigate(['/home']);
            }
        }, function (error) {
            console.log(error);
            // Shouldn't happen!
        });
    };
    SignupComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Component"])({
            selector: 'app-signup',
            template: __webpack_require__("../../../../../client/src/app/authentication/signup.component.html"),
            styles: [__webpack_require__("../../../../../client/src/app/authentication/signup.component.css")],
            providers: [__WEBPACK_IMPORTED_MODULE_3__signup_service__["a" /* SignupService */]]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_3__signup_service__["a" /* SignupService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__signup_service__["a" /* SignupService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_router__["a" /* Router */]) === "function" && _b || Object])
    ], SignupComponent);
    return SignupComponent;
    var _a, _b;
}());

//# sourceMappingURL=C:/Users/User Name/ConnectFood/client/dist/app/authentication/signup.component.js.map

/***/ }),

/***/ "../../../../../client/src/app/authentication/signup.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SignupService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/@angular/http.es5.js");
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
    function SignupService(http) {
        this.http = http;
    }
    SignupService.prototype.signup = function (signupModel) {
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Headers */]({
            'Content-Type': 'application/json'
        });
        var observer = this.http.post('/authentication/signup', JSON.stringify(signupModel), { headers: headers });
        return observer.map(function (response) {
            return response.json();
        });
    };
    SignupService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */]) === "function" && _a || Object])
    ], SignupService);
    return SignupService;
    var _a;
}());

//# sourceMappingURL=C:/Users/User Name/ConnectFood/client/dist/app/authentication/signup.service.js.map

/***/ }),

/***/ "../../../../../client/src/app/donor/donor-primary.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DonorPrimaryService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/@angular/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shared_date_formatter_pipe__ = __webpack_require__("../../../../../client/src/app/shared/date-formatter.pipe.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var DonorPrimaryService = (function () {
    function DonorPrimaryService(http, dateFormatter) {
        this.http = http;
        this.dateFormatter = dateFormatter;
    }
    DonorPrimaryService.prototype.addFoodListing = function (foodListing, image) {
        foodListing.image = image;
        foodListing.perishable;
        // This is uniform with object on Server. In future, will make a shared directory where these class definitions can uniformly reside!
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Headers */]({
            'Content-Type': 'application/json'
        });
        var observer = this.http.post('/donor/addFoodListing', JSON.stringify(foodListing), { headers: headers, withCredentials: true });
        return observer.map(function (response) {
            console.log(response);
            return response.json().success;
        });
    };
    DonorPrimaryService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__shared_date_formatter_pipe__["a" /* DateFormatterPipe */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__shared_date_formatter_pipe__["a" /* DateFormatterPipe */]) === "function" && _b || Object])
    ], DonorPrimaryService);
    return DonorPrimaryService;
    var _a, _b;
}());

//# sourceMappingURL=C:/Users/User Name/ConnectFood/client/dist/app/donor/donor-primary.service.js.map

/***/ }),

/***/ "../../../../../client/src/app/donor/donor.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "label {\r\n    font-weight: bold;\r\n    font-size: 25px;\r\n}\r\n\r\ninput[type=checkbox]\r\n{\r\n  /* Double-sized Checkboxes */\r\n  -ms-transform: scale(2); /* IE */\r\n  -moz-transform: scale(2); /* FF */\r\n  -webkit-transform: scale(2); /* Safari and Chrome */\r\n  -o-transform: scale(2); /* Opera */\r\n  padding: 10px;\r\n  margin-left: 10px;\r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../client/src/app/donor/donor.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"container\">\n    <h1>Donor Form</h1>\n    <hr>\n    <div *ngIf=\"!submitted\" class=\"row\">\n        <div class=\"col-md-5\">\n            <label>Upload Image</label>\n            <img-cropper [image]=\"this\" [settings]=\"cropperSettings\"></img-cropper>\n        </div>\n        <div class=\"col-md-7\">\n            <form [formGroup]=\"foodForm\" (ngSubmit)=\"onSubmit(foodForm)\">\n                <div class=\"form-group\">\n                    <label for=\"foodType\">Food Type</label>\n                    <select class=\"form-control\" formControlName=\"foodType\">\n                        <option *ngFor=\"let foodT of foodTypeOptions\" [value]=\"foodT\">{{foodT}}</option>\n                    </select>\n                    <div class=\"alert alert-danger\" [hidden]=\"!shouldFireRequireValidation(foodForm.controls.foodType)\">Food Type is required</div>\n                </div>\n                <div class=\"form-group\">\n                    <label for=\"perishable\">Perishable</label>\n                    <input type=\"checkbox\" formControlName=\"perishable\">\n                </div>\n                <div class=\"form-group\">\n                    <label for=\"foodDescription\">Description</label>\n                    <textarea class=\"form-control\" formControlName=\"foodDescription\"></textarea>\n                    <div class=\"alert alert-danger\" [hidden]=\"!shouldFireRequireValidation(foodForm.controls.foodDescription)\">Description is required</div>\n                </div>\n                <div class=\"form-group\">\n                    <div class=\"input-group\">\n                        <input class=\"form-control\" placeholder=\"yyyy-mm-dd\" formControlName=\"expirationDate\" ngbDatepicker #d=\"ngbDatepicker\">\n                        <div class=\"input-group-addon\" (click)=\"d.toggle()\" >\n                            <img src=\"img/calendar-icon.svg\" style=\"width: 1.2rem; height: 1rem; cursor: pointer;\"/>\n                        </div>\n                    </div>\n                    <div class=\"alert alert-danger\" [hidden]=\"!shouldFireRequireValidation(foodForm.controls.expirationDate)\">Expiration Date is required</div>\n                </div>\n\n                <button type=\"submit\" class=\"btn btn-default\">Submit</button>\n            </form>\n        </div>\n    </div>\n\n    <div *ngIf=\"submitted\">\n        <h2>Thank-you for submitting the following:</h2>\n        <div class=\"row\">\n            <div class=\"col-md-2\">Food Type</div>\n            <div class=\"col-md-10 pull-left\">{{ foodForm.controls.foodType.value }}</div>\n        </div>\n        <div class=\"row\">\n            <div class=\"col-md-2\">Description</div>\n            <div class=\"col-md-10 pull-left\">{{ foodForm.controls.foodDescription.value }}</div>\n        </div>\n        <div class=\"row\">\n            <div class=\"col-md-2\">Perishabe</div>\n            <div class=\"col-md-10 pull-left\">{{ (foodForm.controls.perishable.value == true) ? 'true' : 'false' }}</div>\n        </div>\n        <div class=\"row\">\n            <div class=\"col-md-2\">Expiration Date</div>\n            <div class=\"col-md-10 pull-left\">{{ foodForm.controls.expirationDate.value | dateFormatter }}</div>\n        </div>\n        <br />\n        <button class=\"btn btn-default\" (click)=\"submitted=false\">Donate Again</button>\n    </div>\n</div>"

/***/ }),

/***/ "../../../../../client/src/app/donor/donor.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DonorComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__("../../../forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ng2_img_cropper__ = __webpack_require__("../../../../ng2-img-cropper/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__donor_primary_service__ = __webpack_require__("../../../../../client/src/app/donor/donor-primary.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__shared_date_formatter_pipe__ = __webpack_require__("../../../../../client/src/app/shared/date-formatter.pipe.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var DonorComponent = (function () {
    function DonorComponent(formBuilder, donorPrimaryService, element, dateFormatter) {
        this.formBuilder = formBuilder;
        this.donorPrimaryService = donorPrimaryService;
        this.element = element;
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
        this.perishableOptions = ['Perishable', 'Not Perishable'];
        this.foodTypeOptions = ['Grain', 'Meat', 'Fruit', 'Vegetable', 'Drink'];
    }
    DonorComponent.prototype.ngOnInit = function () {
        this.foodForm = this.formBuilder.group({
            foodType: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].required],
            perishable: [''],
            foodDescription: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].required],
            expirationDate: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* Validators */].required]
        });
    };
    DonorComponent.prototype.shouldFireRequireValidation = function (validField) {
        return validField.errors != null && validField.errors.required && (validField.touched || this.forceValidation);
    };
    DonorComponent.prototype.onSubmit = function (_a) {
        var _this = this;
        var value = _a.value, valid = _a.valid;
        this.forceValidation = true;
        // Checkbox when unchecked resolves to empty string, so explicitely set it to false if not given the value of true from the form!
        if (value.perishable != true) {
            value.perishable = false;
        }
        if (valid) {
            var observer = this.donorPrimaryService.addFoodListing(value, this.image);
            observer.subscribe(function (success) {
                _this.submitted = true;
            }, function (error) {
                console.log(error);
                // Shouldn't happen!
            });
        }
    };
    DonorComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'donor',
            template: __webpack_require__("../../../../../client/src/app/donor/donor.component.html"),
            providers: [__WEBPACK_IMPORTED_MODULE_3__donor_primary_service__["a" /* DonorPrimaryService */]],
            styles: [__webpack_require__("../../../../../client/src/app/donor/donor.component.css")]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_forms__["a" /* FormBuilder */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_forms__["a" /* FormBuilder */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__donor_primary_service__["a" /* DonorPrimaryService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__donor_primary_service__["a" /* DonorPrimaryService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__shared_date_formatter_pipe__["a" /* DateFormatterPipe */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__shared_date_formatter_pipe__["a" /* DateFormatterPipe */]) === "function" && _d || Object])
    ], DonorComponent);
    return DonorComponent;
    var _a, _b, _c, _d;
}());

//# sourceMappingURL=C:/Users/User Name/ConnectFood/client/dist/app/donor/donor.component.js.map

/***/ }),

/***/ "../../../../../client/src/app/footer/footer.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "footer {\r\n    margin-top: 200px;\r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../client/src/app/footer/footer.component.html":
/***/ (function(module, exports) {

module.exports = "<footer>\r\n  Copyright &copy; Food Web\r\n</footer>"

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

//# sourceMappingURL=C:/Users/User Name/ConnectFood/client/dist/app/footer/footer.component.js.map

/***/ }),

/***/ "../../../../../client/src/app/header/header.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".nav-link:hover {\r\n\tcolor: yellow;\r\n    cursor: pointer;\r\n\tcursor: hand;\r\n}\r\n\r\nul.nav a:hover { color: yellow !important; }\r\n\r\nheader {\r\n\ttext-align: center;\r\n\tfont-size: 30px;\r\n\theight: 680px;\r\n\tposition: relative;\r\n}\r\n\r\n#logo {\r\n\theight: 100px;\r\n\tposition: absolute;\r\n\tleft: 0px;\r\n\ttop: 0px;\r\n\twidth: 175px;\r\n\tpadding: 0;\r\n\tmargin: 0;\r\n}\r\n\r\nnav {\r\n\tmax-height: 65px;\r\n\tmargin-left: 175px;\r\n}\r\n\r\nli {\r\n\tpadding-left: 5px;\r\n\tpadding-right: 5px;\r\n}\r\n\r\n#banner {\r\n\twidth: 100%;\r\n\theight: 600px;\r\n}\r\n\r\n@media screen and (max-width: 767px) {\r\n\tnav {\r\n\t\tmax-height: 100%;\r\n\t\tmin-height: 65px;\r\n\t\tmargin-left: 0px;\r\n\t}\r\n\r\n\theader {\r\n\t\theight: auto;\r\n\t}\r\n\r\n\t#logo {\r\n\t\tvisibility: hidden;\r\n\t}\r\n\r\n\t#banner {\r\n\t\tvisibility: hidden;\r\n\t\tposition: absolute;\r\n\t}\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../client/src/app/header/header.component.html":
/***/ (function(module, exports) {

module.exports = "<header>\r\n    <img id=\"logo\" class=\"navbar-brand\" src=\"./assets/HeaderImg.jpg\" [routerLink]=\"['/home']\">\r\n\r\n    <nav class=\"navbar navbar-toggleable-sm navbar-inverse bg-inverse\">\r\n        <button type=\"button\" class=\"navbar-toggler navbar-toggler-right\" (click)=\"isExpanded = !isExpanded\" [attr.aria-expanded]=\"!isExpanded\" aria-controls=\"navbarContent\">\r\n            <span class=\"navbar-toggler-icon\"></span>\r\n        </button>\r\n\r\n        <div class=\"collapse navbar-collapse\" id=\"navbarContent\" [ngbCollapse]=\"!isExpanded\">\r\n            <ul class=\"navbar-nav mr-auto\">\r\n                <li class=\"nav-item\"><a class='nav-link' [routerLink]=\"['/home']\">Home</a></li>\r\n                <li class=\"nav-item\"><a class='nav-link' [routerLink]=\"['/donor']\">Donor</a></li>\r\n                <li class=\"nav-item\"><a class='nav-link' [routerLink]=\"['/receiver']\">Receiver</a></li>\r\n            </ul>\r\n            <ul class=\"navbar-nav navbar-right\">\r\n                <li *ngIf=\"sessionStorage.getItem('appUserKey') === null\" class=\"nav-item\"><a id='loginButton' class='nav-link' (click)=\"showLogin()\">Login</a></li>\r\n                <li *ngIf=\"sessionStorage.getItem('appUserKey') === null\" class=\"nav-item\"><a id='signupButton' class='nav-link' [routerLink]=\"['/signup']\">Sign Up</a></li>\r\n                <li *ngIf=\"sessionStorage.getItem('appUserKey') !== null\" class=\"nav-item\"><a class='nav-link'>{{sessionStorage.getItem('username')}}</a></li>\r\n                <li *ngIf=\"sessionStorage.getItem('appUserKey') !== null\" class=\"nav-item\"><a id='logoutButton' class='nav-link' (click)=\"logout()\">Logout</a></li>\r\n            </ul>\r\n        </div>\r\n    </nav>\r\n\r\n    <img id=\"banner\" src=\"./assets/BannerImg.jpg\">\r\n</header>"

/***/ }),

/***/ "../../../../../client/src/app/header/header.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HeaderComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap_modal__ = __webpack_require__("../../../../ng2-bootstrap-modal/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap_modal___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap_modal__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__authentication_login_component__ = __webpack_require__("../../../../../client/src/app/authentication/login.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__authentication_logout_service__ = __webpack_require__("../../../../../client/src/app/authentication/logout.service.ts");
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
    function HeaderComponent(dialogService, logoutService) {
        this.dialogService = dialogService;
        this.logoutService = logoutService;
        this.sessionStorage = sessionStorage;
    }
    HeaderComponent.prototype.ngOnInit = function () {
    };
    HeaderComponent.prototype.showLogin = function () {
        var dialogObserver = this.dialogService.addDialog(__WEBPACK_IMPORTED_MODULE_2__authentication_login_component__["a" /* LoginComponent */], 
        // Dialog Initalization Data
        null, 
        // DialogOptions
        {
            closeByClickingOutside: true,
            backdropColor: '#222222',
        });
        // Observe what the dialog result is.
        dialogObserver.subscribe(function (isConfirmed) {
            // TODO: Replace the Login link with username link.
        });
    };
    HeaderComponent.prototype.logout = function () {
        this.logoutService.logout();
    };
    HeaderComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-header',
            template: __webpack_require__("../../../../../client/src/app/header/header.component.html"),
            styles: [__webpack_require__("../../../../../client/src/app/header/header.component.css")],
            providers: [__WEBPACK_IMPORTED_MODULE_3__authentication_logout_service__["a" /* LogoutService */]]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap_modal__["DialogService"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap_modal__["DialogService"]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__authentication_logout_service__["a" /* LogoutService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__authentication_logout_service__["a" /* LogoutService */]) === "function" && _b || Object])
    ], HeaderComponent);
    return HeaderComponent;
    var _a, _b;
}());

//# sourceMappingURL=C:/Users/User Name/ConnectFood/client/dist/app/header/header.component.js.map

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

module.exports = "<p>\n    \n</p>\n"

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

//# sourceMappingURL=C:/Users/User Name/ConnectFood/client/dist/app/home/home.component.js.map

/***/ }),

/***/ "../../../../../client/src/app/receiver-cart/receiver-cart.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../client/src/app/receiver-cart/receiver-cart.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid\">\n  <div class=\"row\">\n    <div class=\"col-md-4\">\n      <h2>Filters</h2>\n      <hr>\n      <form [formGroup]=\"filterForm\">\n      <h4>Food Types:</h4>\n        <div class=\"btn-group\" data-toggle=\"buttons\">\n          <label class=\"btn btn-primary\" [class.active]=\"filterForm.value.grain\">\n            <input type=\"checkbox\" formControlName=\"grain\">Grain\n          </label>\n          <label class=\"btn btn-primary\" [class.active]=\"filterForm.value.meat\">\n            <input type=\"checkbox\" formControlName=\"meat\">Meat\n          </label>\n          <label class=\"btn btn-primary\" [class.active]=\"filterForm.value.fruit\">\n            <input type=\"checkbox\" formControlName=\"fruit\">Fruit\n          </label>\n          <label class=\"btn btn-primary\" [class.active]=\"filterForm.value.vegetable\">\n            <input type=\"checkbox\" formControlName=\"vegetable\">Vegetable\n          </label>\n          <label class=\"btn btn-primary\" [class.active]=\"filterForm.value.drink\">\n            <input type=\"checkbox\" formControlName=\"drink\">Drink\n          </label>\n        </div>\n        <h4>Minimum Expiration:</h4>\n        <div ngbRadioGroup name=\"radioBasic\" formControlName=\"minExpireAfterDays\">\n          <label class=\"btn btn-primary\">\n            <input type=\"radio\" [value]=\"0\">{{tFrameVals[0]}}\n          </label>\n          <label class=\"btn btn-primary\">\n            <input type=\"radio\" [value]=\"1\">{{tFrameVals[1]}}\n          </label>\n          <label class=\"btn btn-primary\">\n            <input type=\"radio\" [value]=\"2\">{{tFrameVals[2]}}\n          </label>\n        </div>\n        <h4>Acceptable Perishability:</h4>\n        <div class=\"btn-group\" data-toggle=\"buttons\">\n          <label class=\"btn btn-primary\" [class.active]=\"filterForm.value.perishable\">\n            <input type=\"checkbox\" formControlName=\"perishable\">Perishable\n          </label>\n          <label class=\"btn btn-primary\" [class.active]=\"filterForm.value.notPerishable\">\n            <input type=\"checkbox\" formControlName=\"notPerishable\">Not Perishable\n          </label>\n        </div>\n        <hr>\n      </form>\n    </div>\n    <div class=\"col-md-8\">\n      <ng-template #content let-c=\"close\" let-d=\"dismss\">\n        <div class=\"modal-header\">\n          <h4 class=\"modal-title\">{{selectedModel.name}}</h4>\n          <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"c('Cross click')\">\n            <span aria-hidden=\"true\">&times;</span>\n          </button>\n        </div>\n        <div class=\"modal-body\">\n          <p>{{selectedModel.foodDescription}}</p>\n        </div>\n          <div class=\"modal-footer\">\n          <button type=\"button\" class=\"btn btn-secondary\" (click)=\"c('Request click')\">Request</button>\n          <button type=\"button\" class=\"btn btn-secondary\" (click)=\"c('Close click')\">Close</button>\n        </div>\n      </ng-template>\n\n      <h2>Listings</h2>\n      <hr>\n      <div class=\"list-group\" style=\"overflow-y:auto\">\n        <a *ngFor=\"let model of models\" class=\"list-group-item\">\n          <img [src]=\"model.imgUrl\" alt=\"No Picture\" class=\"img-thumbnail\" style=\"width:7vw;height:7vw\">\n          <div>\n            <h4 style=\"margin-left:1vw\">{{model.name}}\n              <button style=\"float:right\" class=\"btn btn-primary btn-sm\" (click)=\"selectItem(content, model)\">\n                Details\n              </button>\n            </h4>\n            <hr>\n            <p style=\"margin-left:1vw\">\n              From {{model.donorOrganizationName}}, at {{model.donorOrganizationAddress}} {{model.donorDistance}} miles away. <br>\n              Present food types: {{model.foodTypeDescription}}. Expires: {{model.expirationDate}}. Requires a {{model.quantityClass}}.\n            </p>\n          </div>\n        </a>\n      </div>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "../../../../../client/src/app/receiver-cart/receiver-cart.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ReceiverCartComponent; });
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

var ReceiverCartComponent = (function () {
    function ReceiverCartComponent() {
    }
    ReceiverCartComponent.prototype.ngOnInit = function () {
    };
    ReceiverCartComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-receiver-cart',
            template: __webpack_require__("../../../../../client/src/app/receiver-cart/receiver-cart.component.html"),
            styles: [__webpack_require__("../../../../../client/src/app/receiver-cart/receiver-cart.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], ReceiverCartComponent);
    return ReceiverCartComponent;
}());

//# sourceMappingURL=C:/Users/User Name/ConnectFood/client/dist/app/receiver-cart/receiver-cart.component.js.map

/***/ }),

/***/ "../../../../../client/src/app/receiver/receiver-primary.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ReceiverPrimaryService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/@angular/http.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var MODELS = [
    { name: "Beef Stew",
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
        imgUrl: "https://i5.walmartimages.com/asr/4026d667-1824-48e3-acab-c46642521070_1.a0a61552b58949ce15a4990a2e02b050.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF" }
];
var ReceiverPrimaryService = (function () {
    function ReceiverPrimaryService(http) {
        this.http = http;
    }
    ReceiverPrimaryService.prototype.updateFeed = function (filterObj) {
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Headers */]({
            'Content-Type': 'application/json'
        });
        var observer = this.http.post('/receiver/getFoodListings', JSON.stringify(filterObj), { headers: headers, withCredentials: true });
        return observer.map(function (response) {
            console.log(response.json());
            return response.json();
        });
    };
    ReceiverPrimaryService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */]) === "function" && _a || Object])
    ], ReceiverPrimaryService);
    return ReceiverPrimaryService;
    var _a;
}());

//# sourceMappingURL=C:/Users/User Name/ConnectFood/client/dist/app/receiver/receiver-primary.service.js.map

/***/ }),

/***/ "../../../../../client/src/app/receiver/receiver.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "@media only screen and (min-width: 760px) {\r\n    \r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../client/src/app/receiver/receiver.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid\">\r\n  <div class=\"row\">\r\n    <div class=\"col-md-4\">\r\n      <div class=\"fixed\">\r\n        <h2>Filters</h2>\r\n        <hr>\r\n        <form [formGroup]=\"filterForm\">\r\n        <h4>Acceptable Food Types:</h4>\r\n          <div class=\"btn-group\" data-toggle=\"buttons\">\r\n            <label class=\"btn btn-primary\" [class.active]=\"filterForm.value.grain\">\r\n              <input type=\"checkbox\" formControlName=\"grain\">Grain\r\n            </label>\r\n            <label class=\"btn btn-primary\" [class.active]=\"filterForm.value.meat\">\r\n              <input type=\"checkbox\" formControlName=\"meat\">Meat\r\n            </label>\r\n            <label class=\"btn btn-primary\" [class.active]=\"filterForm.value.fruit\">\r\n              <input type=\"checkbox\" formControlName=\"fruit\">Fruit\r\n            </label>\r\n            <label class=\"btn btn-primary\" [class.active]=\"filterForm.value.vegetable\">\r\n              <input type=\"checkbox\" formControlName=\"vegetable\">Vegetable\r\n            </label>\r\n            <label class=\"btn btn-primary\" [class.active]=\"filterForm.value.drink\">\r\n              <input type=\"checkbox\" formControlName=\"drink\">Drink\r\n            </label>\r\n          </div>\r\n          <h4>Minimum Expiration:</h4>\r\n          <ngb-datepicker #dp [(ngModel)]=\"filterForm.value.minExpireAfterDays\" (navigate)=\"date = $event.next\"></ngb-datepicker>\r\n          <!--<div ngbRadioGroup name=\"radioBasic\" formControlName=\"minExpireAfterDays\">\r\n            <label class=\"btn btn-primary\">\r\n              <input type=\"radio\" [value]=\"0\">{{tFrameVals[0]}}\r\n            </label>\r\n            <label class=\"btn btn-primary\">\r\n              <input type=\"radio\" [value]=\"1\">{{tFrameVals[1]}}\r\n            </label>\r\n            <label class=\"btn btn-primary\">\r\n              <input type=\"radio\" [value]=\"2\">{{tFrameVals[2]}}\r\n            </label>\r\n          </div>\r\n          <h4>Maximum Distance:</h4>\r\n          <div ngbRadioGroup name=\"radioBasic\" formControlName=\"maxDistance\">\r\n            <label class=\"btn btn-primary\">\r\n              <input type=\"radio\" [value]=\"0\">{{distVals[0]}}\r\n            </label>\r\n            <label class=\"btn btn-primary\">\r\n              <input type=\"radio\" [value]=\"1\">{{distVals[1]}}\r\n            </label>\r\n            <label class=\"btn btn-primary\">\r\n              <input type=\"radio\" [value]=\"2\">{{distVals[2]}}\r\n            </label>\r\n          </div>\r\n          <h4>Must Fit in a:</h4>\r\n          <div ngbRadioGroup name=\"radioBasic\" formControlName=\"maxQuantity\">\r\n            <label class=\"btn btn-primary\">\r\n              <input type=\"radio\" [value]=\"0\">{{quantityVals[0]}}\r\n            </label>\r\n            <label class=\"btn btn-primary\">\r\n              <input type=\"radio\" [value]=\"1\">{{quantityVals[1]}}\r\n            </label>\r\n            <label class=\"btn btn-primary\">\r\n              <input type=\"radio\" [value]=\"2\">{{quantityVals[2]}}\r\n            </label>\r\n          </div>-->\r\n          <h4>Acceptable Perishability:</h4>\r\n          <div class=\"btn-group\" data-toggle=\"buttons\">\r\n            <label class=\"btn btn-primary\" [class.active]=\"filterForm.value.perishable\">\r\n              <input type=\"checkbox\" formControlName=\"perishable\">Perishable\r\n            </label>\r\n            <label class=\"btn btn-primary\" [class.active]=\"filterForm.value.notPerishable\">\r\n              <input type=\"checkbox\" formControlName=\"notPerishable\">Not Perishable\r\n            </label>\r\n          </div>\r\n          <hr>\r\n        </form>\r\n      </div>\r\n    </div>\r\n    <div class=\"col-md-8\">\r\n      <ng-template #content let-c=\"close\" let-d=\"dismss\">\r\n        <div class=\"modal-header\">\r\n          <h4 class=\"modal-title\">Food Description</h4>\r\n          <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"c('Cross click')\">\r\n            <span aria-hidden=\"true\">&times;</span>\r\n          </button>\r\n        </div>\r\n        <div class=\"modal-body\">\r\n          <p>{{selectedModel.foodDescription}}</p>\r\n        </div>\r\n          <div class=\"modal-footer\">\r\n          <button type=\"button\" class=\"btn btn-secondary\" (click)=\"c('Request click')\">Request</button>\r\n          <button type=\"button\" class=\"btn btn-secondary\" (click)=\"c('Close click')\">Close</button>\r\n        </div>\r\n      </ng-template>\r\n\r\n      <h2>Listings</h2>\r\n      <hr>\r\n      <div class=\"list-group\" style=\"overflow-y:auto\">\r\n        <a *ngFor=\"let model of models\" class=\"list-group-item\">\r\n          <img [src]=\"model.imgUrl\" alt=\"No Picture\" class=\"img-thumbnail\" style=\"width:7vw;height:7vw\">\r\n          <div>\r\n            <h4 style=\"margin-left:1vw\">{{model.name}}\r\n              <button style=\"float:right\" class=\"btn btn-primary btn-sm\" (click)=\"selectItem(content, model)\">\r\n                Details\r\n              </button>\r\n            </h4>\r\n            <hr>\r\n            <p style=\"margin-left:1vw\">\r\n              Posted By: <b>{{model.donorFirstName}} {{model.donorLastName}}</b><br>\r\n              Present food types: <b>{{model.foodTypeDescription}}</b> <br>\r\n              Expires: <b>{{model.expirationDate}}</b> <!--Requires a {{model.quantityClass}}-->\r\n            </p>\r\n          </div>\r\n        </a>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n"

/***/ }),

/***/ "../../../../../client/src/app/receiver/receiver.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ReceiverComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__("../../../forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__ = __webpack_require__("../../../../@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shared_filters__ = __webpack_require__("../../../../../client/src/app/receiver/shared/filters.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__receiver_primary_service__ = __webpack_require__("../../../../../client/src/app/receiver/receiver-primary.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var now = new Date();
var MODELS = [
    { name: "Beef Stew",
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
        imgUrl: "https://i5.walmartimages.com/asr/4026d667-1824-48e3-acab-c46642521070_1.a0a61552b58949ce15a4990a2e02b050.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF" }
];
var ReceiverComponent = (function () {
    function ReceiverComponent(formBuilder, receiverPrimaryService, modalService) {
        this.formBuilder = formBuilder;
        this.receiverPrimaryService = receiverPrimaryService;
        this.modalService = modalService;
    }
    ReceiverComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.filters = new __WEBPACK_IMPORTED_MODULE_3__shared_filters__["a" /* Filters */](true, true, true, true, true, true, false, { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() }, 0, 0);
        this.onChange(this.filters);
        this.quantityVals = ["Car", "Van", "Truck"];
        this.tFrameVals = ["0-6 Days", "6-12 Days", "12+ Days"];
        this.distVals = ["0-6 Miles", "6-12 Miles", "12+ Miles"];
        this.filterForm = this.formBuilder.group({
            grain: this.filters.grain,
            meat: this.filters.meat,
            vegetable: this.filters.vegetable,
            fruit: this.filters.fruit,
            drink: this.filters.drink,
            minExpireAfterDays: this.filters.minExpireAfterDays,
            maxQuantity: this.filters.maxQuantity,
            maxDistance: this.filters.maxDistance,
            perishable: this.filters.perishable,
            notPerishable: this.filters.notPerishable
        });
        this.filterForm.valueChanges.subscribe(function (data) {
            _this.onChange(_this.filterForm.value);
        });
    };
    ReceiverComponent.prototype.onChange = function (value) {
        var _this = this;
        //this.receiverPrimaryService.updateFeed(value).then(models => this.models = models);
        var observer = this.receiverPrimaryService.updateFeed(value);
        observer.subscribe(function (data) {
            //Apply Food model to data and store in this.models
            _this.models = data;
        });
        //this.models = MODELS;
    };
    ReceiverComponent.prototype.selectItem = function (content, value) {
        //For viewing specifics and taking a listing down from the server
        this.selectedModel = value;
        this.modalService.open(content).result.then(function (result) {
            if (result === "Request click") {
                //Send item request to back end
            }
        });
    };
    ReceiverComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-receiver',
            template: __webpack_require__("../../../../../client/src/app/receiver/receiver.component.html"),
            styles: [__webpack_require__("../../../../../client/src/app/receiver/receiver.component.css")],
            providers: [__WEBPACK_IMPORTED_MODULE_4__receiver_primary_service__["a" /* ReceiverPrimaryService */]]
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_forms__["a" /* FormBuilder */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_forms__["a" /* FormBuilder */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_4__receiver_primary_service__["a" /* ReceiverPrimaryService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__receiver_primary_service__["a" /* ReceiverPrimaryService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__["a" /* NgbModal */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__["a" /* NgbModal */]) === "function" && _c || Object])
    ], ReceiverComponent);
    return ReceiverComponent;
    var _a, _b, _c;
}());

//# sourceMappingURL=C:/Users/User Name/ConnectFood/client/dist/app/receiver/receiver.component.js.map

/***/ }),

/***/ "../../../../../client/src/app/receiver/shared/filters.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Filters; });
var Filters = (function () {
    function Filters(grain, meat, fruit, vegetable, drink, perishable, notPerishable, minExpireAfterDays, maxQuantity, maxDistance) {
        this.grain = grain;
        this.meat = meat;
        this.fruit = fruit;
        this.vegetable = vegetable;
        this.drink = drink;
        this.perishable = perishable;
        this.notPerishable = notPerishable;
        this.minExpireAfterDays = minExpireAfterDays;
        this.maxQuantity = maxQuantity;
        this.maxDistance = maxDistance;
    }
    return Filters;
}());

//# sourceMappingURL=C:/Users/User Name/ConnectFood/client/dist/app/receiver/shared/filters.js.map

/***/ }),

/***/ "../../../../../client/src/app/shared/date-formatter.pipe.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DateFormatterPipe; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
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
        return this.formatDate(value);
    };
    DateFormatterPipe.prototype.formatDate = function (value) {
        if (value != null) {
            return (value.year.toString() + '-' + value.month.toString() + '-' + value.day.toString());
        }
        return '';
    };
    DateFormatterPipe = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Pipe"])({
            name: 'dateFormatter'
        })
    ], DateFormatterPipe);
    return DateFormatterPipe;
}());

//# sourceMappingURL=C:/Users/User Name/ConnectFood/client/dist/app/shared/date-formatter.pipe.js.map

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
//# sourceMappingURL=C:/Users/User Name/ConnectFood/client/dist/environments/environment.js.map

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
//# sourceMappingURL=C:/Users/User Name/ConnectFood/client/dist/main.js.map

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("../../../../../client/src/main.ts");


/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map