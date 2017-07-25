'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var donor_model_1 = require("./donor_model");
/**
 * Donor Controller for handling of all Donor requests.
 */
var DonorController = (function () {
    function DonorController() {
        this.donorModel = new donor_model_1.DonorModel();
    }
    DonorController.prototype.addFoodListing = function (request, response) {
        response.setHeader('Content-Type', 'application/json');
        var donorSubmission = new donor_model_1.DonorSubmission(request.session['appUserKey'], request.body.foodType, request.body.perishable, request.body.foodDescription, request.body.expirationDate, request.body.image, null // The model will generate the image name and fill this for now!
        );
        var promise = this.donorModel.intepretData(donorSubmission);
        promise.then(function () {
            response.send({ success: true, message: 'Food listing added successfully' });
        })
            .catch(function () {
            response.send({ success: false, message: 'Error: food listing add failed' });
        });
    };
    return DonorController;
}());
exports.DonorController = DonorController;
;
//# sourceMappingURL=C:/Users/User Name/ConnectFood/server/dist/donor/donor_controller.js.map