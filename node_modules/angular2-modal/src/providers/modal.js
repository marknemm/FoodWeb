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
import { ReflectiveInjector } from '@angular/core';
import { DialogRef } from '../models/dialog-ref';
var UnsupportedDropInError = (function (_super) {
    __extends(UnsupportedDropInError, _super);
    /**
     * @param {?} dropInName
     */
    function UnsupportedDropInError(dropInName) {
        var _this = _super.call(this) || this;
        _this.message = "Unsupported Drop-In " + dropInName;
        return _this;
    }
    return UnsupportedDropInError;
}(Error));
export { UnsupportedDropInError };
/**
 * @abstract
 */
var Modal = (function () {
    /**
     * @param {?} overlay
     */
    function Modal(overlay) {
        this.overlay = overlay;
    }
    /**
     * @return {?}
     */
    Modal.prototype.alert = function () {
        throw new UnsupportedDropInError('alert');
    };
    /**
     * @return {?}
     */
    Modal.prototype.prompt = function () {
        throw new UnsupportedDropInError('prompt');
    };
    /**
     * @return {?}
     */
    Modal.prototype.confirm = function () {
        throw new UnsupportedDropInError('confirm');
    };
    /**
     * Opens a modal window inside an existing component.
     * @param {?} content The content to display, either string, template ref or a component.
     * @param {?=} config Additional settings.
     * @return {?}
     */
    Modal.prototype.open = function (content, config) {
        config = config || ({});
        try {
            var /** @type {?} */ dialogs = this.overlay.open(config, this.constructor);
            if (dialogs.length > 1) {
                console.warn("Attempt to open more then 1 overlay detected.\n        Multiple modal copies are not supported at the moment, \n        only the first viewContainer will display.");
            }
            // TODO:  Currently supporting 1 view container, hence working on dialogs[0].
            //        upgrade to multiple containers.
            return Promise.resolve(this.create(dialogs[0], content, config.bindings));
        }
        catch (e) {
            return Promise.reject(e);
        }
    };
    /**
     * A Hook that enables derived classes to add content to the overlay.
     * @abstract
     * @param {?} dialogRef
     * @param {?} type
     * @param {?=} bindings
     * @return {?}
     */
    Modal.prototype.create = function (dialogRef, type, bindings) { };
    /**
     * @template T
     * @param {?} dialogRef
     * @param {?} BackdropComponent
     * @return {?}
     */
    Modal.prototype.createBackdrop = function (dialogRef, BackdropComponent) {
        var /** @type {?} */ b = ReflectiveInjector.resolve([{ provide: DialogRef, useValue: dialogRef }]);
        return dialogRef.overlayRef.instance.addComponent(BackdropComponent, b);
    };
    /**
     * @template T
     * @param {?} dialogRef
     * @param {?} ContainerComponent
     * @param {?} content
     * @param {?=} bindings
     * @return {?}
     */
    Modal.prototype.createContainer = function (dialogRef, ContainerComponent, content, bindings) {
        var /** @type {?} */ b = ReflectiveInjector.resolve([{ provide: DialogRef, useValue: dialogRef }])
            .concat(bindings || []);
        var /** @type {?} */ nodes = dialogRef.overlayRef.instance.getProjectables(content, b);
        return dialogRef.overlayRef.instance.addComponent(ContainerComponent, b, nodes);
    };
    /**
     * A helper function for derived classes to create backdrop & container
     * @deprecated use createBackdrop and createContainer instead
     * @template B, C
     * @param {?} dialogRef
     * @param {?} backdrop
     * @param {?} container
     *
     * @return {?}
     */
    Modal.prototype.createModal = function (dialogRef, backdrop, container) {
        var /** @type {?} */ b = ReflectiveInjector.resolve([{ provide: DialogRef, useValue: dialogRef }]);
        return {
            backdropRef: dialogRef.overlayRef.instance.addComponent(backdrop, b),
            containerRef: dialogRef.overlayRef.instance.addComponent(container, b)
        };
    };
    return Modal;
}());
export { Modal };
function Modal_tsickle_Closure_declarations() {
    /** @type {?} */
    Modal.prototype.overlay;
}
//# sourceMappingURL=modal.js.map