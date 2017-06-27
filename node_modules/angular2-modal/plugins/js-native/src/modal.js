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
import { Injectable } from '@angular/core';
import { Overlay, DROP_IN_TYPE, Modal as Modal_ } from 'angular2-modal';
import { JSNativePresetBuilder } from './presets/js-native-preset';
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
        return new JSNativePresetBuilder(this, DROP_IN_TYPE.alert);
    };
    /**
     * @return {?}
     */
    Modal.prototype.prompt = function () {
        return new JSNativePresetBuilder(this, DROP_IN_TYPE.prompt);
    };
    /**
     * @return {?}
     */
    Modal.prototype.confirm = function () {
        return new JSNativePresetBuilder(this, DROP_IN_TYPE.confirm);
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
        { type: Injectable },
    ];
    /**
     * @nocollapse
     */
    Modal.ctorParameters = function () { return [
        { type: Overlay, },
    ]; };
    return Modal;
}(Modal_));
export { Modal };
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