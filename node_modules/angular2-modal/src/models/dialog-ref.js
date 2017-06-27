import { Subject } from 'rxjs/Subject';
import { PromiseCompleter } from '../framework/utils';
import { DialogBailOutError } from '../models/errors';
/**
 * API to an open modal window.
 */
var DialogRef = (function () {
    /**
     * @param {?} overlay
     * @param {?=} context
     */
    function DialogRef(overlay, context) {
        this.overlay = overlay;
        this.context = context;
        this._resultDeferred = new PromiseCompleter();
        this._onDestroy = new Subject();
        this.onDestroy = this._onDestroy.asObservable();
    }
    Object.defineProperty(DialogRef.prototype, "result", {
        /**
         * A Promise that is resolved on a close event and rejected on a dismiss event.
         * @return {?}
         */
        get: function () {
            return this._resultDeferred.promise;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Set a close/dismiss guard
     * @param {?} guard
     * @return {?}
     */
    DialogRef.prototype.setCloseGuard = function (guard) {
        this.closeGuard = guard;
    };
    /**
     *  Close the modal with a return value, i.e: result.
     * @param {?=} result
     * @return {?}
     */
    DialogRef.prototype.close = function (result) {
        var _this = this;
        if (result === void 0) { result = null; }
        var /** @type {?} */ _close = function () {
            _this.destroy();
            _this._resultDeferred.resolve(result);
        };
        this._fireHook('beforeClose')
            .then(function (value) { return value !== true && _close(); })
            .catch(_close);
    };
    /**
     *  Close the modal without a return value, i.e: cancelled.
     *  This call is automatically invoked when a user either:
     *  - Presses an exit keyboard key (if configured).
     *  - Clicks outside of the modal window (if configured).
     *  Usually, dismiss represent a Cancel button or a X button.
     * @return {?}
     */
    DialogRef.prototype.dismiss = function () {
        var _this = this;
        var /** @type {?} */ _dismiss = function () {
            _this.destroy();
            _this._resultDeferred.promise.catch(function () { });
            _this._resultDeferred.reject();
        };
        this._fireHook('beforeDismiss')
            .then(function (value) { return value !== true && _dismiss(); })
            .catch(_dismiss);
    };
    /**
     * Gracefully close the overlay/dialog with a rejected result.
     * Does not trigger canDestroy on the overlay.
     * @return {?}
     */
    DialogRef.prototype.bailOut = function () {
        if (this.destroyed !== true) {
            this.destroyed = true;
            this._onDestroy.next(null);
            this._onDestroy.complete();
            this._resultDeferred.reject(new DialogBailOutError());
        }
    };
    /**
     * @return {?}
     */
    DialogRef.prototype.destroy = function () {
        var _this = this;
        if (this.destroyed !== true) {
            this.destroyed = true;
            if (typeof this.overlayRef.instance.canDestroy === 'function') {
                this.overlayRef.instance.canDestroy()
                    .catch(function () { })
                    .then(function () { return _this._destroy(); });
            }
            else {
                this._destroy();
            }
        }
    };
    /**
     * @return {?}
     */
    DialogRef.prototype._destroy = function () {
        this._onDestroy.next(null);
        this._onDestroy.complete();
        this.overlayRef.destroy();
    };
    /**
     * @template T
     * @param {?} name
     * @return {?}
     */
    DialogRef.prototype._fireHook = function (name) {
        var /** @type {?} */ gurad = this.closeGuard, /** @type {?} */ fn = gurad && typeof gurad[name] === 'function' && gurad[name];
        return Promise.resolve(fn ? fn.call(gurad) : false);
    };
    return DialogRef;
}());
export { DialogRef };
function DialogRef_tsickle_Closure_declarations() {
    /**
     * Reference to the overlay component ref.
     * @type {?}
     */
    DialogRef.prototype.overlayRef;
    /**
     * States if the modal is inside a specific element.
     * @type {?}
     */
    DialogRef.prototype.inElement;
    /** @type {?} */
    DialogRef.prototype.destroyed;
    /**
     * Fired before dialog is destroyed.
     * No need to unsubscribe, done automatically.
     * Note: Always called.
     * When called, overlayRef might or might not be destroyed.
     * @type {?}
     */
    DialogRef.prototype.onDestroy;
    /** @type {?} */
    DialogRef.prototype._resultDeferred;
    /** @type {?} */
    DialogRef.prototype._onDestroy;
    /** @type {?} */
    DialogRef.prototype.closeGuard;
    /** @type {?} */
    DialogRef.prototype.overlay;
    /** @type {?} */
    DialogRef.prototype.context;
}
//# sourceMappingURL=dialog-ref.js.map