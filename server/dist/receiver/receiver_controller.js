/**
 *  Receiver Controller for handling of all Receiver requests. The
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var receiver_model_1 = require("./receiver_model");
var ReceiverController = (function () {
    function ReceiverController() {
        this.receiverModel = new receiver_model_1.ReceiverModel();
    }
    ReceiverController.prototype.getFoodListings = function (request, response) {
        response.setHeader('Content-Type', 'application/json');
        var promise = this.receiverModel.receiveData(request.body);
        promise.then(function (searchResult) {
            response.send(JSON.stringify(searchResult));
        })
            .catch(function (err) {
            response.send(JSON.stringify([]));
        });
    };
    return ReceiverController;
}());
exports.ReceiverController = ReceiverController;
;
//# sourceMappingURL=C:/Users/User Name/ConnectFood/server/dist/receiver/receiver_controller.js.map