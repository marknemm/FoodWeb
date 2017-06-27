import { combineLatest } from 'rxjs/operator/combineLatest';
import { Component, EventEmitter, Injectable, Input, NgModule, Output, ViewEncapsulation } from '@angular/core';
import { CSSBackdrop, CSSDialogContainer, DROP_IN_TYPE, DialogRef, Modal, ModalModule, ModalOpenContext, ModalOpenContextBuilder, Overlay, PromiseCompleter, arrayUnion, extend, privateKey } from 'angular2-modal';
import { CommonModule } from '@angular/common';

/**
 * A Dialog is a
 */
var VEXDialogButtons = /*@__PURE__*/(function () {
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
/**
 * A Dialog with customized buttons wrapped in a form.
 *
 */
var DialogFormModal = /*@__PURE__*/(function () {
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
var FormDropIn = /*@__PURE__*/(function () {
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

var __extends$3 = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var DEFAULT_VALUES$1 = {
    className: /** @type {?} */ ('default'),
    overlayClassName: 'vex-overlay',
    contentClassName: 'vex-content',
    closeClassName: 'vex-close'
};
var DEFAULT_SETTERS$2 = [
    'className',
    'overlayClassName',
    'contentClassName',
    'closeClassName',
    'showCloseButton'
];
var VEXModalContext = (function (_super) {
    __extends$3(VEXModalContext, _super);
    function VEXModalContext() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @return {?}
     */
    VEXModalContext.prototype.normalize = function () {
        if (!this.className) {
            this.className = DEFAULT_VALUES$1.className;
        }
        if (!this.overlayClassName) {
            this.overlayClassName = DEFAULT_VALUES$1.overlayClassName;
        }
        if (!this.contentClassName) {
            this.contentClassName = DEFAULT_VALUES$1.contentClassName;
        }
        if (!this.closeClassName) {
            this.closeClassName = DEFAULT_VALUES$1.closeClassName;
        }
        _super.prototype.normalize.call(this);
    };
    return VEXModalContext;
}(ModalOpenContext));
var VEXModalContextBuilder = (function (_super) {
    __extends$3(VEXModalContextBuilder, _super);
    /**
     * @param {?=} defaultValues
     * @param {?=} initialSetters
     * @param {?=} baseType
     */
    function VEXModalContextBuilder(defaultValues, initialSetters, baseType) {
        if (defaultValues === void 0) { defaultValues = undefined; }
        if (initialSetters === void 0) { initialSetters = undefined; }
        if (baseType === void 0) { baseType = undefined; }
        return _super.call(this, extend(DEFAULT_VALUES$1, defaultValues || {}), arrayUnion(DEFAULT_SETTERS$2, initialSetters || []), baseType || VEXModalContext // https://github.com/Microsoft/TypeScript/issues/7234
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

var __extends$2 = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var DEFAULT_SETTERS$1 = [
    'content'
];
/**
 * Data definition
 */
var DialogPreset = (function (_super) {
    __extends$2(DialogPreset, _super);
    function DialogPreset() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DialogPreset;
}(VEXModalContext));
/**
 * A Preset representing the configuration needed to open MessageModal.
 * This is an abstract implementation with no concrete behaviour.
 * Use derived implementation.
 */
var DialogPresetBuilder = (function (_super) {
    __extends$2(DialogPresetBuilder, _super);
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
        return _super.call(this, extend({ modal: modal, component: DialogFormModal, buttons: [], defaultResult: true }, defaultValues || {}), arrayUnion(DEFAULT_SETTERS$1, initialSetters || []), baseType || DialogPreset // https://github.com/Microsoft/TypeScript/issues/7234
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

var __extends$1 = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var DEFAULT_VALUES = {
    component: DialogFormModal,
    content: FormDropIn,
    okBtn: 'OK',
    cancelBtn: 'Cancel'
};
var DEFAULT_SETTERS = [
    'okBtn',
    'cancelBtn',
    'placeholder'
];
/**
 * Data definition
 */
var DropInPreset = (function (_super) {
    __extends$1(DropInPreset, _super);
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
/**
 * A Preset representing all 3 drop ins (alert, prompt, confirm)
 */
var DropInPresetBuilder = (function (_super) {
    __extends$1(DropInPresetBuilder, _super);
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
// TODO: use DI factory for this.
// TODO: consolidate dup code
var isDoc = !(typeof document === 'undefined' || !document);
var Modal$1 = (function (_super) {
    __extends(Modal$$1, _super);
    /**
     * @param {?} overlay
     */
    function Modal$$1(overlay) {
        return _super.call(this, overlay) || this;
    }
    /**
     * @return {?}
     */
    Modal$$1.prototype.alert = function () {
        return new DropInPresetBuilder(this, DROP_IN_TYPE.alert, /** @type {?} */ ({ isBlocking: false }));
    };
    /**
     * @return {?}
     */
    Modal$$1.prototype.prompt = function () {
        return new DropInPresetBuilder(this, DROP_IN_TYPE.prompt, /** @type {?} */ ({
            isBlocking: true,
            keyboard: null
        }));
    };
    /**
     * @return {?}
     */
    Modal$$1.prototype.confirm = function () {
        return new DropInPresetBuilder(this, DROP_IN_TYPE.confirm, /** @type {?} */ ({
            isBlocking: true,
            keyboard: null
        }));
    };
    /**
     * @param {?} dialogRef
     * @param {?} content
     * @param {?=} bindings
     * @return {?}
     */
    Modal$$1.prototype.create = function (dialogRef, content, bindings) {
        var _this = this;
        var /** @type {?} */ backdropRef = this.createBackdrop(dialogRef, CSSBackdrop);
        var /** @type {?} */ containerRef = this.createContainer(dialogRef, CSSDialogContainer, content, bindings);
        var /** @type {?} */ overlay = dialogRef.overlayRef.instance;
        var /** @type {?} */ backdrop = backdropRef.instance;
        var /** @type {?} */ container = containerRef.instance;
        dialogRef.inElement ? overlay.insideElement() : overlay.fullscreen();
        // add body class if this is the only dialog in the stack
        if (isDoc && !document.body.classList.contains('vex-open')) {
            document.body.classList.add('vex-open');
        }
        overlay.addClass("vex vex-theme-" + dialogRef.context.className);
        backdrop.addClass('vex-overlay');
        container.addClass(dialogRef.context.contentClassName);
        container.setStyle('display', 'block');
        if (dialogRef.inElement) {
            overlay.setStyle('padding', '0');
            container.setStyle('margin-top', '20px');
        }
        if (containerRef.location.nativeElement) {
            containerRef.location.nativeElement.focus();
        }
        if (dialogRef.context.className === 'bottom-right-corner') {
            overlay.setStyle('overflow-y', 'hidden');
            container.setStyle('position', 'absolute');
        }
        overlay.beforeDestroy(function () {
            overlay.addClass('vex-closing');
            var /** @type {?} */ completer = new PromiseCompleter();
            var /** @type {?} */ animationEnd$ = container.myAnimationEnd$();
            if (dialogRef.context.className !== 'bottom-right-corner') {
                animationEnd$ = combineLatest.call(animationEnd$, backdrop.myAnimationEnd$(), function (s1, s2) { return [s1, s2]; });
            }
            animationEnd$.subscribe(function (sources) {
                isDoc && _this.overlay.groupStackLength(dialogRef) === 1 && document.body.classList.remove('vex-open');
                completer.resolve();
            });
            return completer.promise;
        });
        overlay.setClickBoundary(containerRef.location.nativeElement);
        return dialogRef;
    };
    Modal$$1.decorators = [
        { type: Injectable },
    ];
    /**
     * @nocollapse
     */
    Modal$$1.ctorParameters = function () { return [
        { type: Overlay, },
    ]; };
    return Modal$$1;
}(Modal));

var providers = [
    { provide: Modal, useClass: Modal$1 },
    { provide: Modal$1, useClass: Modal$1 }
];
var VexModalModule = /*@__PURE__*/(function () {
    function VexModalModule() {
    }
    /**
     * @return {?}
     */
    VexModalModule.getProviders = function () {
        return providers;
    };
    VexModalModule.decorators = [
        { type: NgModule, args: [{
                    imports: [ModalModule, CommonModule],
                    declarations: [
                        VEXDialogButtons,
                        FormDropIn,
                        DialogFormModal
                    ],
                    providers: providers,
                    entryComponents: [
                        DialogFormModal,
                        FormDropIn
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    VexModalModule.ctorParameters = function () { return []; };
    return VexModalModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { Modal$1 as Modal, VEXModalContext, VEXModalContextBuilder, DropInPreset, DropInPresetBuilder, DialogFormModal, FormDropIn, VEXDialogButtons, DialogPreset, DialogPresetBuilder, VexModalModule, providers };
//# sourceMappingURL=angular2-modal-vex.es5.js.map
