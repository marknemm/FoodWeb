import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, FormControl } from '@angular/forms';

import { FoodListingsFilters } from "../../../../../shared/food-listings/food-listings-filters";
import { FoodTypesComponent } from "../food-types/food-types.component";


@Component({
    selector: 'app-food-listings-filters',
    templateUrl: './food-listings-filters.component.html',
    styleUrls: ['./food-listings-filters.component.css']
})
export class FoodListingsFiltersComponent implements OnInit {

    private quantityVals: string[];
    private tFrameVals: string[];
    private distVals: string[];
    private filtersForm: FormGroup;

    @Input() private header: string = 'Filters';
    @Input() private maxWidth: string = null;
    @Input() private defaultAvailableAfterDateNow: boolean = true;


    constructor(private formBuilder: FormBuilder) {
        // Must default initialize form so when referenced in parent, it is not null!
        this.filtersForm = new FormGroup({});
    }


    ngOnInit() {
        // Actual form group initialization requires Input to be evaluated, so must be in init!
        this.addControl('foodTypes', new FormControl(null));
        this.addControl('availableAfterDate', new FormControl(this.defaultAvailableAfterDateNow ? new Date() : null));
        this.addControl('perishable', new FormControl(true));
        this.addControl('notPerishable', new FormControl(true));

        this.quantityVals = ["Car", "Van", "Truck"];
        this.tFrameVals = ["0-6 Days", "6-12 Days", "12+ Days"];
        this.distVals = ["0-6 Miles", "6-12 Miles", "12+ Miles"];
    }


    /**
     * Adds a form control to the underlying filters form model.
     * @param name The name of the form control.
     * @param control The logical representation of the form control.
     */
    public addControl(name: string, control: AbstractControl): void {
        this.filtersForm.addControl(name, control);
    }


    /**
     * Called whenever there is an update to the filters. Will provide the caller with updated filter values via a callback function.
     * @param callback The callback function that will be given the updated filter values.
     * @param excludeDisabled Optionally set to true if caller does not want to get filter values pertaining to filters that
     *                        are not enabled or visible (due to a false *ngIf condition). Default is false (which means get these values).
     */
    public onFiltersUpdate(callback: (foodListingsFilters: FoodListingsFilters) => void, excludeDisabled: boolean = false): void {
        // Liisten for changes in all values excluding Food Types.
        this.filtersForm.valueChanges.subscribe((data: any) => {
            callback(this.genFilterValues(excludeDisabled));
        });
    }


    /**
     * Gets the current values of all filters.
     * @param excludeDisabled Optionally set to true if caller does not want to get filter values pertaining to filters that
     *                        are not enabled or visible (due to a false *ngIf condition). Default is false (which means get these values).
     * @return The retrieved filter values.
     */
    public getFilterValues(excludeDisabled: boolean = false): FoodListingsFilters {
        return this.genFilterValues(excludeDisabled);
    }


    /**
     * Gets the filter values according to the current state of the form and its associated form group (view model).
     * @param excludeDisabled Optionally set to true if caller does not want to get filter values pertaining to filters that
     *                        are not enabled or visible (due to a false *ngIf condition). Default is false (which means get these values).
     * @param foodTypes Optionally provide food types value that has already been obtained in the caller. Obtaining the food types value
     *                  is a bit more expensive than normally obaining form values since a transformation happens with the contained form
     *                  values. So, provide this value whenever possible.
     * @return The Food Listings filter values.
     */
    private genFilterValues(excludeDisabled: boolean = false, foodTypes?: string[]): FoodListingsFilters {
        return (excludeDisabled ? this.filtersForm.value : this.filtersForm.getRawValue());
    }
}
