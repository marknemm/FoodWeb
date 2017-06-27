import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ValidationService } from '../shared/validation.service';
import { Food } from '../shared/food';

@Component({
  moduleId: module.id,
  selector: 'food-form',
  templateUrl: 'foodForm.component.html'
})
export class FoodFormComponent implements OnInit {
  foodForm: FormGroup;
  model: Food;
  submittedModel: Food;
  pornp: string[];
  rornr: string[];
  submitted: boolean = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
      this.model = new Food(15, 'Spaghetti', '1', 'Bassett Park', 'Perishable', 'Not Refrigerated');

      this.pornp = ['Perishable', 'Not Perishable'];
      this.rornr = ['Refrigerated', 'Not Refrigerated'];

      this.foodForm = this.formBuilder.group({
        name:     [this.model.name, Validators.required],
        quantity: [this.model.quantity, Validators.required],
        location:    [this.model.location, Validators.required],
        pornp:    [this.model.pornp, Validators.required],
        rornr: [this.model.rornr, Validators.required]
      });
  }

  onSubmit({ value, valid }: { value: Food, valid: boolean }) {
    this.submitted = true;
    this.submittedModel = value;
  }
}
