import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';
import { Observable } from 'rxjs/Observable';

import { AddRemoveFoodListingService } from "../food-listings/add-remove-food-listing.service";
import { DateFormatterPipe } from "../common-util/date-formatter.pipe"

import { FoodTypesComponent } from "../food-listings/food-types/food-types.component";

import { FoodListingUpload } from "../../../../shared/food-listings/food-listing-upload";
import { Validation } from '../../../../shared/common-util/validation';
import { MdHorizontalStepper } from '@angular/material';


@Component({
    moduleId: module.id,
    selector: 'app-donate',
    templateUrl: 'donate.component.html',
    providers: [AddRemoveFoodListingService],
    styleUrls: ['donate.component.css']
})
export class DonateComponent implements OnInit {
    
    private foodForm: FormGroup;
    private forceValidation: boolean;
    private dispUrl: string;

    private image: string;
    private cropperSettings: CropperSettings;

    private foodTitleMaxLength: number;

    @ViewChild('cropper', undefined) private cropper: ImageCropperComponent;


    public constructor(
        private formBuilder: FormBuilder,
        private addRemoveFoodListingService: AddRemoveFoodListingService,
        private dateFormatter: DateFormatterPipe
    ) {
        // Want to force validators to process on submit. Non-text fields will only validate on submit too!
        this.forceValidation = false;

        this.cropperSettings = new CropperSettings();
        this.cropperSettings.width = 300;
        this.cropperSettings.height = 300;
        this.cropperSettings.croppedWidth = 300;
        this.cropperSettings.croppedHeight = 300;
        this.cropperSettings.canvasWidth = 320;
        this.cropperSettings.canvasHeight = 300;
        this.cropperSettings.noFileInput = true;
        this.cropperSettings.fileType = 'image/jpeg';

        this.foodTitleMaxLength = 100;
    }


    public ngOnInit(): void {
        this.foodForm = this.formBuilder.group({
            foodTitle: [null, [Validators.required, Validators.maxLength(this.foodTitleMaxLength)]],
            foodTypes: [null, Validators.required],
            perishable: [null, Validators.required],
            foodDescription: [null],
            availableUntilDate: [null, Validators.required]
        });
    }


    /**
     * Triggered whenever a file (image) is changed.
     * @param event The file change event.
     */
    private fileChangeListener(event): void {
        let image: HTMLImageElement = new Image();
        let file: File = event.target.files[0];
        let myReader: FileReader = new FileReader();
        let self = this;

        myReader.onloadend = (loadEvent: any) => {
            image.src = loadEvent.target.result;
            self.cropper.setImage(image);
        };
     
        myReader.readAsDataURL(file);
    }


    /**
     * Checks if a given form field/control is invalid.
     * @param validField The form field/control to check.
     * @return true if it is invalid, false if it is valid.
     */
    private isInvalid(validField: AbstractControl): boolean {
        return validField != null && validField.errors != null && (validField.touched || this.forceValidation);
    }


    /**
     * Checks if a form control is empty. An empty form control is either null or has a length of 0.
     * The form control's value must support the length property (strings and arrays for example) for this to work correctly.
     * @param formControl The form control to check.
     * @return true if the form control is empty, false if it is not empty.
     */
    private isFormControlEmpty(formControl: AbstractControl): boolean {
        return (formControl.value == null || formControl.value.length === 0)
    }


    /**
     * If the form is valid, then it will proceed to the confirmation display.
     * @param stepper The horizontal stepper that will be invoked to proceed to confirmation display if form is valid.
     */
    private ifValidProceedToReview(value: FoodListingUpload, valid: boolean, stepper: MdHorizontalStepper): void {
        this.forceValidation = true;
        if (valid)  stepper.next();
    }


    /**
     * Invoked whenever the donation is submitted (after final confirmation). Sends the new donation to the server.
     * @param value The raw value of the donation form.
     * @param valid The valid state of the donation form.
     * @param event The form submit event.
     */
    private submitDonation(value: FoodListingUpload, valid: boolean , stepper: MdHorizontalStepper): void {
        
        event.preventDefault();

        let self: DonateComponent = this;
        let observer: Observable<number> = this.addRemoveFoodListingService.addFoodListing(value, this.image);

        observer.subscribe(
            (foodListingKey: number) => {
                stepper.next();
            },
            (err: Error) => {
                alert('An error has occured which caused your donation to fail.\nPlease contact Food Web for assistnace.\n\nThank-you.');
                console.log(err);
            }
        );
    }


    /**
     * Refreshes the Donation Form, allowing the user to donate another item.
     */
    private donateAgain(stepper: MdHorizontalStepper): void {
        this.foodForm.reset();
        this.foodForm.markAsPristine();
        this.foodForm.markAsUntouched();
        this.cropper.reset();
        this.image = null;
        this.forceValidation = false;

        // Must go back 2 tabs to get to start.
        stepper.previous();
        stepper.previous();
    }


    /**
     * Allows the user to return to edit a Donation just after submitting it.
     */
    private editDonation(stepper: MdHorizontalStepper): void {
        this.forceValidation = false;
        stepper.previous();
    }
}
