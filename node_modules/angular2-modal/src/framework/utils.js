/**
 * Simple object extend
 * @template T
 * @param {?} m1
 * @param {?} m2
 * @return {?}
 */
export function extend(m1, m2) {
    var /** @type {?} */ m = ({});
    for (var /** @type {?} */ attr in m1) {
        if (m1.hasOwnProperty(attr)) {
            ((m))[attr] = ((m1))[attr];
        }
    }
    for (var /** @type {?} */ attr in m2) {
        if (m2.hasOwnProperty(attr)) {
            ((m))[attr] = ((m2))[attr];
        }
    }
    return m;
}
/**
 * Simple, not optimized, array union of unique values.
 * @template T
 * @param {?} arr1
 * @param {?} arr2
 * @return {?}
 */
export function arrayUnion(arr1, arr2) {
    return arr1
        .concat(arr2.filter(function (v) { return arr1.indexOf(v) === -1; }));
}
/**
 * Returns true if the config supports a given key.
 * @param {?} keyCode
 * @param {?} config
 * @return {?}
 */
export function supportsKey(keyCode, config) {
    if (!Array.isArray(config))
        return config === null ? false : true;
    return config.indexOf(keyCode) > -1;
}
/**
 * Given an object representing a key/value map of css properties, returns a valid css string
 * representing the object.
 * Example:
 * console.log(toStyleString({
 *     position: 'absolute',
 *     width: '100%',
 *     height: '100%',
 *     top: '0',
 *     left: '0',
 *     right: '0',
 *     bottom: '0'
 * }));
 * // position:absolute;width:100%;height:100%;top:0;left:0;right:0;bottom:0
 * @param {?} obj
 * @return {?}
 */
export function toStyleString(obj) {
    return Object.getOwnPropertyNames(obj)
        .map(function (k) { return k + ":" + obj[k]; })
        .join(';');
    // let objStr = JSON.stringify(obj);
    // return objStr.substr(1, objStr.length - 2)
    //     .replace(/,/g, ';')
    //     .replace(/"/g, '');
}
var PromiseCompleter = (function () {
    function PromiseCompleter() {
        var _this = this;
        this.promise = new Promise(function (res, rej) {
            _this.resolve = res;
            _this.reject = rej;
        });
    }
    return PromiseCompleter;
}());
export { PromiseCompleter };
function PromiseCompleter_tsickle_Closure_declarations() {
    /** @type {?} */
    PromiseCompleter.prototype.promise;
    /** @type {?} */
    PromiseCompleter.prototype.resolve;
    /** @type {?} */
    PromiseCompleter.prototype.reject;
}
/**
 * @return {?}
 */
export function noop() { }
//# sourceMappingURL=utils.js.map