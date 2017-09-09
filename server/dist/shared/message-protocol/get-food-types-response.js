"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var food_web_response_1 = require("./food-web-response");
var GetFoodTypesResponse = (function (_super) {
    __extends(GetFoodTypesResponse, _super);
    function GetFoodTypesResponse(
        /**
         * A list of food types retrieved on the server.
         */
        foodTypes, 
        /**
         * Indicates whether or not the operation on the back end was successful.
         */
        success, 
        /**
         * A message containing information pertaining to what happened during processing on the back end. If successful, then it should
         * contain a simple success message. If unsuccessful, then it should contain the error message (without leaking sensitive data).
         */
        message, 
        /**
         * Indicates if there is a need for the user to login to perform the related operation on the server.
         */
        loginRequired, 
        /**
         * Indicates if there is a need for the user to associate with a donor organization to perform the related operation on the server.
         */
        donorRequired, 
        /**
         * Indicates if there is a need for the user to associate with a receiver organization to perform the related operation on the server.
         */
        receiverRequired) {
        if (loginRequired === void 0) { loginRequired = false; }
        if (donorRequired === void 0) { donorRequired = false; }
        if (receiverRequired === void 0) { receiverRequired = false; }
        var _this = _super.call(this, success, message, loginRequired, donorRequired, receiverRequired) || this;
        _this.foodTypes = foodTypes;
        _this.success = success;
        _this.message = message;
        _this.loginRequired = loginRequired;
        _this.donorRequired = donorRequired;
        _this.receiverRequired = receiverRequired;
        return _this;
    }
    return GetFoodTypesResponse;
}(food_web_response_1.FoodWebResponse));
exports.GetFoodTypesResponse = GetFoodTypesResponse;
//# sourceMappingURL=get-food-types-response.js.map