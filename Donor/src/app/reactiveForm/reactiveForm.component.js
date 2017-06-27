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
var validation_service_1 = require("../shared/validation.service");
var hero_1 = require("../shared/hero");
var ReactiveFormComponent = (function () {
    function ReactiveFormComponent(formBuilder) {
        this.formBuilder = formBuilder;
        this.submitted = false;
    }
    ReactiveFormComponent.prototype.ngOnInit = function () {
        this.model = new hero_1.Hero(15, 'Dr IQ', 'Really Smart', 'Chuck Overstreet', 'iq@superhero.com');
        this.powers = ['Really Smart', 'Super Flexible',
            'Hypersound', 'Weather Changer'];
        this.heroForm = this.formBuilder.group({
            name: [this.model.name, forms_1.Validators.required],
            alterEgo: [this.model.alterEgo, forms_1.Validators.required],
            email: [this.model.email, [forms_1.Validators.required, validation_service_1.ValidationService.emailValidator]],
            power: [this.model.power, forms_1.Validators.required]
        });
    };
    ReactiveFormComponent.prototype.onSubmit = function (_a) {
        var value = _a.value, valid = _a.valid;
        this.submitted = true;
        this.submittedModel = value;
    };
    return ReactiveFormComponent;
}());
ReactiveFormComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'reactive-driven-form',
        templateUrl: 'reactiveForm.component.html'
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder])
], ReactiveFormComponent);
exports.ReactiveFormComponent = ReactiveFormComponent;
//# sourceMappingURL=reactiveForm.component.js.map