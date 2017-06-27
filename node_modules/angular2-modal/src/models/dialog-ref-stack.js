var /** @type {?} */ BASKET_GROUP = {};
/**
 * A dumb stack implementation over an array.
 */
var DialogRefStack = (function () {
    function DialogRefStack() {
        this._stack = [];
        this._stackMap = new Map();
    }
    Object.defineProperty(DialogRefStack.prototype, "length", {
        /**
         * @return {?}
         */
        get: function () {
            return this._stack.length;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} dialogRef
     * @param {?=} group
     * @return {?}
     */
    DialogRefStack.prototype.push = function (dialogRef, group) {
        if (this._stack.indexOf(dialogRef) === -1) {
            this._stack.push(dialogRef);
            this._stackMap.set(dialogRef, group || BASKET_GROUP);
        }
    };
    /**
     * Push a DialogRef into the stack and manage it so when it's done
     * it will automatically kick itself out of the stack.
     * @param {?} dialogRef
     * @param {?=} group
     * @return {?}
     */
    DialogRefStack.prototype.pushManaged = function (dialogRef, group) {
        var _this = this;
        this.push(dialogRef, group);
        dialogRef.onDestroy.subscribe(function () { return _this.remove(dialogRef); });
    };
    /**
     * @return {?}
     */
    DialogRefStack.prototype.pop = function () {
        var /** @type {?} */ dialogRef = this._stack.pop();
        this._stackMap.delete(dialogRef);
        return dialogRef;
    };
    /**
     * Remove a DialogRef from the stack.
     * @param {?} dialogRef
     * @return {?}
     */
    DialogRefStack.prototype.remove = function (dialogRef) {
        var /** @type {?} */ idx = this.indexOf(dialogRef);
        if (idx > -1) {
            this._stack.splice(idx, 1);
            this._stackMap.delete(dialogRef);
        }
    };
    /**
     * @param {?} index
     * @return {?}
     */
    DialogRefStack.prototype.index = function (index) {
        return this._stack[index];
    };
    /**
     * @param {?} dialogRef
     * @return {?}
     */
    DialogRefStack.prototype.indexOf = function (dialogRef) {
        return this._stack.indexOf(dialogRef);
    };
    /**
     * @param {?} dialogRef
     * @return {?}
     */
    DialogRefStack.prototype.groupOf = function (dialogRef) {
        return this._stackMap.get(dialogRef);
    };
    /**
     * @param {?} group
     * @return {?}
     */
    DialogRefStack.prototype.groupBy = function (group) {
        var /** @type {?} */ arr = [];
        if (group) {
            this._stackMap.forEach(function (value, key) {
                if (value === group) {
                    arr.push(key);
                }
            });
        }
        return arr;
    };
    /**
     * @param {?} group
     * @return {?}
     */
    DialogRefStack.prototype.groupLength = function (group) {
        var /** @type {?} */ count = 0;
        if (group) {
            this._stackMap.forEach(function (value, key) {
                if (value === group) {
                    count++;
                }
            });
        }
        return count;
    };
    return DialogRefStack;
}());
export { DialogRefStack };
function DialogRefStack_tsickle_Closure_declarations() {
    /** @type {?} */
    DialogRefStack.prototype._stack;
    /** @type {?} */
    DialogRefStack.prototype._stackMap;
}
//# sourceMappingURL=dialog-ref-stack.js.map