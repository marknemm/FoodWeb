"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var food_1 = require("../shared/food");
var FoodFormComponent = (function () {
    function FoodFormComponent(formBuilder) {
        this.formBuilder = formBuilder;
        this.submitted = false;
    }
    FoodFormComponent.prototype.ngOnInit = function () {
        this.model = new food_1.Food(15, 'Spaghetti', '1', 'Bassett Park', 'Perishable', 'Not Refrigerated');
        this.pornp = ['Perishable', 'Not Perishable'];
        this.rornr = ['Refrigerated', 'Not Refrigerated'];
        this.foodForm = this.formBuilder.group({
            name: [this.model.name, forms_1.Validators.required],
            quantity: [this.model.quantity, forms_1.Validators.required],
            location: [this.model.location, forms_1.Validators.required],
            pornp: [this.model.pornp, forms_1.Validators.required],
            rornr: [this.model.rornr, forms_1.Validators.required]
        });
    };
    FoodFormComponent.prototype.onSubmit = function (_a) {
        var value = _a.value, valid = _a.valid;
        this.submitted = true;
        this.submittedModel = value;
    };
    return FoodFormComponent;
}());
FoodFormComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'food-form',
        templateUrl: 'foodForm.component.html'
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder])
], FoodFormComponent);
exports.FoodFormComponent = FoodFormComponent;
//# sourceMappingURL=foodForm.component.js.map