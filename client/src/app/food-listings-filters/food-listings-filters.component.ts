import { Component, OnInit, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';


const now = new Date();


@Component({
    selector: 'app-food-listings-filters',
    templateUrl: './food-listings-filters.component.html',
    styleUrls: ['./food-listings-filters.component.css']
})
export class FoodListingsFiltersComponent implements OnInit {

    private filterForm: FormGroup;
    private quantityVals: string[];
    private tFrameVals: string[];
    private distVals: string[];

    @Input()
    title: string = 'Filters';

    @Output()
    filtersForm: FormGroup = this.filtersForm;

    constructor(private formBuilder: FormBuilder) {
        this.filterForm = this.formBuilder.group({
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
    }

    ngOnInit() {
        this.quantityVals = ["Car", "Van", "Truck"];
        this.tFrameVals = ["0-6 Days", "6-12 Days", "12+ Days"];
        this.distVals = ["0-6 Miles", "6-12 Miles", "12+ Miles"];
    }

}
