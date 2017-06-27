var /** @type {?} */ vcRefCollection = {};
/**
 * @param {?} key
 * @return {?}
 */
function getVCRef(key) {
    return vcRefCollection[key] ? vcRefCollection[key].slice() : [];
}
/**
 * @param {?} key
 * @param {?} vcRef
 * @return {?}
 */
function setVCRef(key, vcRef) {
    if (!vcRefCollection.hasOwnProperty(key)) {
        vcRefCollection[key] = [];
    }
    vcRefCollection[key].push(vcRef);
}
/**
 * @param {?} key
 * @param {?=} vcRef
 * @return {?}
 */
function delVCRef(key, vcRef) {
    if (!vcRef) {
        vcRefCollection[key] = [];
    }
    else {
        var /** @type {?} */ coll = vcRefCollection[key] || [], /** @type {?} */ idx = coll.indexOf(vcRef);
        if (idx > -1) {
            coll.splice(idx, 1);
        }
    }
}
/**
 * A Simple store that holds a reference to ViewContainerRef instances by a user defined key.
 * This, with the OverlayTarget directive makes it easy to block the overlay inside an element
 * without having to use the angular query boilerplate.
 *  getVCRef: (function(string): ViewContainerRef),
 *  setVCRef: (function(string, ViewContainerRef): void),
 *  delVCRef: (function(string): void)
 *  }}
 */
export var vcRefStore = { getVCRef: getVCRef, setVCRef: setVCRef, delVCRef: delVCRef };
//# sourceMappingURL=vc-ref-store.js.map