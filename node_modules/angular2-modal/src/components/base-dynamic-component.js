import { Subject } from 'rxjs/Subject';
import { filter } from 'rxjs/operator/filter';
import { createComponent } from '../framework/createComponent';
var /** @type {?} */ BROWSER_PREFIX = ['webkit', 'moz', 'MS', 'o', ''];
/**
 * @param {?} eventName
 * @param {?} element
 * @param {?} cb
 * @return {?}
 */
function register(eventName, element, cb) {
    BROWSER_PREFIX.forEach(function (p) {
        element.addEventListener(p ? p + eventName : eventName.toLowerCase(), cb, false);
    });
}
/**
 * A base class for supporting dynamic components.
 * There are 3 main support areas:
 * 1 - Easy wrapper for dynamic styling via CSS classes and inline styles.
 * 2 - Easy wrapper for interception of transition/animation end events.
 * 3 - Easy wrapper for component creation and injection.
 *
 * Dynamic css is done via direct element manipulation (via renderer), it does not use change detection
 * or binding. This is to allow better control over animation.
 *
 * Animation support is limited, only transition/keyframes END even are notified.
 * The animation support is needed since currently the angular animation module is limited as well and
 * does not support CSS animation that are not pre-parsed and are not in the styles metadata of a component.
 *
 * Capabilities: Add/Remove styls, Add/Remove classes, listen to animation/transition end event,
 * add components
 */
var BaseDynamicComponent = (function () {
    /**
     * @param {?} el
     * @param {?} renderer
     */
    function BaseDynamicComponent(el, renderer) {
        this.el = el;
        this.renderer = renderer;
    }
    /**
     * @return {?}
     */
    BaseDynamicComponent.prototype.activateAnimationListener = function () {
        var _this = this;
        if (this.animationEnd)
            return;
        this.animationEnd = new Subject();
        this.animationEnd$ = this.animationEnd.asObservable();
        register('TransitionEnd', this.el.nativeElement, function (e) { return _this.onEnd(e); });
        register('AnimationEnd', this.el.nativeElement, function (e) { return _this.onEnd(e); });
    };
    /**
     * Set a specific inline style on the overlay host element.
     * @param {?} prop The style key
     * @param {?} value The value, undefined to remove
     * @return {?}
     */
    BaseDynamicComponent.prototype.setStyle = function (prop, value) {
        this.renderer.setElementStyle(this.el.nativeElement, prop, value);
        return this;
    };
    /**
     * @return {?}
     */
    BaseDynamicComponent.prototype.forceReflow = function () {
        this.el.nativeElement.offsetWidth;
    };
    /**
     * @param {?} css
     * @param {?=} forceReflow
     * @return {?}
     */
    BaseDynamicComponent.prototype.addClass = function (css, forceReflow) {
        var _this = this;
        if (forceReflow === void 0) { forceReflow = false; }
        css.split(' ')
            .forEach(function (c) { return _this.renderer.setElementClass(_this.el.nativeElement, c, true); });
        if (forceReflow)
            this.forceReflow();
    };
    /**
     * @param {?} css
     * @param {?=} forceReflow
     * @return {?}
     */
    BaseDynamicComponent.prototype.removeClass = function (css, forceReflow) {
        var _this = this;
        if (forceReflow === void 0) { forceReflow = false; }
        css.split(' ')
            .forEach(function (c) { return _this.renderer.setElementClass(_this.el.nativeElement, c, false); });
        if (forceReflow)
            this.forceReflow();
    };
    /**
     * @return {?}
     */
    BaseDynamicComponent.prototype.ngOnDestroy = function () {
        if (this.animationEnd && !this.animationEnd.closed) {
            this.animationEnd.complete();
        }
    };
    /**
     * @return {?}
     */
    BaseDynamicComponent.prototype.myAnimationEnd$ = function () {
        var _this = this;
        return filter.call(this.animationEnd$, function (e) { return e.target === _this.el.nativeElement; });
    };
    /**
     * Add a component, supply a view container ref.
     * Note: The components vcRef will result in a sibling.
     * @template T
     * @param {?} instructions
     * @return {?}
     */
    BaseDynamicComponent.prototype._addComponent = function (instructions) {
        var /** @type {?} */ cmpRef = createComponent(instructions);
        cmpRef.changeDetectorRef.detectChanges();
        return cmpRef;
    };
    /**
     * @param {?} event
     * @return {?}
     */
    BaseDynamicComponent.prototype.onEnd = function (event) {
        if (!this.animationEnd.closed) {
            this.animationEnd.next(event);
        }
    };
    return BaseDynamicComponent;
}());
export { BaseDynamicComponent };
function BaseDynamicComponent_tsickle_Closure_declarations() {
    /** @type {?} */
    BaseDynamicComponent.prototype.animationEnd$;
    /** @type {?} */
    BaseDynamicComponent.prototype.animationEnd;
    /** @type {?} */
    BaseDynamicComponent.prototype.el;
    /** @type {?} */
    BaseDynamicComponent.prototype.renderer;
}
//# sourceMappingURL=base-dynamic-component.js.map