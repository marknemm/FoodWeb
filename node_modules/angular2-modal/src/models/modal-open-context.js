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
import { Modal } from '../providers/index';
import { ModalContext, ModalContextBuilder } from './modal-context';
import { arrayUnion } from '../framework/utils';
var /** @type {?} */ DEFAULT_SETTERS = [
    'component'
];
var ModalOpenContext = (function (_super) {
    __extends(ModalOpenContext, _super);
    function ModalOpenContext() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ModalOpenContext;
}(ModalContext));
export { ModalOpenContext };
function ModalOpenContext_tsickle_Closure_declarations() {
    /** @type {?} */
    ModalOpenContext.prototype.component;
    /** @type {?} */
    ModalOpenContext.prototype.modal;
}
/**
 * A Modal Context that knows about the modal service, and so can open a modal window on demand.
 * Use the fluent API to configure the preset and then invoke the 'open' method to open a modal
 * based on the context.
 * @abstract
 */
var ModalOpenContextBuilder = (function (_super) {
    __extends(ModalOpenContextBuilder, _super);
    /**
     * @param {?=} defaultValues
     * @param {?=} initialSetters
     * @param {?=} baseType
     */
    function ModalOpenContextBuilder(defaultValues, initialSetters, baseType) {
        if (defaultValues === void 0) { defaultValues = undefined; }
        if (initialSetters === void 0) { initialSetters = undefined; }
        if (baseType === void 0) { baseType = undefined; }
        return _super.call(this, defaultValues || {}, arrayUnion(DEFAULT_SETTERS, initialSetters || []), baseType) || this;
    }
    /**
     * Hook to alter config and return bindings.
     * @param {?} config
     * @return {?}
     */
    ModalOpenContextBuilder.prototype.$$beforeOpen = function (config) {
        return [];
    };
    /**
     * Open a modal window based on the configuration of this config instance.
     * @param {?=} viewContainer If set opens the modal inside the supplied viewContainer
     * @return {?} Promise<DialogRef>
     */
    ModalOpenContextBuilder.prototype.open = function (viewContainer) {
        var /** @type {?} */ context = this.toJSON();
        if (!(context.modal instanceof Modal)) {
            return (Promise.reject(new Error('Configuration Error: modal service not set.')));
        }
        var /** @type {?} */ overlayConfig = {
            context: context,
            viewContainer: viewContainer,
            bindings: typeof this.$$beforeOpen === 'function' && this.$$beforeOpen(context)
        };
        return context.modal.open(context.component, overlayConfig);
    };
    return ModalOpenContextBuilder;
}(ModalContextBuilder));
export { ModalOpenContextBuilder };
function ModalOpenContextBuilder_tsickle_Closure_declarations() {
    /**
     * A Class for the footer container.
     * Default: modal-footer
     * @type {?}
     */
    ModalOpenContextBuilder.prototype.component;
}
//# sourceMappingURL=modal-open-context.js.map