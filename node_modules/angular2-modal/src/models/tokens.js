export var DROP_IN_TYPE = {};
DROP_IN_TYPE.alert = 0;
DROP_IN_TYPE.prompt = 1;
DROP_IN_TYPE.confirm = 2;
DROP_IN_TYPE[DROP_IN_TYPE.alert] = "alert";
DROP_IN_TYPE[DROP_IN_TYPE.prompt] = "prompt";
DROP_IN_TYPE[DROP_IN_TYPE.confirm] = "confirm";
/**
 * @abstract
 */
var OverlayRenderer = (function () {
    function OverlayRenderer() {
    }
    /**
     * @abstract
     * @param {?} dialogRef
     * @param {?} vcRef
     * @param {?=} injector
     * @return {?}
     */
    OverlayRenderer.prototype.render = function (dialogRef, vcRef, injector) { };
    return OverlayRenderer;
}());
export { OverlayRenderer };
//# sourceMappingURL=tokens.js.map