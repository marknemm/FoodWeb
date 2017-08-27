import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';

import { DonateService } from "./donate.service";
import { DateFormatterPipe } from "../common-util/date-formatter.pipe"

import { FoodTypesComponent } from "../food-listings/food-types/food-types.component";

import { FoodListingUpload } from "../../../../shared/food-listings/food-listing-upload";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";


@Component({
    moduleId: module.id,
    selector: 'donor',
    templateUrl: 'donor.component.html',
    providers: [DonateService],
    styleUrls: ['donor.component.css']
})
export class DonorComponent implements OnInit {
    foodForm: FormGroup;
    forceValidation: boolean;
    submitted: boolean;
    dispUrl: string;

    image: string;
    cropperSettings: CropperSettings;

    @ViewChild('FoodTypesComponent') private foodTypesComponent: FoodTypesComponent;

    constructor(
        private formBuilder: FormBuilder,
        private donateService: DonateService,
        private dateFormatter: DateFormatterPipe
    ) {
        // Want to force validators to process on submit. Non-text fields will only validate on submit too!
        this.forceValidation = false;
        this.submitted = false;

        this.cropperSettings = new CropperSettings();
        this.cropperSettings.width = 100;
        this.cropperSettings.height = 100;
        this.cropperSettings.croppedWidth = 100;
        this.cropperSettings.croppedHeight = 100;
        this.cropperSettings.canvasWidth = 400;
        this.cropperSettings.canvasHeight = 300;
    }

    ngOnInit() {
        this.foodForm = this.formBuilder.group({
            perishable: ['', Validators.required],
            foodDescription: ['', Validators.required],
            expirationDate: ['', Validators.required]
        });
    }

    private isValid(validField: AbstractControl): boolean {
        return validField.errors == null || (!validField.touched && !this.forceValidation);
    }

    private onSubmit({ value, valid }: { value: FoodListingUpload, valid: boolean }) {
        this.forceValidation = true;

        // Make sure we get all the selected Food Types.
        value.foodTypes = this.foodTypesComponent.getSelectedFoodTypes();

        if (valid) {
            let observer = this.donateService.addFoodListing(value, this.image);
            observer.subscribe(
                (valueKey: number) => {
                    // TODO: Add functionality for edit of added food listing using the returned key!
                    this.submitted = true;
                },
                (err: Error) => {
                    alert('An error has occured which caused your donation to fail.\nPlease contact Food Web for assistnace.\n\nThank-you.');
                    console.log(err);
                }
            );
        }
    }

    get perishable(): AbstractControl {
        return this.foodForm.controls.perishable;
    }

    get foodDescription(): AbstractControl {
        return this.foodForm.controls.foodDescription;
    }

    get expirationDate(): AbstractControl {
        return this.foodForm.controls.expirationDate;
    }
}
