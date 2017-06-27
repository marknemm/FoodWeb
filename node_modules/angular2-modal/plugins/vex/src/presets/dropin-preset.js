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
import { DROP_IN_TYPE, extend } from 'angular2-modal';
import { DialogFormModal as component, FormDropIn as content } from '../dialog-form-modal';
import { DialogPreset, DialogPresetBuilder } from './dialog-preset';
var /** @type {?} */ DEFAULT_VALUES = {
    component: component,
    content: content,
    okBtn: 'OK',
    cancelBtn: 'Cancel'
};
var /** @type {?} */ DEFAULT_SETTERS = [
    'okBtn',
    'cancelBtn',
    'placeholder'
];
/**
 * Data definition
 */
var DropInPreset = (function (_super) {
    __extends(DropInPreset, _super);
    function DropInPreset() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(DropInPreset.prototype, "showInput", {
        /**
         * @return {?}
         */
        get: function () {
            return this.dropInType === DROP_IN_TYPE.prompt;
        },
        enumerable: true,
        configurable: true
    });
    return DropInPreset;
}(DialogPreset));
export { DropInPreset };
function DropInPreset_tsickle_Closure_declarations() {
    /**
     * the message to display on the modal.
     * @type {?}
     */
    DropInPreset.prototype.message;
    /**
     * OK button caption.
     * Default: OK
     * Set to false ('', undefined, null, false) to remove button.
     * @type {?}
     */
    DropInPreset.prototype.okBtn;
    /**
     * Cancel button caption.
     * Default: Cancel
     * Set to false ('', undefined, null, false) to remove button.
     * @type {?}
     */
    DropInPreset.prototype.cancelBtn;
    /**
     * A placeholder for the input element.
     * Valid only for prompt modal.
     * @type {?}
     */
    DropInPreset.prototype.placeholder;
    /** @type {?} */
    DropInPreset.prototype.dropInType;
}
/**
 * A Preset representing all 3 drop ins (alert, prompt, confirm)
 */
var DropInPresetBuilder = (function (_super) {
    __extends(DropInPresetBuilder, _super);
    /**
     * @param {?} modal
     * @param {?} dropInType
     * @param {?=} defaultValues
     */
    function DropInPresetBuilder(modal, dropInType, defaultValues) {
        if (defaultValues === void 0) { defaultValues = undefined; }
        return _super.call(this, modal, extend(extend({ modal: modal, dropInType: dropInType }, DEFAULT_VALUES), defaultValues || {}), DEFAULT_SETTERS, DropInPreset) || this;
    }
    /**
     * @param {?} config
     * @return {?}
     */
    DropInPresetBuilder.prototype.$$beforeOpen = function (config) {
        if (config.okBtn) {
            this.addOkButton(config.okBtn);
        }
        switch (config.dropInType) {
            case DROP_IN_TYPE.prompt:
                config.defaultResult = undefined;
            case DROP_IN_TYPE.confirm:
                if (config.cancelBtn) {
                    this.addCancelButton(config.cancelBtn);
                }
                break;
        }
        return _super.prototype.$$beforeOpen.call(this, config);
    };
    return DropInPresetBuilder;
}(DialogPresetBuilder));
export { DropInPresetBuilder };
function DropInPresetBuilder_tsickle_Closure_declarations() {
    /**
     * the message to display on the modal.
     * @type {?}
     */
    DropInPresetBuilder.prototype.message;
    /**
     * The default Ok button caption.
     * @type {?}
     */
    DropInPresetBuilder.prototype.okBtn;
    /**
     * The default Cancel button caption.
     * @type {?}
     */
    DropInPresetBuilder.prototype.cancelBtn;
    /**
     * A placeholder for the input element.
     * Valid only for prompt modal.
     * @type {?}
     */
    DropInPresetBuilder.prototype.placeholder;
}
//# sourceMappingURL=dropin-preset.js.map