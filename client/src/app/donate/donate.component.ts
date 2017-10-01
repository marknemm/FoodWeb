import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, FormControl } from '@angular/forms';
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

        // If the window size goes below this threshold, then the cropper must be initialized below the optimal size of 300px.
        const thresholdCropperWidth: number = 367;
        this.cropperSettings = new CropperSettings();
        this.cropperSettings.width = (window.innerWidth < thresholdCropperWidth ? 300 - (thresholdCropperWidth - window.innerWidth)
                                                                                : 300);
        this.cropperSettings.height = this.cropperSettings.width;
        this.cropperSettings.croppedWidth = 300;
        this.cropperSettings.croppedHeight = 300;
        this.cropperSettings.canvasWidth = (this.cropperSettings.width + 20);
        this.cropperSettings.canvasHeight = this.cropperSettings.height;
        this.cropperSettings.noFileInput = true;
        this.cropperSettings.fileType = 'image/jpeg';

        this.foodTitleMaxLength = 100;

        this.foodForm = new FormGroup({});
    }


    public ngOnInit(): void {
        let foodListingUpload: FoodListingUpload = new FoodListingUpload();

        // Fill the form group view model based off of the properties found in FoodListingUpload.
        // This way, our view-model will always be in-sync with the shared object.
        for (let property in foodListingUpload) {

            if (foodListingUpload.hasOwnProperty(property)) {
                // All of these members are not included in the form view-model at first!
                if (    property === 'foodListingKey'
                    ||  property === 'imageUpload'
                    ||  property === 'availableUnitsCount'
                    ||  property === 'unitsLabel')
                { continue; }

                let validators: ValidatorFn[] = [ Validators.required ];

                // Add additional needed validators for email and password fields.
                switch(property) {
                    case 'foodTitle':       validators.push(Validators.maxLength(this.foodTitleMaxLength));     break;
                    case 'foodDescription': validators = null;                                                  break;
                }

                this.foodForm.addControl(property, new FormControl(null, validators));
            }

        }
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
     * Toggles the display of form controls for splitting the Donation into multiple units.
     */
    private toggleSplitIntoUnits(): void {
        if (this.isSplitIntoUnits()) {
            this.foodForm.removeControl('availableUnitsCount');
            this.foodForm.removeControl('unitsLabel');
        }
        else {
            this.foodForm.addControl('availableUnitsCount', new FormControl(null, [ Validators.required, Validators.min(1) ]));
            this.foodForm.addControl('unitsLabel', new FormControl(null, [ Validators.required ]));
        }
    }


    private isSplitIntoUnits(): boolean {
        return (this.foodForm.contains('availableUnitsCount') && this.foodForm.contains('unitsLabel'));
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
