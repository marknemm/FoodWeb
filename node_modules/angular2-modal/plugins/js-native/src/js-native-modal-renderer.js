import { Injectable } from '@angular/core';
import { DROP_IN_TYPE } from 'angular2-modal';
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
export { JSNativeModalRenderer };
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