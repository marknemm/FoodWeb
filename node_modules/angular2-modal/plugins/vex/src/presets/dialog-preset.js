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
import { privateKey, extend, arrayUnion } from 'angular2-modal';
import { VEXModalContext, VEXModalContextBuilder } from '../modal-context';
import { DialogFormModal as component } from '../dialog-form-modal';
var /** @type {?} */ DEFAULT_SETTERS = [
    'content'
];
/**
 * Data definition
 */
var DialogPreset = (function (_super) {
    __extends(DialogPreset, _super);
    function DialogPreset() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DialogPreset;
}(VEXModalContext));
export { DialogPreset };
function DialogPreset_tsickle_Closure_declarations() {
    /** @type {?} */
    DialogPreset.prototype.defaultResult;
    /** @type {?} */
    DialogPreset.prototype.content;
    /** @type {?} */
    DialogPreset.prototype.buttons;
    /** @type {?} */
    DialogPreset.prototype.showInput;
}
/**
 * A Preset representing the configuration needed to open MessageModal.
 * This is an abstract implementation with no concrete behaviour.
 * Use derived implementation.
 */
var DialogPresetBuilder = (function (_super) {
    __extends(DialogPresetBuilder, _super);
    /**
     * @param {?} modal
     * @param {?=} defaultValues
     * @param {?=} initialSetters
     * @param {?=} baseType
     */
    function DialogPresetBuilder(modal, defaultValues, initialSetters, baseType) {
        if (defaultValues === void 0) { defaultValues = undefined; }
        if (initialSetters === void 0) { initialSetters = undefined; }
        if (baseType === void 0) { baseType = undefined; }
        return _super.call(this, extend({ modal: modal, component: component, buttons: [], defaultResult: true }, defaultValues || {}), arrayUnion(DEFAULT_SETTERS, initialSetters || []), baseType || DialogPreset // https://github.com/Microsoft/TypeScript/issues/7234
        ) || this;
    }
    /**
     * @param {?} css
     * @param {?} caption
     * @param {?} onClick
     * @return {?}
     */
    DialogPresetBuilder.prototype.addButton = function (css, caption, onClick) {
        var /** @type {?} */ btn = {
            cssClass: css,
            caption: caption,
            onClick: onClick
        };
        var /** @type {?} */ key = privateKey('buttons');
        ((this[key])).push(btn);
        return this;
    };
    /**
     * @param {?=} text
     * @return {?}
     */
    DialogPresetBuilder.prototype.addOkButton = function (text) {
        if (text === void 0) { text = 'OK'; }
        this.addButton('vex-dialog-button-primary vex-dialog-button vex-first', text, function (cmp, $event) { return cmp.dialog.close(cmp.dialog.context.defaultResult); });
        return this;
    };
    /**
     * @param {?=} text
     * @return {?}
     */
    DialogPresetBuilder.prototype.addCancelButton = function (text) {
        if (text === void 0) { text = 'CANCEL'; }
        this.addButton('vex-dialog-button-secondary vex-dialog-button vex-last', text, function (cmp, $event) { return cmp.dialog.dismiss(); });
        return this;
    };
    return DialogPresetBuilder;
}(VEXModalContextBuilder));
export { DialogPresetBuilder };
function DialogPresetBuilder_tsickle_Closure_declarations() {
    /**
     * the message to display on the modal.
     * @type {?}
     */
    DialogPresetBuilder.prototype.content;
}
//# sourceMappingURL=dialog-preset.js.map