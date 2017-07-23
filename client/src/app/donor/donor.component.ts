import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  model: Food;
  perishableOptions: string[];
  foodTypeOptions: string[];
  forceValidation: boolean;
  submitted: boolean;
  dispUrl: string;

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

    this.model = new Food();
    this.perishableOptions = ['Perishable', 'Not Perishable'];
    this.foodTypeOptions = ['Grain', 'Meat', 'Fruit', 'Vegetable', 'Drink'];
  }

  ngOnInit() {
      this.foodForm = this.formBuilder.group({
        foodType:         [this.model.foodType, Validators.required],
        perishable:       [this.model.perishable, Validators.required],
        foodDescription:  [this.model.foodDescription, Validators.required],
        expirationDate:   [this.model.expirationDate, Validators.required]
      });
  }

  onFileChange(event) {
    var files = event.srcElement.files;
    this.model.image = event.srcElement.files[0];
    console.log(files);
  }

  shouldFireRequireValidation(validField): boolean {
    return validField.errors != null && validField.errors.required && (validField.dirty || this.forceValidation);
  }

  onSubmit({ value, valid }: { value: Food, valid: boolean }) {
    this.forceValidation = true;
    if (value.foodType != null && value.foodDescription != null && value.perishable != null && value.expirationDate != null) {
      this.model.foodType = value.foodType;
      this.model.foodDescription = value.foodDescription;
      this.model.perishable = value.perishable;
      this.model.expirationDate = value.expirationDate;
      var observer = this.donorPrimaryService.addFoodListing(this.model);
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
