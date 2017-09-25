import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';

import { AddRemoveFoodListingService } from "../food-listings/add-remove-food-listing.service";
import { DateFormatterPipe } from "../common-util/date-formatter.pipe"

import { FoodTypesComponent } from "../food-listings/food-types/food-types.component";

import { FoodListingUpload } from "../../../../shared/food-listings/food-listing-upload";
import { Validation } from '../../../../shared/common-util/validation';


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
    private submitted: boolean;
    private dispUrl: string;

    private image: string;
    private cropperSettings: CropperSettings;

    private foodTitleMaxLength: number;

    @ViewChild('cropper', undefined) private cropper: ImageCropperComponent;
    @ViewChild('FoodTypesComponent') private foodTypesComponent: FoodTypesComponent;


    constructor(
        private formBuilder: FormBuilder,
        private addRemoveFoodListingService: AddRemoveFoodListingService,
        private dateFormatter: DateFormatterPipe
    ) {
        // Want to force validators to process on submit. Non-text fields will only validate on submit too!
        this.forceValidation = false;
        this.submitted = false;

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


    ngOnInit() {
        this.foodForm = this.formBuilder.group({
            perishable: [null, Validators.required],
            foodTitle: ['', [Validators.required, Validators.maxLength(this.foodTitleMaxLength)]],
            foodDescription: [''],
            availableUntilDate: [null, Validators.required]
        });
    }


    fileChangeListener($event) {
        let image: HTMLImageElement = new Image();
        let file: File = $event.target.files[0];
        let myReader: FileReader = new FileReader();
        let self = this;

        myReader.onloadend = (loadEvent: any) => {
            image.src = loadEvent.target.result;
            self.cropper.setImage(image);
        };
     
        myReader.readAsDataURL(file);
    }


    private isInvalid(validField: AbstractControl): boolean {
        return validField != null && validField.errors != null && (validField.touched || this.forceValidation);
    }


    private onSubmit({ value, valid }: { value: FoodListingUpload, valid: boolean }, event: Event) {
        event.preventDefault();
        this.forceValidation = true;

        // Make sure we get all the selected Food Types.
        value.foodTypes = this.foodTypesComponent.getSelectedFoodTypes();
        valid = (valid && value.foodTypes.length !== 0);

        if (valid) {
            let observer = this.addRemoveFoodListingService.addFoodListing(value, this.image);
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


    private donateAgain(): void {
        this.foodForm.reset();
        this.foodForm.markAsPristine();
        this.foodForm.markAsUntouched();
        this.foodTypesComponent.reset();
        this.cropper.reset();
        this.forceValidation = false;
        this.submitted = false;
    }
}
