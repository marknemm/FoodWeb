import { ApplicationRef, Injector, Injectable, ReflectiveInjector } from '@angular/core';
import { createComponent } from '../framework/createComponent';
import { DialogRef } from '../models/dialog-ref';
import { ModalOverlay } from '../overlay/index';
var DOMOverlayRenderer = (function () {
    /**
     * @param {?} appRef
     * @param {?} injector
     */
    function DOMOverlayRenderer(appRef, injector) {
        this.appRef = appRef;
        this.injector = injector;
        this.isDoc = !(typeof document === 'undefined' || !document);
    }
    /**
     * @param {?} dialog
     * @param {?} vcRef
     * @param {?=} injector
     * @return {?}
     */
    DOMOverlayRenderer.prototype.render = function (dialog, vcRef, injector) {
        var _this = this;
        if (!injector) {
            injector = this.injector;
        }
        var /** @type {?} */ bindings = ReflectiveInjector.resolve([
            { provide: DialogRef, useValue: dialog }
        ]);
        var /** @type {?} */ cmpRef = createComponent({
            component: ModalOverlay,
            vcRef: vcRef,
            injector: injector,
            bindings: bindings
        });
        if (!vcRef) {
            this.appRef.attachView(cmpRef.hostView);
            // TODO: doesn't look like this is needed, explore. leaving now to be on the safe side.
            dialog.onDestroy.subscribe(function () { return _this.appRef.detachView(cmpRef.hostView); });
        }
        if (vcRef && dialog.inElement) {
            vcRef.element.nativeElement.appendChild(cmpRef.location.nativeElement);
        }
        else if (this.isDoc) {
            document.body.appendChild(cmpRef.location.nativeElement);
        }
        return cmpRef;
    };
    DOMOverlayRenderer.decorators = [
        { type: Injectable },
    ];
    /**
     * @nocollapse
     */
    DOMOverlayRenderer.ctorParameters = function () { return [
        { type: ApplicationRef, },
        { type: Injector, },
    ]; };
    return DOMOverlayRenderer;
}());
export { DOMOverlayRenderer };
function DOMOverlayRenderer_tsickle_Closure_declarations() {
    /** @type {?} */
    DOMOverlayRenderer.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    DOMOverlayRenderer.ctorParameters;
    /** @type {?} */
    DOMOverlayRenderer.prototype.isDoc;
    /** @type {?} */
    DOMOverlayRenderer.prototype.appRef;
    /** @type {?} */
    DOMOverlayRenderer.prototype.injector;
}
//# sourceMappingURL=dom-modal-renderer.js.map