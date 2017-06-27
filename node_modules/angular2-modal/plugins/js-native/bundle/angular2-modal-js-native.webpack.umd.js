/** 
 * Angular2ModalJsNative Copyright 2017
 * Licensed under MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("angular2-modal"), require("@angular/core"));
	else if(typeof define === 'function' && define.amd)
		define(["angular2-modal", "@angular/core"], factory);
	else if(typeof exports === 'object')
		exports["angular2Modal.jsNative"] = factory(require("angular2-modal"), require("@angular/core"));
	else
		root["angular2Modal.jsNative"] = factory(root["angular2-modal"], root["@angular/core"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Modal; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__angular_core__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular2_modal__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular2_modal___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_angular2_modal__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__presets_js_native_preset__ = __webpack_require__(5);
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



var Modal = (function (_super) {
    __extends(Modal, _super);
    /**
     * @param {?} overlay
     */
    function Modal(overlay) {
        return _super.call(this, overlay) || this;
    }
    /**
     * @return {?}
     */
    Modal.prototype.alert = function () {
        return new __WEBPACK_IMPORTED_MODULE_2__presets_js_native_preset__["a" /* JSNativePresetBuilder */](this, __WEBPACK_IMPORTED_MODULE_1_angular2_modal__["DROP_IN_TYPE"].alert);
    };
    /**
     * @return {?}
     */
    Modal.prototype.prompt = function () {
        return new __WEBPACK_IMPORTED_MODULE_2__presets_js_native_preset__["a" /* JSNativePresetBuilder */](this, __WEBPACK_IMPORTED_MODULE_1_angular2_modal__["DROP_IN_TYPE"].prompt);
    };
    /**
     * @return {?}
     */
    Modal.prototype.confirm = function () {
        return new __WEBPACK_IMPORTED_MODULE_2__presets_js_native_preset__["a" /* JSNativePresetBuilder */](this, __WEBPACK_IMPORTED_MODULE_1_angular2_modal__["DROP_IN_TYPE"].confirm);
    };
    /**
     * @param {?} dialogRef
     * @param {?} type
     * @param {?=} bindings
     * @return {?}
     */
    Modal.prototype.create = function (dialogRef, type, bindings) {
        return dialogRef;
    };
    Modal.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
    ];
    /**
     * @nocollapse
     */
    Modal.ctorParameters = function () { return [
        { type: __WEBPACK_IMPORTED_MODULE_1_angular2_modal__["Overlay"], },
    ]; };
    return Modal;
}(__WEBPACK_IMPORTED_MODULE_1_angular2_modal__["Modal"]));

function Modal_tsickle_Closure_declarations() {
    /** @type {?} */
    Modal.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    Modal.ctorParameters;
}
//# sourceMappingURL=modal.js.map

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return JSNativeModalRenderer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__angular_core__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular2_modal__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular2_modal___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_angular2_modal__);


var JSNativeModalRenderer = (function () {
    function JSNativeModalRenderer() {
    }
    /**
     * @param {?} dialog
     * @param {?} vcRef
     * @return {?}
     */
    JSNativeModalRenderer.prototype.render = function (dialog, vcRef) {
        var /** @type {?} */ result;
        switch (dialog.context.dialogType) {
            case __WEBPACK_IMPORTED_MODULE_1_angular2_modal__["DROP_IN_TYPE"].alert:
                window.alert(dialog.context.message);
                result = true;
                break;
            case __WEBPACK_IMPORTED_MODULE_1_angular2_modal__["DROP_IN_TYPE"].prompt:
                result = window.prompt(dialog.context.message, dialog.context.promptDefault);
                break;
            case __WEBPACK_IMPORTED_MODULE_1_angular2_modal__["DROP_IN_TYPE"].confirm:
                result = window.confirm(dialog.context.message);
                break;
        }
        dialog.destroy = function () {
        };
        if (result === false) {
            dialog.dismiss();
        }
        else {
            dialog.close(result);
        }
        // we need to return ComponentRef<ModalOverlay> but a native dialog does'nt have that
        // so we resolve an empty promise, the user of this renderer should expect that.
        return ({});
    };
    JSNativeModalRenderer.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
    ];
    /**
     * @nocollapse
     */
    JSNativeModalRenderer.ctorParameters = function () { return []; };
    return JSNativeModalRenderer;
}());

function JSNativeModalRenderer_tsickle_Closure_declarations() {
    /** @type {?} */
    JSNativeModalRenderer.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    JSNativeModalRenderer.ctorParameters;
}
//# sourceMappingURL=js-native-modal-renderer.js.map

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return JSNativeModalContext; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return JSNativeModalContextBuilder; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular2_modal__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular2_modal___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular2_modal__);
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

var /** @type {?} */ DEFAULT_SETTERS = [
    'promptDefault'
];
var JSNativeModalContext = (function (_super) {
    __extends(JSNativeModalContext, _super);
    function JSNativeModalContext() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @return {?}
     */
    JSNativeModalContext.prototype.normalize = function () {
        if (!this.message)
            this.message = '';
        if (this.dialogType === undefined)
            this.dialogType = __WEBPACK_IMPORTED_MODULE_0_angular2_modal__["DROP_IN_TYPE"].alert;
    };
    return JSNativeModalContext;
}(__WEBPACK_IMPORTED_MODULE_0_angular2_modal__["ModalOpenContext"]));

function JSNativeModalContext_tsickle_Closure_declarations() {
    /** @type {?} */
    JSNativeModalContext.prototype.promptDefault;
    /** @type {?} */
    JSNativeModalContext.prototype.dialogType;
}
var JSNativeModalContextBuilder = (function (_super) {
    __extends(JSNativeModalContextBuilder, _super);
    /**
     * @param {?=} defaultValues
     * @param {?=} initialSetters
     * @param {?=} baseType
     */
    function JSNativeModalContextBuilder(defaultValues, initialSetters, baseType) {
        if (defaultValues === void 0) { defaultValues = undefined; }
        if (initialSetters === void 0) { initialSetters = undefined; }
        if (baseType === void 0) { baseType = undefined; }
        return _super.call(this, defaultValues || {}, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_angular2_modal__["arrayUnion"])(DEFAULT_SETTERS, initialSetters || []), baseType || JSNativeModalContext
        // https://github.com/Microsoft/TypeScript/issues/7234
        ) || this;
    }
    return JSNativeModalContextBuilder;
}(__WEBPACK_IMPORTED_MODULE_0_angular2_modal__["ModalOpenContextBuilder"]));

function JSNativeModalContextBuilder_tsickle_Closure_declarations() {
    /**
     * The default value for the prompt input
     * @type {?}
     */
    JSNativeModalContextBuilder.prototype.promptDefault;
}
//# sourceMappingURL=modal-context.js.map

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return JSNativePresetBuilder; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__modal__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modal_context__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__js_native_modal_renderer__ = __webpack_require__(3);
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



var JSNativePresetBuilder = (function (_super) {
    __extends(JSNativePresetBuilder, _super);
    /**
     * @param {?} modal
     * @param {?} dialogType
     */
    function JSNativePresetBuilder(modal, dialogType) {
        return _super.call(this, { modal: modal, dialogType: dialogType }) || this;
    }
    /**
     * Hook to alter config and return bindings.
     * @param {?} config
     * @return {?}
     */
    JSNativePresetBuilder.prototype.$$beforeOpen = function (config) {
        return [];
    };
    /**
     * Open a modal window based on the configuration of this config instance.
     * @param {?=} viewContainer If set opens the modal inside the supplied viewContainer
     * @return {?} Promise<DialogRef>
     */
    JSNativePresetBuilder.prototype.open = function (viewContainer) {
        var /** @type {?} */ context = this.toJSON();
        if (!(context.modal instanceof __WEBPACK_IMPORTED_MODULE_0__modal__["a" /* Modal */])) {
            return (Promise.reject(new Error('Configuration Error: modal service not set.')));
        }
        var /** @type {?} */ overlayConfig = {
            context: context,
            renderer: new __WEBPACK_IMPORTED_MODULE_2__js_native_modal_renderer__["a" /* JSNativeModalRenderer */](),
            viewContainer: viewContainer,
            bindings: typeof this.$$beforeOpen === 'function' && this.$$beforeOpen(context)
        };
        return context.modal.open(context.component, overlayConfig);
    };
    return JSNativePresetBuilder;
}(__WEBPACK_IMPORTED_MODULE_1__modal_context__["b" /* JSNativeModalContextBuilder */]));

//# sourceMappingURL=js-native-preset.js.map

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__modal__ = __webpack_require__(1);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__modal__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modal_context__ = __webpack_require__(4);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_1__modal_context__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_1__modal_context__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__js_native_modal_renderer__ = __webpack_require__(3);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return __WEBPACK_IMPORTED_MODULE_2__js_native_modal_renderer__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__presets_js_native_preset__ = __webpack_require__(5);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return __WEBPACK_IMPORTED_MODULE_3__presets_js_native_preset__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__js_native_module__ = __webpack_require__(8);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return __WEBPACK_IMPORTED_MODULE_4__js_native_module__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return __WEBPACK_IMPORTED_MODULE_4__js_native_module__["b"]; });





//# sourceMappingURL=js-native.js.map

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__js_native__ = __webpack_require__(6);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Modal", function() { return __WEBPACK_IMPORTED_MODULE_0__js_native__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "JSNativeModalContext", function() { return __WEBPACK_IMPORTED_MODULE_0__js_native__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "JSNativeModalContextBuilder", function() { return __WEBPACK_IMPORTED_MODULE_0__js_native__["c"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "JSNativeModalRenderer", function() { return __WEBPACK_IMPORTED_MODULE_0__js_native__["d"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "JSNativePresetBuilder", function() { return __WEBPACK_IMPORTED_MODULE_0__js_native__["e"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "JSNativeModalModule", function() { return __WEBPACK_IMPORTED_MODULE_0__js_native__["f"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "providers", function() { return __WEBPACK_IMPORTED_MODULE_0__js_native__["g"]; });
/**
 * Generated bundle index. Do not edit.
 */

//# sourceMappingURL=angular2-modal-js-native.ng-flat.js.map

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return providers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return JSNativeModalModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__angular_core__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular2_modal__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular2_modal___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_angular2_modal__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modal__ = __webpack_require__(1);



var /** @type {?} */ providers = [
    { provide: __WEBPACK_IMPORTED_MODULE_1_angular2_modal__["Modal"], useClass: __WEBPACK_IMPORTED_MODULE_2__modal__["a" /* Modal */] },
    { provide: __WEBPACK_IMPORTED_MODULE_2__modal__["a" /* Modal */], useClass: __WEBPACK_IMPORTED_MODULE_2__modal__["a" /* Modal */] }
];
var JSNativeModalModule = (function () {
    function JSNativeModalModule() {
    }
    /**
     * @return {?}
     */
    JSNativeModalModule.getProviders = function () {
        return providers;
    };
    JSNativeModalModule.decorators = [
        { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                    providers: providers
                },] },
    ];
    /**
     * @nocollapse
     */
    JSNativeModalModule.ctorParameters = function () { return []; };
    return JSNativeModalModule;
}());

function JSNativeModalModule_tsickle_Closure_declarations() {
    /** @type {?} */
    JSNativeModalModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    JSNativeModalModule.ctorParameters;
}
//# sourceMappingURL=js-native.module.js.map

/***/ })
/******/ ]);
});
//# sourceMappingURL=angular2-modal-js-native.webpack.umd.js.map