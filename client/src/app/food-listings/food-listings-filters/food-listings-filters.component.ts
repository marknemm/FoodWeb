import { Component, OnInit, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';

import { FoodListingsFilters } from "./food-listings-filters";


const now = new Date();


@Component({
    selector: 'app-food-listings-filters',
    templateUrl: './food-listings-filters.component.html',
    styleUrls: ['./food-listings-filters.component.css']
})
export class FoodListingsFiltersComponent implements OnInit {

    private quantityVals: string[];
    private tFrameVals: string[];
    private distVals: string[];

    @Input()
    private title: string = 'Filters';

    @Output()
    private filtersForm: FormGroup;

    constructor(private formBuilder: FormBuilder) {
        // Must be in the constructor so it is available in parent's ngOnInit() call!
        this.filtersForm = this.formBuilder.group({
            grain: true,
            meat: true,
            vegetable: true,
            fruit: true,
            drink: true,
            minExpireAfterDays: { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() },
            maxQuantity: null,
            maxDistance: null,
            perishable: true,
            notPerishable: true
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
    public addControl(name: string, control: AbstractControl) {
        this.filtersForm.addControl(name, control);
    }

    @Output()
    public onFiltersUpdate(callback) {
        this.filtersForm.valueChanges.subscribe(data => {
            callback(this.filtersForm.value);
        });
    }

    public getFilterValues(): FoodListingsFilters {
        return this.filtersForm.value;
    }
}
