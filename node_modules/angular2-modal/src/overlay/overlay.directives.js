import { Directive, Input, ElementRef, ViewContainerRef } from '@angular/core';
import { DialogRef } from '../models/dialog-ref';
import { vcRefStore } from '../models/vc-ref-store';
/**
 * A directive use to signal the overlay that the host of this directive
 * is a dialog boundary, i.e: over click outside of the element should close the modal
 * (if non blocking)
 */
var OverlayDialogBoundary = (function () {
    /**
     * @param {?} el
     * @param {?} dialogRef
     */
    function OverlayDialogBoundary(el, dialogRef) {
        if (dialogRef && el.nativeElement) {
            dialogRef.overlayRef.instance.setClickBoundary(el.nativeElement);
        }
    }
    OverlayDialogBoundary.decorators = [
        { type: Directive, args: [{
                    selector: '[overlayDialogBoundary]'
                },] },
    ];
    /**
     * @nocollapse
     */
    OverlayDialogBoundary.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: DialogRef, },
    ]; };
    return OverlayDialogBoundary;
}());
export { OverlayDialogBoundary };
function OverlayDialogBoundary_tsickle_Closure_declarations() {
    /** @type {?} */
    OverlayDialogBoundary.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    OverlayDialogBoundary.ctorParameters;
}
var OverlayTarget = (function () {
    /**
     * @param {?} vcRef
     */
    function OverlayTarget(vcRef) {
        this.vcRef = vcRef;
    }
    Object.defineProperty(OverlayTarget.prototype, "targetKey", {
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._targetKey = value;
            if (value) {
                vcRefStore.setVCRef(value, this.vcRef);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    OverlayTarget.prototype.ngOnDestroy = function () {
        if (this._targetKey) {
            vcRefStore.delVCRef(this._targetKey, this.vcRef);
        }
    };
    OverlayTarget.decorators = [
        { type: Directive, args: [{
                    selector: '[overlayTarget]'
                },] },
    ];
    /**
     * @nocollapse
     */
    OverlayTarget.ctorParameters = function () { return [
        { type: ViewContainerRef, },
    ]; };
    OverlayTarget.propDecorators = {
        'targetKey': [{ type: Input, args: ['overlayTarget',] },],
    };
    return OverlayTarget;
}());
export { OverlayTarget };
function OverlayTarget_tsickle_Closure_declarations() {
    /** @type {?} */
    OverlayTarget.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    OverlayTarget.ctorParameters;
    /** @type {?} */
    OverlayTarget.propDecorators;
    /** @type {?} */
    OverlayTarget.prototype._targetKey;
    /** @type {?} */
    OverlayTarget.prototype.vcRef;
}
//# sourceMappingURL=overlay.directives.js.map