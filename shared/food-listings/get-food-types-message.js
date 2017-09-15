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
exports.__esModule = true;
var food_web_response_1 = require("../message-protocol/food-web-response");
// No request since this message does not require a request payload.
/**
 * The expected response from the server after the get food types operation.
 */
var GetFoodTypesResponse = /** @class */ (function (_super) {
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
         * Indicates if there is a need for the user to have their signup confirmed before performing certain functionality.
         */
        signupConfirmRequired) {
        if (loginRequired === void 0) { loginRequired = false; }
        if (signupConfirmRequired === void 0) { signupConfirmRequired = false; }
        var _this = _super.call(this, success, message, loginRequired, signupConfirmRequired) || this;
        _this.foodTypes = foodTypes;
        _this.success = success;
        _this.message = message;
        _this.loginRequired = loginRequired;
        _this.signupConfirmRequired = signupConfirmRequired;
        return _this;
    }
    return GetFoodTypesResponse;
}(food_web_response_1.FoodWebResponse));
exports.GetFoodTypesResponse = GetFoodTypesResponse;
