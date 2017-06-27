import { Component, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { DialogRef } from 'angular2-modal';
/**
 * A Dialog is a
 */
var VEXDialogButtons = (function () {
    function VEXDialogButtons() {
        /**
         * Emitted when a button was clicked
         */
        this.onButtonClick = new EventEmitter();
    }
    /**
     * @param {?} btn
     * @param {?} $event
     * @return {?}
     */
    VEXDialogButtons.prototype.onClick = function (btn, $event) {
        $event.stopPropagation();
        this.onButtonClick.emit({ btn: btn, $event: $event });
    };
    VEXDialogButtons.decorators = [
        { type: Component, args: [{
                    selector: 'vex-dialog-buttons',
                    encapsulation: ViewEncapsulation.None,
                    template: "<div class=\"vex-dialog-buttons\">\n    <button type=\"button\" \n         *ngFor=\"let btn of buttons;\"\n         [class]=\"btn.cssClass\"\n         (click)=\"onClick(btn, $event)\">{{btn.caption}}</button>\n</div>"
                },] },
    ];
    /**
     * @nocollapse
     */
    VEXDialogButtons.ctorParameters = function () { return []; };
    VEXDialogButtons.propDecorators = {
        'buttons': [{ type: Input },],
        'onButtonClick': [{ type: Output },],
    };
    return VEXDialogButtons;
}());
export { VEXDialogButtons };
function VEXDialogButtons_tsickle_Closure_declarations() {
    /** @type {?} */
    VEXDialogButtons.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    VEXDialogButtons.ctorParameters;
    /** @type {?} */
    VEXDialogButtons.propDecorators;
    /**
     * A collection of button configurations, each configuration is a button to display.
     * @type {?}
     */
    VEXDialogButtons.prototype.buttons;
    /**
     * Emitted when a button was clicked
     * @type {?}
     */
    VEXDialogButtons.prototype.onButtonClick;
}
/**
 * A Dialog with customized buttons wrapped in a form.
 *
 */
var DialogFormModal = (function () {
    /**
     * @param {?} dialog
     */
    function DialogFormModal(dialog) {
        this.dialog = dialog;
        this.context = dialog.context;
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    DialogFormModal.prototype.onButtonClick = function ($event) {
        $event.btn.onClick(this, $event.$event);
    };
    DialogFormModal.decorators = [
        { type: Component, args: [{
                    selector: 'modal-dialog',
                    encapsulation: ViewEncapsulation.None,
                    template: "<form class=\"vex-dialog-form\">\n    <ng-container *ngComponentOutlet=\"context.content\"></ng-container>\n    <vex-dialog-buttons [buttons]=\"context.buttons\"\n                        (onButtonClick)=\"onButtonClick($event)\"></vex-dialog-buttons>\n</form>"
                },] },
    ];
    /**
     * @nocollapse
     */
    DialogFormModal.ctorParameters = function () { return [
        { type: DialogRef, },
    ]; };
    return DialogFormModal;
}());
export { DialogFormModal };
function DialogFormModal_tsickle_Closure_declarations() {
    /** @type {?} */
    DialogFormModal.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    DialogFormModal.ctorParameters;
    /** @type {?} */
    DialogFormModal.prototype.context;
    /** @type {?} */
    DialogFormModal.prototype.dialog;
}
var FormDropIn = (function () {
    /**
     * @param {?} dialog
     */
    function FormDropIn(dialog) {
        this.dialog = dialog;
        this.context = dialog.context;
    }
    FormDropIn.decorators = [
        { type: Component, args: [{
                    selector: 'drop-in-dialog',
                    encapsulation: ViewEncapsulation.None,
                    template: "<div class=\"vex-dialog-message\">{{context.message}}</div>\n <div *ngIf=\"context.showInput\" class=\"vex-dialog-input\">\n   <input #input\n          autofocus\n          name=\"vex\" \n          type=\"text\" \n          class=\"vex-dialog-prompt-input\"\n           (change)=\"context.defaultResult = input.value\" \n          placeholder=\"{{context.placeholder}}\">\n </div>\n <div *ngIf=\"context.showCloseButton\" \n      [class]=\"context.closeClassName\"\n      (click)=\"dialog.dismiss()\"></div>"
                },] },
    ];
    /**
     * @nocollapse
     */
    FormDropIn.ctorParameters = function () { return [
        { type: DialogRef, },
    ]; };
    return FormDropIn;
}());
export { FormDropIn };
function FormDropIn_tsickle_Closure_declarations() {
    /** @type {?} */
    FormDropIn.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    FormDropIn.ctorParameters;
    /** @type {?} */
    FormDropIn.prototype.context;
    /** @type {?} */
    FormDropIn.prototype.dialog;
}
//# sourceMappingURL=dialog-form-modal.js.map