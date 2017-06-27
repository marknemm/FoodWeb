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
import { FluentAssign } from './../framework/fluent-assign';
import { extend, arrayUnion } from './../framework/utils';
export var /** @type {?} */ DEFAULT_VALUES = {
    inElement: false,
    isBlocking: true,
    keyboard: [27],
    supportsKey: function supportsKey(keyCode) {
        return ((this.keyboard)).indexOf(keyCode) > -1;
    }
};
var /** @type {?} */ DEFAULT_SETTERS = [
    'inElement',
    'isBlocking',
    'keyboard'
];
var OverlayContext = (function () {
    function OverlayContext() {
    }
    /**
     * @return {?}
     */
    OverlayContext.prototype.normalize = function () {
        if (this.isBlocking !== false)
            this.isBlocking = true;
        if (this.keyboard === null) {
            this.keyboard = [];
        }
        else if (typeof this.keyboard === 'number') {
            this.keyboard = [/** @type {?} */ (this.keyboard)];
        }
        else if (!Array.isArray(/** @type {?} */ (this.keyboard))) {
            this.keyboard = DEFAULT_VALUES.keyboard;
        }
    };
    return OverlayContext;
}());
export { OverlayContext };
function OverlayContext_tsickle_Closure_declarations() {
    /**
     * Describes if the modal is rendered within the container element.
     * The container element is the ViewContainerRef supplied.
     * Defaults to false.
     * @type {?}
     */
    OverlayContext.prototype.inElement;
    /**
     * Describes if the modal is blocking modal.
     * A Blocking modal is not closable by clicking outside of the modal window.
     * Defaults to false.
     * @type {?}
     */
    OverlayContext.prototype.isBlocking;
    /**
     * Keyboard value/s that close the modal.
     * Accepts either a single numeric value or an array of numeric values.
     * A modal closed by a keyboard stroke will result in a 'reject' notification from the promise.
     * Defaults to 27, set `null` implicitly to disable.
     * @type {?}
     */
    OverlayContext.prototype.keyboard;
}
/**
 * A core context builder for a modal window instance, used to define the context upon
 * a modal choose it's behaviour.
 */
var OverlayContextBuilder = (function (_super) {
    __extends(OverlayContextBuilder, _super);
    /**
     * @param {?=} defaultValues
     * @param {?=} initialSetters
     * @param {?=} baseType
     */
    function OverlayContextBuilder(defaultValues, initialSetters, baseType) {
        if (defaultValues === void 0) { defaultValues = undefined; }
        if (initialSetters === void 0) { initialSetters = undefined; }
        if (baseType === void 0) { baseType = undefined; }
        return _super.call(this, extend(DEFAULT_VALUES, defaultValues || {}), arrayUnion(DEFAULT_SETTERS, initialSetters || []), baseType || OverlayContext // https://github.com/Microsoft/TypeScript/issues/7234
        ) || this;
    }
    /**
     * Returns an new OverlayConfig with a context property representing the data in this builder.
     * @param {?=} base A base configuration that the result will extend
     * @return {?} OverlayConfig
     */
    OverlayContextBuilder.prototype.toOverlayConfig = function (base) {
        return extend(base || {}, {
            context: this.toJSON()
        });
    };
    return OverlayContextBuilder;
}(FluentAssign));
export { OverlayContextBuilder };
function OverlayContextBuilder_tsickle_Closure_declarations() {
    /**
     * Describes if the modal is rendered within the container element.
     * The container element is the ViewContainerRef supplied.
     * Defaults to false.
     * @type {?}
     */
    OverlayContextBuilder.prototype.inElement;
    /**
     * Describes if the modal is blocking modal.
     * A Blocking modal is not closable by clicking outside of the modal window.
     * Defaults to false.
     * @type {?}
     */
    OverlayContextBuilder.prototype.isBlocking;
    /**
     * Keyboard value/s that close the modal.
     * Accepts either a single numeric value or an array of numeric values.
     * A modal closed by a keyboard stroke will result in a 'reject' notification from the promise.
     * Defaults to 27, set `null` implicitly to disable.
     * @type {?}
     */
    OverlayContextBuilder.prototype.keyboard;
}
/**
 * A helper to create an `OverlayConfig` on the fly.
 * Since `OverlayConfig` requires context it means a builder is needed, this process had some boilerplate.
 * When a quick, on the fly overlay config is needed use this helper to avoid that boilerplate.
 *
 * A builder is used as an API to allow setting the context and providing some operations around the modal.
 * When a developers knows the context before hand we can skip this step, this is what this factory is for.
 *
 * @template T
 * @param {?} context The context for the modal
 * @param {?=} baseContextType Optional. The type/class of the context. This is the class used to init a new instance of the context
 * @param {?=} baseConfig A base configuration that the result will extend
 * @return {?}
 */
export function overlayConfigFactory(context, baseContextType, baseConfig) {
    return new OverlayContextBuilder(/** @type {?} */ (context), undefined, baseContextType).toOverlayConfig(baseConfig);
}
//# sourceMappingURL=overlay-context.js.map