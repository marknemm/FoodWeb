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
import { ModalOpenContext, ModalOpenContextBuilder, privateKey, extend, arrayUnion } from 'angular2-modal';
var /** @type {?} */ DEFAULT_VALUES = {
    className: /** @type {?} */ ('default'),
    overlayClassName: 'vex-overlay',
    contentClassName: 'vex-content',
    closeClassName: 'vex-close'
};
var /** @type {?} */ DEFAULT_SETTERS = [
    'className',
    'overlayClassName',
    'contentClassName',
    'closeClassName',
    'showCloseButton'
];
var VEXModalContext = (function (_super) {
    __extends(VEXModalContext, _super);
    function VEXModalContext() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @return {?}
     */
    VEXModalContext.prototype.normalize = function () {
        if (!this.className) {
            this.className = DEFAULT_VALUES.className;
        }
        if (!this.overlayClassName) {
            this.overlayClassName = DEFAULT_VALUES.overlayClassName;
        }
        if (!this.contentClassName) {
            this.contentClassName = DEFAULT_VALUES.contentClassName;
        }
        if (!this.closeClassName) {
            this.closeClassName = DEFAULT_VALUES.closeClassName;
        }
        _super.prototype.normalize.call(this);
    };
    return VEXModalContext;
}(ModalOpenContext));
export { VEXModalContext };
function VEXModalContext_tsickle_Closure_declarations() {
    /**
     * Set the built in schema to use.
     * @type {?}
     */
    VEXModalContext.prototype.className;
    /** @type {?} */
    VEXModalContext.prototype.overlayClassName;
    /** @type {?} */
    VEXModalContext.prototype.contentClassName;
    /** @type {?} */
    VEXModalContext.prototype.closeClassName;
    /** @type {?} */
    VEXModalContext.prototype.showCloseButton;
}
var VEXModalContextBuilder = (function (_super) {
    __extends(VEXModalContextBuilder, _super);
    /**
     * @param {?=} defaultValues
     * @param {?=} initialSetters
     * @param {?=} baseType
     */
    function VEXModalContextBuilder(defaultValues, initialSetters, baseType) {
        if (defaultValues === void 0) { defaultValues = undefined; }
        if (initialSetters === void 0) { initialSetters = undefined; }
        if (baseType === void 0) { baseType = undefined; }
        return _super.call(this, extend(DEFAULT_VALUES, defaultValues || {}), arrayUnion(DEFAULT_SETTERS, initialSetters || []), baseType || VEXModalContext // https://github.com/Microsoft/TypeScript/issues/7234
        ) || this;
    }
    /**
     *
     * \@aliasFor isBlocking
     * @param {?} value
     * @return {?}
     */
    VEXModalContextBuilder.prototype.overlayClosesOnClick = function (value) {
        this[privateKey('isBlocking')] = !value;
        return this;
    };
    return VEXModalContextBuilder;
}(ModalOpenContextBuilder));
export { VEXModalContextBuilder };
function VEXModalContextBuilder_tsickle_Closure_declarations() {
    /**
     * Set the built in schema to use.
     * @type {?}
     */
    VEXModalContextBuilder.prototype.className;
    /** @type {?} */
    VEXModalContextBuilder.prototype.overlayClassName;
    /** @type {?} */
    VEXModalContextBuilder.prototype.contentClassName;
    /** @type {?} */
    VEXModalContextBuilder.prototype.closeClassName;
    /** @type {?} */
    VEXModalContextBuilder.prototype.showCloseButton;
}
//# sourceMappingURL=modal-context.js.map