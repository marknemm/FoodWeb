import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, FormControl } from '@angular/forms';

import { FoodListingsFilters } from "./food-listings-filters";
import { FoodTypesComponent } from "../food-types/food-types.component";


@Component({
    selector: 'app-food-listings-filters',
    templateUrl: './food-listings-filters.component.html',
    styleUrls: ['./food-listings-filters.component.css']
})
export class FoodListingsFiltersComponent implements OnInit {

    private readonly now: Date = new Date();

    private quantityVals: string[];
    private tFrameVals: string[];
    private distVals: string[];

    @Input() private title: string = 'Filters';

    @Output() private filtersForm: FormGroup;

    @ViewChild('FoodTypesComponent') private foodTypesComponent: FoodTypesComponent


    constructor(private formBuilder: FormBuilder) {

        // Must be in the constructor so it is available in parent's ngOnInit() call!
        this.filtersForm = this.formBuilder.group({
            minExpireAfterDays: { year: this.now.getFullYear(), month: this.now.getMonth() + 1, day: this.now.getDate() },
            maxQuantity: null,
            maxDistance: null,
            perishable: new FormControl(true),
            notPerishable: new FormControl(true)
        });

        this.quantityVals = ["Car", "Van", "Truck"];
        this.tFrameVals = ["0-6 Days", "6-12 Days", "12+ Days"];
        this.distVals = ["0-6 Miles", "6-12 Miles", "12+ Miles"];
    }

    ngOnInit() {}

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
     */
    public onFiltersUpdate(callback: (foodListingsFilters: FoodListingsFilters) => void): void {
        this.filtersForm.valueChanges.subscribe((data: any) => {
            callback(this.genFilterValues());
        });
        this.foodTypesComponent.onFoodTypesUpdate((foodTypes: string[]) => {
            callback(this.genFilterValues(foodTypes));
        });
    }

    public getFilterValues(): FoodListingsFilters {
        return this.genFilterValues();
    }

    /**
     * Gets the filter values according to the current state of the form and its associated form group (view model).
     * @return The Food Listings filter values.
     */
    private genFilterValues(foodTypes?: string[]): FoodListingsFilters {
        let foodListingsFilters = this.filtersForm.value;
        // See if we have been passed foodTypes or if we need to retrieve them from the Food Types component.
        if (foodTypes == null)  foodListingsFilters.foodTypes = this.foodTypesComponent.getSelectedFoodTypes();
        else                    foodListingsFilters.foodTypes = foodTypes;
        return foodListingsFilters;
    }
}
