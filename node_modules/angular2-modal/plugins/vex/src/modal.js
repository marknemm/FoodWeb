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
import { combineLatest } from 'rxjs/operator/combineLatest';
import { Injectable } from '@angular/core';
import { Overlay, DROP_IN_TYPE, Modal as Modal_, CSSBackdrop, CSSDialogContainer, PromiseCompleter } from 'angular2-modal';
import { DropInPresetBuilder } from './presets/dropin-preset';
// TODO: use DI factory for this.
// TODO: consolidate dup code
var /** @type {?} */ isDoc = !(typeof document === 'undefined' || !document);
var Modal = (function (_super) {
    __extends(Modal, _super);
    /**
     * @param {?} overlay
     */
    function Modal(overlay) {
        return _super.call(this, overlay) || this;
    }
    /**
     * @return {?}
     */
    Modal.prototype.alert = function () {
        return new DropInPresetBuilder(this, DROP_IN_TYPE.alert, /** @type {?} */ ({ isBlocking: false }));
    };
    /**
     * @return {?}
     */
    Modal.prototype.prompt = function () {
        return new DropInPresetBuilder(this, DROP_IN_TYPE.prompt, /** @type {?} */ ({
            isBlocking: true,
            keyboard: null
        }));
    };
    /**
     * @return {?}
     */
    Modal.prototype.confirm = function () {
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
    Modal.prototype.create = function (dialogRef, content, bindings) {
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
    Modal.decorators = [
        { type: Injectable },
    ];
    /**
     * @nocollapse
     */
    Modal.ctorParameters = function () { return [
        { type: Overlay, },
    ]; };
    return Modal;
}(Modal_));
export { Modal };
function Modal_tsickle_Closure_declarations() {
    /** @type {?} */
    Modal.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    Modal.ctorParameters;
}
//# sourceMappingURL=modal.js.map