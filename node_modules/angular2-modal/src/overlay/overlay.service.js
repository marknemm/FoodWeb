import { Injectable, Injector } from '@angular/core';
import { OverlayRenderer } from '../models/tokens';
import { DialogRefStack } from '../models/dialog-ref-stack';
import { vcRefStore } from '../models/vc-ref-store';
import { DialogRef } from '../models/dialog-ref';
var /** @type {?} */ _stack = new DialogRefStack();
var Overlay = (function () {
    /**
     * @param {?} _modalRenderer
     * @param {?} injector
     */
    function Overlay(_modalRenderer, injector) {
        this._modalRenderer = _modalRenderer;
        this.injector = injector;
    }
    Object.defineProperty(Overlay.prototype, "stackLength", {
        /**
         * @return {?}
         */
        get: function () {
            return _stack.length;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Check if a given DialogRef is the top most ref in the stack.
     * TODO: distinguish between body modal vs in element modal.
     * @param {?} dialogRef
     * @return {?}
     */
    Overlay.prototype.isTopMost = function (dialogRef) {
        return _stack.indexOf(dialogRef) === _stack.length - 1;
    };
    /**
     * @param {?} dialogRef
     * @return {?}
     */
    Overlay.prototype.stackPosition = function (dialogRef) {
        return _stack.indexOf(dialogRef);
    };
    /**
     * @param {?} dialogRef
     * @return {?}
     */
    Overlay.prototype.groupStackLength = function (dialogRef) {
        return _stack.groupLength(_stack.groupOf(dialogRef));
    };
    /**
     * Creates an overlay and returns a dialog ref.
     * @template T
     * @param {?} config instructions how to create the overlay
     * @param {?=} group A token to associate the new overlay with, used for reference (stacks usually)
     * @return {?}
     */
    Overlay.prototype.open = function (config, group) {
        var _this = this;
        var /** @type {?} */ viewContainer = config.viewContainer, /** @type {?} */ containers = [];
        if (typeof viewContainer === 'string') {
            containers = vcRefStore.getVCRef(/** @type {?} */ (viewContainer));
        }
        else if (Array.isArray(viewContainer)) {
            containers = (viewContainer);
        }
        else if (viewContainer) {
            containers = ([viewContainer]);
        }
        else {
            containers = [null];
        }
        return containers
            .map(function (vc) { return _this.createOverlay(config.renderer || _this._modalRenderer, vc, config, group); });
    };
    /**
     * @param {?} renderer
     * @param {?} vcRef
     * @param {?} config
     * @param {?} group
     * @return {?}
     */
    Overlay.prototype.createOverlay = function (renderer, vcRef, config, group) {
        if (config.context) {
            config.context.normalize();
        }
        if (!config.injector) {
            config.injector = this.injector;
        }
        var /** @type {?} */ dialog = new DialogRef(this, config.context || {});
        dialog.inElement = config.context && !!config.context.inElement;
        var /** @type {?} */ cmpRef = renderer.render(dialog, vcRef, config.injector);
        Object.defineProperty(dialog, 'overlayRef', { value: cmpRef });
        _stack.pushManaged(dialog, group);
        return dialog;
    };
    Overlay.decorators = [
        { type: Injectable },
    ];
    /**
     * @nocollapse
     */
    Overlay.ctorParameters = function () { return [
        { type: OverlayRenderer, },
        { type: Injector, },
    ]; };
    return Overlay;
}());
export { Overlay };
function Overlay_tsickle_Closure_declarations() {
    /** @type {?} */
    Overlay.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    Overlay.ctorParameters;
    /** @type {?} */
    Overlay.prototype._modalRenderer;
    /** @type {?} */
    Overlay.prototype.injector;
}
//# sourceMappingURL=overlay.service.js.map