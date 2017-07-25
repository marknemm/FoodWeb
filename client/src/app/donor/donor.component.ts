import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';

import { ValidationService } from '../shared/validation.service';
import { Food } from '../shared/food';
import { DonorPrimaryService } from "./donor-primary.service";
import { DateFormatterPipe } from "../shared/date-formatter.pipe"

@Component({
  moduleId: module.id,
  selector: 'donor',
  templateUrl: 'donor.component.html',
  providers: [ DonorPrimaryService ],
  styleUrls: [ 'donor.component.css' ]
})
export class DonorComponent implements OnInit {
  foodForm: FormGroup;
  perishableOptions: string[];
  foodTypeOptions: string[];
  forceValidation: boolean;
  submitted: boolean;
  dispUrl: string;

  image: string;
  cropperSettings: CropperSettings;

  constructor(private formBuilder: FormBuilder,
              private donorPrimaryService: DonorPrimaryService,
              private element: ElementRef,
              private dateFormatter: DateFormatterPipe)
  {
    // Want to force validators to process on submit. Non-text fields will only validate on submit too!
    this.forceValidation = false;
    this.submitted = false;

    this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = 100;
    this.cropperSettings.height = 100;
    this.cropperSettings.croppedWidth =100;
    this.cropperSettings.croppedHeight = 100;
    this.cropperSettings.canvasWidth = 400;
    this.cropperSettings.canvasHeight = 300;

    this.perishableOptions = ['Perishable', 'Not Perishable'];
    this.foodTypeOptions = ['Grain', 'Meat', 'Fruit', 'Vegetable', 'Drink'];
  }

  ngOnInit() {
      this.foodForm = this.formBuilder.group({
        foodType:         ['', Validators.required],
        perishable:       [''],
        foodDescription:  ['', Validators.required],
        expirationDate:   ['', Validators.required]
      });
  }

  shouldFireRequireValidation(validField: AbstractControl): boolean {
    return validField.errors != null && validField.errors.required && (validField.touched || this.forceValidation);
  }

  onSubmit({ value, valid }: { value: Food, valid: boolean }) {
    this.forceValidation = true;
    if (valid) {
      var observer = this.donorPrimaryService.addFoodListing(this.foodForm.getRawValue(), this.image);
      observer.subscribe(
        (success: boolean) => {
          this.submitted = true;
        },
        (error: Error) => {
          console.log(error);
          // Shouldn't happen!
        }
      );
    }
  }
}
