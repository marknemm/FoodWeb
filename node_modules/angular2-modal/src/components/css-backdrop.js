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
import { Component, ElementRef, ViewEncapsulation, Renderer } from '@angular/core';
import { BaseDynamicComponent } from './base-dynamic-component';
/**
 * Represents the modal backdrop shaped by CSS.
 */
var CSSBackdrop = (function (_super) {
    __extends(CSSBackdrop, _super);
    /**
     * @param {?} el
     * @param {?} renderer
     */
    function CSSBackdrop(el, renderer) {
        var _this = _super.call(this, el, renderer) || this;
        _this.activateAnimationListener();
        var style = {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
        };
        Object.keys(style).forEach(function (k) { return _this.setStyle(k, style[k]); });
        return _this;
    }
    CSSBackdrop.decorators = [
        { type: Component, args: [{
                    selector: 'css-backdrop',
                    host: {
                        '[attr.class]': 'cssClass',
                        '[attr.style]': 'styleStr'
                    },
                    encapsulation: ViewEncapsulation.None,
                    template: ""
                },] },
    ];
    /**
     * @nocollapse
     */
    CSSBackdrop.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: Renderer, },
    ]; };
    return CSSBackdrop;
}(BaseDynamicComponent));
export { CSSBackdrop };
function CSSBackdrop_tsickle_Closure_declarations() {
    /** @type {?} */
    CSSBackdrop.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    CSSBackdrop.ctorParameters;
    /** @type {?} */
    CSSBackdrop.prototype.cssClass;
    /** @type {?} */
    CSSBackdrop.prototype.styleStr;
}
//# sourceMappingURL=css-backdrop.js.map