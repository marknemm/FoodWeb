import { Injectable, NgModule } from '@angular/core';
import { DROP_IN_TYPE, Modal, ModalOpenContext, ModalOpenContextBuilder, Overlay, arrayUnion } from 'angular2-modal';

var __extends$2 = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var DEFAULT_SETTERS = [
    'promptDefault'
];
var JSNativeModalContext = (function (_super) {
    __extends$2(JSNativeModalContext, _super);
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
            this.dialogType = DROP_IN_TYPE.alert;
    };
    return JSNativeModalContext;
}(ModalOpenContext));
var JSNativeModalContextBuilder = (function (_super) {
    __extends$2(JSNativeModalContextBuilder, _super);
    /**
     * @param {?=} defaultValues
     * @param {?=} initialSetters
     * @param {?=} baseType
     */
    function JSNativeModalContextBuilder(defaultValues, initialSetters, baseType) {
        if (defaultValues === void 0) { defaultValues = undefined; }
        if (initialSetters === void 0) { initialSetters = undefined; }
        if (baseType === void 0) { baseType = undefined; }
        return _super.call(this, defaultValues || {}, arrayUnion(DEFAULT_SETTERS, initialSetters || []), baseType || JSNativeModalContext
        // https://github.com/Microsoft/TypeScript/issues/7234
        ) || this;
    }
    return JSNativeModalContextBuilder;
}(ModalOpenContextBuilder));

var JSNativeModalRenderer = /*@__PURE__*/(function () {
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
            case DROP_IN_TYPE.alert:
                window.alert(dialog.context.message);
                result = true;
                break;
            case DROP_IN_TYPE.prompt:
                result = window.prompt(dialog.context.message, dialog.context.promptDefault);
                break;
            case DROP_IN_TYPE.confirm:
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
        { type: Injectable },
    ];
    /**
     * @nocollapse
     */
    JSNativeModalRenderer.ctorParameters = function () { return []; };
    return JSNativeModalRenderer;
}());

var __extends$1 = (this && this.__extends) || (function () {
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
    __extends$1(JSNativePresetBuilder, _super);
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
        if (!(context.modal instanceof Modal$1)) {
            return (Promise.reject(new Error('Configuration Error: modal service not set.')));
        }
        var /** @type {?} */ overlayConfig = {
            context: context,
            renderer: new JSNativeModalRenderer(),
            viewContainer: viewContainer,
            bindings: typeof this.$$beforeOpen === 'function' && this.$$beforeOpen(context)
        };
        return context.modal.open(context.component, overlayConfig);
    };
    return JSNativePresetBuilder;
}(JSNativeModalContextBuilder));

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
var Modal$1 = (function (_super) {
    __extends(Modal$$1, _super);
    /**
     * @param {?} overlay
     */
    function Modal$$1(overlay) {
        return _super.call(this, overlay) || this;
    }
    /**
     * @return {?}
     */
    Modal$$1.prototype.alert = function () {
        return new JSNativePresetBuilder(this, DROP_IN_TYPE.alert);
    };
    /**
     * @return {?}
     */
    Modal$$1.prototype.prompt = function () {
        return new JSNativePresetBuilder(this, DROP_IN_TYPE.prompt);
    };
    /**
     * @return {?}
     */
    Modal$$1.prototype.confirm = function () {
        return new JSNativePresetBuilder(this, DROP_IN_TYPE.confirm);
    };
    /**
     * @param {?} dialogRef
     * @param {?} type
     * @param {?=} bindings
     * @return {?}
     */
    Modal$$1.prototype.create = function (dialogRef, type, bindings) {
        return dialogRef;
    };
    Modal$$1.decorators = [
        { type: Injectable },
    ];
    /**
     * @nocollapse
     */
    Modal$$1.ctorParameters = function () { return [
        { type: Overlay, },
    ]; };
    return Modal$$1;
}(Modal));

var providers = [
    { provide: Modal, useClass: Modal$1 },
    { provide: Modal$1, useClass: Modal$1 }
];
var JSNativeModalModule = /*@__PURE__*/(function () {
    function JSNativeModalModule() {
    }
    /**
     * @return {?}
     */
    JSNativeModalModule.getProviders = function () {
        return providers;
    };
    JSNativeModalModule.decorators = [
        { type: NgModule, args: [{
                    providers: providers
                },] },
    ];
    /**
     * @nocollapse
     */
    JSNativeModalModule.ctorParameters = function () { return []; };
    return JSNativeModalModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { Modal$1 as Modal, JSNativeModalContext, JSNativeModalContextBuilder, JSNativeModalRenderer, JSNativePresetBuilder, JSNativeModalModule, providers };
//# sourceMappingURL=angular2-modal-js-native.es5.js.map
