import { Component, ViewEncapsulation } from '@angular/core';
import { DialogRef } from 'angular2-modal';
var BSMessageModalTitle = (function () {
    /**
     * @param {?} dialog
     */
    function BSMessageModalTitle(dialog) {
        this.dialog = dialog;
        this.context = dialog.context;
    }
    Object.defineProperty(BSMessageModalTitle.prototype, "titleHtml", {
        /**
         * @return {?}
         */
        get: function () {
            return this.context.titleHtml ? 1 : 0;
        },
        enumerable: true,
        configurable: true
    });
    BSMessageModalTitle.decorators = [
        { type: Component, args: [{
                    selector: 'modal-title',
                    encapsulation: ViewEncapsulation.None,
                    template: "<div [ngClass]=\"context.headerClass\" [ngSwitch]=\"titleHtml\">\n      <button *ngIf=\"context.showClose\" type=\"button\" class=\"close\" \n              aria-label=\"Close\" (click)=\"dialog.dismiss()\">\n          <span aria-hidden=\"true\">\u00D7</span>\n      </button>\n      <div *ngSwitchCase=\"1\" [innerHtml]=\"context.titleHtml\"></div>\n      <h3 *ngSwitchDefault class=\"modal-title\">{{context.title}}</h3>\n </div>"
                },] },
    ];
    /**
     * @nocollapse
     */
    BSMessageModalTitle.ctorParameters = function () { return [
        { type: DialogRef, },
    ]; };
    return BSMessageModalTitle;
}());
export { BSMessageModalTitle };
function BSMessageModalTitle_tsickle_Closure_declarations() {
    /** @type {?} */
    BSMessageModalTitle.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    BSMessageModalTitle.ctorParameters;
    /** @type {?} */
    BSMessageModalTitle.prototype.context;
    /** @type {?} */
    BSMessageModalTitle.prototype.dialog;
}
var BSMessageModalBody = (function () {
    /**
     * @param {?} dialog
     */
    function BSMessageModalBody(dialog) {
        this.dialog = dialog;
        this.context = dialog.context;
    }
    BSMessageModalBody.decorators = [
        { type: Component, args: [{
                    selector: 'modal-body',
                    encapsulation: ViewEncapsulation.None,
                    styles: [".form-group {\n    margin-top: 10px;\n  }"],
                    template: "<div [ngClass]=\"context.bodyClass\"> \n    <div [innerHtml]=\"context.message\"></div>\n      <div *ngIf=\"context.showInput\" class=\"form-group\">\n        <input autofocus #input\n            name=\"bootstrap\" \n            type=\"text\" \n            class=\"form-control\"\n            [value]=\"context.defaultValue\"\n            (change)=\"context.defaultValue = input.value\"  \n            placeholder=\"{{context.placeholder}}\">\n      </div>\n    </div>\n"
                },] },
    ];
    /**
     * @nocollapse
     */
    BSMessageModalBody.ctorParameters = function () { return [
        { type: DialogRef, },
    ]; };
    return BSMessageModalBody;
}());
export { BSMessageModalBody };
function BSMessageModalBody_tsickle_Closure_declarations() {
    /** @type {?} */
    BSMessageModalBody.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    BSMessageModalBody.ctorParameters;
    /** @type {?} */
    BSMessageModalBody.prototype.context;
    /** @type {?} */
    BSMessageModalBody.prototype.dialog;
}
/**
 * Represents the modal footer for storing buttons.
 */
var BSModalFooter = (function () {
    /**
     * @param {?} dialog
     */
    function BSModalFooter(dialog) {
        this.dialog = dialog;
    }
    /**
     * @param {?} btn
     * @param {?} $event
     * @return {?}
     */
    BSModalFooter.prototype.onClick = function (btn, $event) {
        $event.stopPropagation();
        btn.onClick(this, $event);
    };
    BSModalFooter.decorators = [
        { type: Component, args: [{
                    selector: 'modal-footer',
                    encapsulation: ViewEncapsulation.None,
                    template: "<div [ngClass]=\"dialog.context.footerClass\">\n    <button *ngFor=\"let btn of dialog.context.buttons;\"\n            [ngClass]=\"btn.cssClass\"\n            (click)=\"onClick(btn, $event)\">{{btn.caption}}</button>\n</div>"
                },] },
    ];
    /**
     * @nocollapse
     */
    BSModalFooter.ctorParameters = function () { return [
        { type: DialogRef, },
    ]; };
    return BSModalFooter;
}());
export { BSModalFooter };
function BSModalFooter_tsickle_Closure_declarations() {
    /** @type {?} */
    BSModalFooter.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    BSModalFooter.ctorParameters;
    /** @type {?} */
    BSModalFooter.prototype.dialog;
}
/**
 * A Component representing a generic bootstrap modal content element.
 *
 * By configuring a MessageModalContext instance you can:
 *
 *  Header:
 *      - Set header container class (default: modal-header)
 *      - Set title text (enclosed in H3 element)
 *      - Set title html (overrides text)
 *
 *  Body:
 *      - Set body container class.  (default: modal-body)
 *      - Set body container HTML.
 *
 *  Footer:
 *      - Set footer class.  (default: modal-footer)
 *      - Set button configuration (from 0 to n)
 */
var BSMessageModal = (function () {
    /**
     * @param {?} dialog
     */
    function BSMessageModal(dialog) {
        this.dialog = dialog;
    }
    BSMessageModal.decorators = [
        { type: Component, args: [{
                    selector: 'modal-content',
                    encapsulation: ViewEncapsulation.None,
                    template: "<modal-title></modal-title><modal-body></modal-body><modal-footer></modal-footer>"
                },] },
    ];
    /**
     * @nocollapse
     */
    BSMessageModal.ctorParameters = function () { return [
        { type: DialogRef, },
    ]; };
    return BSMessageModal;
}());
export { BSMessageModal };
function BSMessageModal_tsickle_Closure_declarations() {
    /** @type {?} */
    BSMessageModal.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    BSMessageModal.ctorParameters;
    /** @type {?} */
    BSMessageModal.prototype.dialog;
}
//# sourceMappingURL=message-modal.component.js.map