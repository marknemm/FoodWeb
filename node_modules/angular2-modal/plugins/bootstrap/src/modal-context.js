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
import { ModalOpenContext, ModalOpenContextBuilder, extend, arrayUnion } from 'angular2-modal';
var /** @type {?} */ DEFAULT_VALUES = {
    dialogClass: 'modal-dialog',
    showClose: false
};
var /** @type {?} */ DEFAULT_SETTERS = [
    'dialogClass',
    'size',
    'showClose'
];
var BSModalContext = (function (_super) {
    __extends(BSModalContext, _super);
    function BSModalContext() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @return {?}
     */
    BSModalContext.prototype.normalize = function () {
        if (!this.dialogClass) {
            this.dialogClass = DEFAULT_VALUES.dialogClass;
        }
        _super.prototype.normalize.call(this);
    };
    return BSModalContext;
}(ModalOpenContext));
export { BSModalContext };
function BSModalContext_tsickle_Closure_declarations() {
    /**
     * A Class for the modal dialog container.
     * Default: modal-dialog
     * @type {?}
     */
    BSModalContext.prototype.dialogClass;
    /**
     * Size of the modal. 'lg' or 'sm' only.
     *
     * If you want to use custom sizes leave this empty and set the dialogClass property.
     * e.g: dialogClass = 'modal-dialog my-custom-dialog`
     * NOTE: No validation.
     * Default: ''
     * @type {?}
     */
    BSModalContext.prototype.size;
    /**
     * When true, show a close button on the top right corner.
     * @type {?}
     */
    BSModalContext.prototype.showClose;
}
var BSModalContextBuilder = (function (_super) {
    __extends(BSModalContextBuilder, _super);
    /**
     * @param {?=} defaultValues
     * @param {?=} initialSetters
     * @param {?=} baseType
     */
    function BSModalContextBuilder(defaultValues, initialSetters, baseType) {
        if (defaultValues === void 0) { defaultValues = undefined; }
        if (initialSetters === void 0) { initialSetters = undefined; }
        if (baseType === void 0) { baseType = undefined; }
        return _super.call(this, extend(DEFAULT_VALUES, defaultValues || {}), arrayUnion(DEFAULT_SETTERS, initialSetters || []), baseType || BSModalContext // https://github.com/Microsoft/TypeScript/issues/7234
        ) || this;
    }
    return BSModalContextBuilder;
}(ModalOpenContextBuilder));
export { BSModalContextBuilder };
function BSModalContextBuilder_tsickle_Closure_declarations() {
    /**
     * A Class for the modal dialog container.
     * Default: modal-dialog
     * @type {?}
     */
    BSModalContextBuilder.prototype.dialogClass;
    /**
     * Size of the modal. 'lg' or 'sm' only.
     *
     * If you want to use custom sizes leave this empty and set the dialogClass property.
     * e.g: dialogClass = 'modal-dialog my-custom-dialog`
     * NOTE: No validation.
     * Default: ''
     * @type {?}
     */
    BSModalContextBuilder.prototype.size;
    /**
     * When true, show a close button on the top right corner.
     * @type {?}
     */
    BSModalContextBuilder.prototype.showClose;
}
//# sourceMappingURL=modal-context.js.map