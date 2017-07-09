webpackJsonp([1],{

/***/ "../../../../../client async recursive":
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = "../../../../../client async recursive";

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

module.exports = "<!--The whole content below can be removed with the new code.-->\r\n<div id=\"fullPage\">\r\n\t<app-header id='appHeader'></app-header>\r\n\r\n\t<router-outlet></router-outlet>\r\n\r\n\t<app-footer id='appFooter'></app-footer>\r\n</div>\r\n"

/***/ }),

/***/ "../../../../../client/src/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var AppComponent = (function () {
    function AppComponent() {
    }
    return AppComponent;
}());
AppComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-root',
        template: __webpack_require__("../../../../../client/src/app/app.component.html"),
        styles: [__webpack_require__("../../../../../client/src/app/app.component.css")]
    })
], AppComponent);

//# sourceMappingURL=C:/Users/Emery.Emery-PC/Documents/GitHub/ConnectFood/client/app/app.component.js.map

/***/ }),

/***/ "../../../../../client/src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
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
        component: __WEBPACK_IMPORTED_MODULE_8__home_home_component__["a" /* HomeComponent */]
    },
    {
        path: 'donor',
        component: __WEBPACK_IMPORTED_MODULE_12__donor_donor_component__["a" /* DonorComponent */]
    },
    {
        path: 'receiver',
        component: __WEBPACK_IMPORTED_MODULE_13__receiver_receiver_component__["a" /* ReceiverComponent */]
    }
];
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_7__app_component__["a" /* AppComponent */],
            __WEBPACK_IMPORTED_MODULE_8__home_home_component__["a" /* HomeComponent */],
            __WEBPACK_IMPORTED_MODULE_9__header_header_component__["a" /* HeaderComponent */],
            __WEBPACK_IMPORTED_MODULE_10__footer_footer_component__["a" /* FooterComponent */],
            __WEBPACK_IMPORTED_MODULE_11__authentication_login_component__["a" /* LoginComponent */],
            __WEBPACK_IMPORTED_MODULE_12__donor_donor_component__["a" /* DonorComponent */],
            __WEBPACK_IMPORTED_MODULE_13__receiver_receiver_component__["a" /* ReceiverComponent */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_3__ng_bootstrap_ng_bootstrap__["a" /* NgbModule */].forRoot(),
            __WEBPACK_IMPORTED_MODULE_5__angular_router__["a" /* RouterModule */].forRoot(appRoutes),
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_4_ng2_bootstrap_modal__["BootstrapModalModule"],
            __WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* HttpModule */],
            __WEBPACK_IMPORTED_MODULE_6__angular_forms__["a" /* FormsModule */],
            __WEBPACK_IMPORTED_MODULE_6__angular_forms__["b" /* ReactiveFormsModule */],
        ],
        entryComponents: [
            __WEBPACK_IMPORTED_MODULE_11__authentication_login_component__["a" /* LoginComponent */]
        ],
        providers: [],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_7__app_component__["a" /* AppComponent */]]
    })
], AppModule);

//# sourceMappingURL=C:/Users/Emery.Emery-PC/Documents/GitHub/ConnectFood/client/app/app.module.js.map

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
        localStorage.removeItem('appUserKey');
        localStorage.removeItem('username');
        this._loginError = false;
    }
    /**
     * Processes a JSON Login Result from the server.
     * -- INPUTS --
     * data: The JSON result from the server. Should be of the format { appUserKey, username }.
     * -- OUTPUT --
     * True if the login was successful, false if it was not.
     */
    LoginModel.prototype.processLoginResult = function (data) {
        this._appUserKey = null;
        this._username = null;
        // Check to see if we got back a response that says the user is logged in.
        if (data && data.username) {
            this._loginError = false;
            this._appUserKey = data.appUserKey;
            this._username = data.username;
            // Set the localStorage global items in the client side cache for session info on client!
            // This basically tells the client that we are logged in.
            localStorage.setItem('appUserKey', '' + this._appUserKey);
            localStorage.setItem('username', this._username);
            return true;
        }
        // If we reach here, then the response indicated that the user did not login successfully.
        this._loginError = true;
        return false;
    };
    Object.defineProperty(LoginModel.prototype, "loginError", {
        get: function () {
            return this._loginError;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginModel.prototype, "username", {
        get: function () {
            return this._username;
        },
        set: function (val) {
            this._username = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginModel.prototype, "password", {
        get: function () {
            return this._password;
        },
        set: function (val) {
            this._password = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginModel.prototype, "appUserKey", {
        get: function () {
            return this._appUserKey;
        },
        enumerable: true,
        configurable: true
    });
    return LoginModel;
}());

//# sourceMappingURL=C:/Users/Emery.Emery-PC/Documents/GitHub/ConnectFood/client/app/authentication/login-model.js.map

/***/ }),

/***/ "../../../../../client/src/app/authentication/login-service.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/@angular/http.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginService; });
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
    LoginService.prototype.login = function (username, password) {
        console.log('username: ' + username);
        console.log('password: ' + password);
        var observer = this.http.post('/authentication/login', JSON.stringify({ username: username, password: password }));
        return observer.map(function (response) {
            var user = response.json();
            if (user && user.username) {
                console.log('Got login response: ' + user.username);
            }
            return user;
        });
    };
    LoginService.prototype.logout = function () {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    };
    return LoginService;
}());
LoginService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */]) === "function" && _a || Object])
], LoginService);

var _a;
//# sourceMappingURL=C:/Users/Emery.Emery-PC/Documents/GitHub/ConnectFood/client/app/authentication/login-service.service.js.map

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

module.exports = "<div class=\"modal-dialog\">\r\n\t<div class=\"modal-content\">\r\n\t\t<div class=\"modal-header\">\r\n\t\t\t<h1 class=\"modal-title\">Sign In</h1>\r\n\t\t\t<button type=\"button\" class=\"close\" (click)=\"close()\" >&times;</button>\r\n\t\t</div>\r\n\t\t<div class=\"modal-body\">\r\n\t\t\t<form ngNativeValidate (submit)=\"loginUser($event)\">\r\n\t\t\t\t<div class=\"input\">\r\n\t\t\t\t\t<label>Username</label>\r\n\t\t\t\t\t<input name=\"Username\" [(ngModel)]=\"loginModel.username\" type=\"text\" required autofocus>\r\n\t\t\t\t</div>\r\n\t\t\t\t<div class=\"input\">\r\n\t\t\t\t\t<label>Password</label>\r\n\t\t\t\t\t<input name=\"Password\" [(ngModel)]=\"loginModel.password\" type=\"password\" required>\r\n\t\t\t\t</div>\r\n\t\t\t\t<div class=\"input\">\r\n\t\t\t\t\t<input type=\"submit\" value=\"Login\">\r\n\t\t\t\t</div>\r\n\t\t\t</form>\r\n\t\t</div>\r\n\t\t<div class=\"modal-footer\">\r\n\t\t\t<p *ngIf=\"loginModel.loginError\" id=\"loginErr\">Incorrect login information. Please Try Again.</p>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n"

/***/ }),

/***/ "../../../../../client/src/app/authentication/login.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap_modal__ = __webpack_require__("../../../../ng2-bootstrap-modal/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap_modal___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap_modal__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__login_service_service__ = __webpack_require__("../../../../../client/src/app/authentication/login-service.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__login_model__ = __webpack_require__("../../../../../client/src/app/authentication/login-model.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginComponent; });
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
        _this._loginModel = new __WEBPACK_IMPORTED_MODULE_3__login_model__["a" /* LoginModel */]();
        return _this;
    }
    LoginComponent.prototype.loginUser = function (event) {
        var _this = this;
        event.preventDefault();
        console.log(event);
        var observer = this.authenticationService.login(this.loginModel.username, this.loginModel.password);
        // This is the promise we get
        observer.subscribe(function (data) {
            // Fill our model with the JSON result and see if Login is a success.
            var loginSuccess = _this.loginModel.processLoginResult(data);
            if (loginSuccess)
                _this.close();
        }, function (error) {
            console.log(error);
            // Shouldn't happen!
        });
        // TODO: We should put some loading symbol in login popup here!!!
    };
    Object.defineProperty(LoginComponent.prototype, "loginModel", {
        get: function () {
            return this._loginModel;
        },
        enumerable: true,
        configurable: true
    });
    return LoginComponent;
}(__WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap_modal__["DialogComponent"]));
LoginComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-login',
        template: __webpack_require__("../../../../../client/src/app/authentication/login.component.html"),
        styles: [__webpack_require__("../../../../../client/src/app/authentication/login.component.css")],
        providers: [__WEBPACK_IMPORTED_MODULE_2__login_service_service__["a" /* LoginService */]]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap_modal__["DialogService"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap_modal__["DialogService"]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__login_service_service__["a" /* LoginService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__login_service_service__["a" /* LoginService */]) === "function" && _b || Object])
], LoginComponent);

var _a, _b;
//# sourceMappingURL=C:/Users/Emery.Emery-PC/Documents/GitHub/ConnectFood/client/app/authentication/login.component.js.map

/***/ }),

/***/ "../../../../../client/src/app/donor/donor.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../client/src/app/donor/donor.component.html":
/***/ (function(module, exports) {

module.exports = "<p>\r\n  donor works!\r\n</p>\r\n"

/***/ }),

/***/ "../../../../../client/src/app/donor/donor.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DonorComponent; });
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
    function DonorComponent() {
    }
    DonorComponent.prototype.ngOnInit = function () {
    };
    return DonorComponent;
}());
DonorComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-donor',
        template: __webpack_require__("../../../../../client/src/app/donor/donor.component.html"),
        styles: [__webpack_require__("../../../../../client/src/app/donor/donor.component.css")]
    }),
    __metadata("design:paramtypes", [])
], DonorComponent);

//# sourceMappingURL=C:/Users/Emery.Emery-PC/Documents/GitHub/ConnectFood/client/app/donor/donor.component.js.map

/***/ }),

/***/ "../../../../../client/src/app/footer/footer.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../client/src/app/footer/footer.component.html":
/***/ (function(module, exports) {

module.exports = "<p>\r\n  Copyright &copy; Connect Food\r\n</p>"

/***/ }),

/***/ "../../../../../client/src/app/footer/footer.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FooterComponent; });
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
    return FooterComponent;
}());
FooterComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-footer',
        template: __webpack_require__("../../../../../client/src/app/footer/footer.component.html"),
        styles: [__webpack_require__("../../../../../client/src/app/footer/footer.component.css")]
    }),
    __metadata("design:paramtypes", [])
], FooterComponent);

//# sourceMappingURL=C:/Users/Emery.Emery-PC/Documents/GitHub/ConnectFood/client/app/footer/footer.component.js.map

/***/ }),

/***/ "../../../../../client/src/app/header/header.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "header {\r\n\ttext-align: center;\r\n\tpadding: 20px 0;\r\n\tfont-size: 30px;\r\n\tborder-bottom: 2px solid #eee;\r\n}\r\n\r\n#loginButton:hover {\r\n\tcursor: pointer;\r\n\tcursor: hand;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../client/src/app/header/header.component.html":
/***/ (function(module, exports) {

module.exports = "<nav class=\"navbar navbar-toggleable-sm navbar-inverse bg-inverse\">\r\n    <button type=\"button\" class=\"navbar-toggler navbar-toggler-right\" (click)=\"isExpanded = !isExpanded\" [attr.aria-expanded]=\"!isExpanded\" aria-controls=\"navbarContent\">\r\n        <span class=\"navbar-toggler-icon\"></span>\r\n    </button>\r\n    <div class=\"navbar-brand\" [routerLink]=\"['/home']\">Connect Food</div>\r\n\r\n    <div class=\"collapse navbar-collapse\" id=\"navbarContent\" [ngbCollapse]=\"!isExpanded\">\r\n        <ul class=\"navbar-nav mr-auto\">\r\n            <li class=\"nav-item\"><a class='nav-link' [routerLink]=\"['/home']\">Home</a></li>\r\n            <li class=\"nav-item\"><a class='nav-link' [routerLink]=\"['/donor']\">Donor</a></li>\r\n            <li class=\"nav-item\"><a class='nav-link' [routerLink]=\"['/receiver']\">Receiver</a></li>\r\n        </ul>\r\n        <ul class=\"navbar-nav navbar-right\">\r\n            <li *ngIf=\"localStorage.getItem('username') === null\" class=\"nav-item\"><a id='loginButton' class='nav-link' (click)=\"showLogin()\">Login</a></li>\r\n            <li *ngIf=\"localStorage.getItem('username') !== null\" class=\"nav-item\"><a class='nav-link'>{{localStorage.getItem('username')}}</a></li>\r\n        </ul>\r\n    </div>\r\n</nav>"

/***/ }),

/***/ "../../../../../client/src/app/header/header.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__authentication_login_component__ = __webpack_require__("../../../../../client/src/app/authentication/login.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ng2_bootstrap_modal__ = __webpack_require__("../../../../ng2-bootstrap-modal/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ng2_bootstrap_modal___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_ng2_bootstrap_modal__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HeaderComponent; });
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
    function HeaderComponent(dialogService) {
        this.dialogService = dialogService;
        this.localStorage = localStorage;
    }
    HeaderComponent.prototype.ngOnInit = function () {
    };
    HeaderComponent.prototype.showLogin = function () {
        var dialogObserver = this.dialogService.addDialog(__WEBPACK_IMPORTED_MODULE_1__authentication_login_component__["a" /* LoginComponent */], 
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
    return HeaderComponent;
}());
HeaderComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-header',
        template: __webpack_require__("../../../../../client/src/app/header/header.component.html"),
        styles: [__webpack_require__("../../../../../client/src/app/header/header.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2_ng2_bootstrap_modal__["DialogService"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2_ng2_bootstrap_modal__["DialogService"]) === "function" && _a || Object])
], HeaderComponent);

var _a;
//# sourceMappingURL=C:/Users/Emery.Emery-PC/Documents/GitHub/ConnectFood/client/app/header/header.component.js.map

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

module.exports = "<p>\r\n    Home works!\r\n</p>\r\n"

/***/ }),

/***/ "../../../../../client/src/app/home/home.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomeComponent; });
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
    return HomeComponent;
}());
HomeComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-home',
        template: __webpack_require__("../../../../../client/src/app/home/home.component.html"),
        styles: [__webpack_require__("../../../../../client/src/app/home/home.component.css")]
    }),
    __metadata("design:paramtypes", [])
], HomeComponent);

//# sourceMappingURL=C:/Users/Emery.Emery-PC/Documents/GitHub/ConnectFood/client/app/home/home.component.js.map

/***/ }),

/***/ "../../../../../client/src/app/receiver/receiver-primary.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/@angular/http.es5.js");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ReceiverPrimaryService; });
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
        var observer = this.http.post('/receiver/filter', JSON.stringify({ filters: filterObj }));
        return observer.map(function (response) {
            var feed = response.json();
            if (feed && feed.name) {
                console.log('Got feed response: ' + feed.name);
            }
            return name;
        });
    };
    return ReceiverPrimaryService;
}());
ReceiverPrimaryService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */]) === "function" && _a || Object])
], ReceiverPrimaryService);

var _a;
//# sourceMappingURL=C:/Users/Emery.Emery-PC/Documents/GitHub/ConnectFood/client/app/receiver/receiver-primary.service.js.map

/***/ }),

/***/ "../../../../../client/src/app/receiver/receiver.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../client/src/app/receiver/receiver.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid\">\n  <div class=\"row\">\n    <div class=\"col-md-4\">\n      <h2>Filters</h2>\n      <hr>\n      <form [formGroup]=\"filterForm\">\n      <h4>Acceptable Food Types:</h4>\n        <div class=\"btn-group\" data-toggle=\"buttons\">\n          <label class=\"btn btn-primary\" [class.active]=\"filterForm.value.grain\">\n            <input type=\"checkbox\" formControlName=\"grain\">Grain\n          </label>\n          <label class=\"btn btn-primary\" [class.active]=\"filterForm.value.meat\">\n            <input type=\"checkbox\" formControlName=\"meat\">Meat\n          </label>\n          <label class=\"btn btn-primary\" [class.active]=\"filterForm.value.fruit\">\n            <input type=\"checkbox\" formControlName=\"fruit\">Fruit\n          </label>\n          <label class=\"btn btn-primary\" [class.active]=\"filterForm.value.vegetable\">\n            <input type=\"checkbox\" formControlName=\"vegetable\">Vegetable\n          </label>\n          <label class=\"btn btn-primary\" [class.active]=\"filterForm.value.drink\">\n            <input type=\"checkbox\" formControlName=\"drink\">Drink\n          </label>\n        </div>\n        <h4>Minimum Expiration:</h4>\n        <div ngbRadioGroup name=\"radioBasic\" formControlName=\"minExpireAfterDays\">\n          <label class=\"btn btn-primary\">\n            <input type=\"radio\" [value]=\"0\">{{tFrameVals[0]}}\n          </label>\n          <label class=\"btn btn-primary\">\n            <input type=\"radio\" [value]=\"1\">{{tFrameVals[1]}}\n          </label>\n          <label class=\"btn btn-primary\">\n            <input type=\"radio\" [value]=\"2\">{{tFrameVals[2]}}\n          </label>\n        </div>\n        <h4>Maximum Distance:</h4>\n        <div ngbRadioGroup name=\"radioBasic\" formControlName=\"maxDistance\">\n          <label class=\"btn btn-primary\">\n            <input type=\"radio\" [value]=\"0\">{{distVals[0]}}\n          </label>\n          <label class=\"btn btn-primary\">\n            <input type=\"radio\" [value]=\"1\">{{distVals[1]}}\n          </label>\n          <label class=\"btn btn-primary\">\n            <input type=\"radio\" [value]=\"2\">{{distVals[2]}}\n          </label>\n        </div>\n        <h4>Must Fit in a:</h4>\n        <div ngbRadioGroup name=\"radioBasic\" formControlName=\"maxQuantity\">\n          <label class=\"btn btn-primary\">\n            <input type=\"radio\" [value]=\"0\">{{quantityVals[0]}}\n          </label>\n          <label class=\"btn btn-primary\">\n            <input type=\"radio\" [value]=\"1\">{{quantityVals[1]}}\n          </label>\n          <label class=\"btn btn-primary\">\n            <input type=\"radio\" [value]=\"2\">{{quantityVals[2]}}\n          </label>\n        </div>\n        <h4>Acceptable Perishability:</h4>\n        <div class=\"btn-group\" data-toggle=\"buttons\">\n          <label class=\"btn btn-primary\" [class.active]=\"filterForm.value.perishable\">\n            <input type=\"checkbox\" formControlName=\"perishable\">Perishable\n          </label>\n          <label class=\"btn btn-primary\" [class.active]=\"filterForm.value.notPerishable\">\n            <input type=\"checkbox\" formControlName=\"notPerishable\">Not Perishable\n          </label>\n        </div>\n        <hr>\n      </form>\n    </div>\n    <div class=\"col-md-8\">\n      <ng-template #content let-c=\"close\" let-d=\"dismss\">\n        <div class=\"modal-header\">\n          <h4 class=\"modal-title\">{{selectedModel.name}}</h4>\n          <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"c('Cross click')\">\n            <span aria-hidden=\"true\">&times;</span>\n          </button>\n        </div>\n        <div class=\"modal-body\">\n          <p>{{selectedModel.foodDescription}}</p>\n        </div>\n          <div class=\"modal-footer\">\n          <button type=\"button\" class=\"btn btn-secondary\" (click)=\"c('Request click')\">Request</button>\n          <button type=\"button\" class=\"btn btn-secondary\" (click)=\"c('Close click')\">Close</button>\n        </div>\n      </ng-template>\n\n      <h2>Listings</h2>\n      <hr>\n      <div class=\"list-group\" style=\"overflow-y:auto\">\n        <a *ngFor=\"let model of models\" class=\"list-group-item\">\n          <img src=\"{{model.imgUrl}}\" alt=\"No Picture\" class=\"img-thumbnail\" style=\"width:7vw;height:7vw\">\n          <div>\n            <h4 style=\"margin-left:1vw\">{{model.name}}\n              <button style=\"float:right\" class=\"btn btn-primary btn-sm\" (click)=\"selectItem(content, model)\">\n                Details\n              </button>\n            </h4>\n            <hr>\n            <p style=\"margin-left:1vw\">\n              From {{model.donorOrganizationName}}, at {{model.donorOrganizationAddress}} {{model.donorDistance}} miles away. <br>\n              Present food types: {{model.foodTypeDescription}}. Expires: {{model.expirationDate}}. Requires a {{model.quantityClass}}.\n            </p>\n          </div>\n        </a>\n      </div>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "../../../../../client/src/app/receiver/receiver.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__("../../../forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__ = __webpack_require__("../../../../@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shared_filters__ = __webpack_require__("../../../../../client/src/app/receiver/shared/filters.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__receiver_primary_service__ = __webpack_require__("../../../../../client/src/app/receiver/receiver-primary.service.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ReceiverComponent; });
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
var ReceiverComponent = (function () {
    function ReceiverComponent(formBuilder, receiverPrimaryService, modalService) {
        this.formBuilder = formBuilder;
        this.receiverPrimaryService = receiverPrimaryService;
        this.modalService = modalService;
    }
    ReceiverComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.filters = new __WEBPACK_IMPORTED_MODULE_3__shared_filters__["a" /* Filters */](true, true, true, true, true, true, false, 0, 0, 0);
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
        //this.receiverPrimaryService.updateFeed(value).then(models => this.models = models);
        /*var observer = this.receiverPrimaryService.updateFeed(value);
    
        observer.subscribe(
          data => {
            //Apply Food model to data and store in this.models
            this.models = data as Food[];
          }
        );*/
        this.models = MODELS;
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
    return ReceiverComponent;
}());
ReceiverComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-receiver',
        template: __webpack_require__("../../../../../client/src/app/receiver/receiver.component.html"),
        styles: [__webpack_require__("../../../../../client/src/app/receiver/receiver.component.css")],
        providers: [__WEBPACK_IMPORTED_MODULE_4__receiver_primary_service__["a" /* ReceiverPrimaryService */]]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_forms__["e" /* FormBuilder */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_forms__["e" /* FormBuilder */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_4__receiver_primary_service__["a" /* ReceiverPrimaryService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__receiver_primary_service__["a" /* ReceiverPrimaryService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__["b" /* NgbModal */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__["b" /* NgbModal */]) === "function" && _c || Object])
], ReceiverComponent);

var _a, _b, _c;
//# sourceMappingURL=C:/Users/Emery.Emery-PC/Documents/GitHub/ConnectFood/client/app/receiver/receiver.component.js.map

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

//# sourceMappingURL=C:/Users/Emery.Emery-PC/Documents/GitHub/ConnectFood/client/app/receiver/shared/filters.js.map

/***/ }),

/***/ "../../../../../client/src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// The file contents for the current environment will overwrite these during build.
var environment = {
    production: false
};
//# sourceMappingURL=C:/Users/Emery.Emery-PC/Documents/GitHub/ConnectFood/client/environments/environment.js.map

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
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["enableProdMode"])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=C:/Users/Emery.Emery-PC/Documents/GitHub/ConnectFood/client/main.js.map

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("../../../../../client/src/main.ts");


/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map