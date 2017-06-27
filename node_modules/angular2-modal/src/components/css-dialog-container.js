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
import { Component, ViewEncapsulation, ElementRef, Renderer } from '@angular/core';
import { BaseDynamicComponent } from './base-dynamic-component';
import { DialogRef } from '../models/dialog-ref';
/**
 * A component that acts as a top level container for an open modal window.
 */
var CSSDialogContainer = (function (_super) {
    __extends(CSSDialogContainer, _super);
    /**
     * @param {?} dialog
     * @param {?} el
     * @param {?} renderer
     */
    function CSSDialogContainer(dialog, el, renderer) {
        var _this = _super.call(this, el, renderer) || this;
        _this.dialog = dialog;
        _this.activateAnimationListener();
        return _this;
    }
    CSSDialogContainer.decorators = [
        { type: Component, args: [{
                    selector: 'css-dialog-container',
                    host: {
                        'tabindex': '-1',
                        'role': 'dialog'
                    },
                    encapsulation: ViewEncapsulation.None,
                    template: "<ng-content></ng-content>"
                },] },
    ];
    /**
     * @nocollapse
     */
    CSSDialogContainer.ctorParameters = function () { return [
        { type: DialogRef, },
        { type: ElementRef, },
        { type: Renderer, },
    ]; };
    return CSSDialogContainer;
}(BaseDynamicComponent));
export { CSSDialogContainer };
function CSSDialogContainer_tsickle_Closure_declarations() {
    /** @type {?} */
    CSSDialogContainer.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    CSSDialogContainer.ctorParameters;
    /** @type {?} */
    CSSDialogContainer.prototype.dialog;
}
//# sourceMappingURL=css-dialog-container.js.map