import { Component, OnInit, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
// import { ActivatedRoute } from "@angular/router";

import { FoodTypesService } from "./food-types.service";


@Component({
    selector: 'app-food-types',
    templateUrl: './food-types.component.html',
    styleUrls: ['./food-types.component.css']
})
export class FoodTypesComponent implements OnInit {

    private foodTypes: string[];
    private foodTypesForm: FormGroup;
    private foodTypesLoaded: boolean;

    /**
     * Determines if the Food Type checkboxes should initially be checked. Default is true.
     */
    @Input() private initiallyChecked: boolean = true;
    /**
     * The number of columns that the Food Types checkboxes will be displayed in. Default is 1, and make is 4.
     */
    @Input() private numColumns: number = 1;
    /**
     * Determines if at least one selection is required. Default is false.
     */
    @Input() private required: boolean = false;
    /**
     * Any extra required validation constraint. Ignored on default.
     */
    @Input() private extraValidation: boolean = true;

    
    constructor(// private routerSnapshot: ActivatedRoute,
                private foodTypesService: FoodTypesService)
    { 
        this.foodTypes = [];
        this.foodTypesForm = new FormGroup({});
        this.foodTypesLoaded = false;
    }


    ngOnInit() {
        // this.foodTypes = this.routerSnapshot.data['value']['foodTypes'];

        /* Ideally, this should resolve immediately because of a resolver used in route to parent component! The Food Types should have
           already been fetched and cached from the server before this component was initialize and rendered, but just in case we will
           call getFoodTypes instead of directly getting results form ActiveRoute. */
        this.foodTypesService.getFoodTypes().subscribe((foodTypes: string[]) => {
            this.foodTypes = foodTypes;

            for (let i: number = 0; i < this.foodTypes.length; i++) {
                this.foodTypesForm.addControl(this.foodTypes[i], new FormControl(this.initiallyChecked));
            }

            this.foodTypesLoaded = true;
            this.foodTypesForm.updateValueAndValidity(); // When finished adding all food type controls, then trigger a value update so callback will
                                                         // get the selected food types.
        });
    }
    

    /**
     * Called whenever there is an update to the Food Types form controls. Will provide the caller with a (string) list of the selected Food Types.
     * @param callback The callback function that will be given the selected Food Types.
     */
    public onFoodTypesUpdate(callback: (foodTypes: string[]) => void): void {
        this.foodTypesForm.valueChanges.subscribe(data => {
            /* Only signal callback that food types selection(s) have updated if they have been completely loaded. Otherwise, will fire every time
               a food type control is added in ngOnInit(). */
            if (this.foodTypesLoaded) {
                callback(this.getSelectedFoodTypes());
            }
        });
    }


    /**
     * Gets the currently selected Food Types.
     * @return A list of the currently selected Food Types.
     */
    public getSelectedFoodTypes(): string[] {
        return this.foodTypesService.getFoodTypesAssocWithTrue(this.foodTypesForm.value);
    }


    /**
     * Gets the number of selected Food Types.
     * @return The number of selected Food Types.
     */
    private numSelections(): number {
        return this.foodTypesService.getFoodTypesAssocWithTrue(this.foodTypesForm.value).length;
    }


    /**
     * Creates an array/range containing incremental integers representing each column (for *ngFor column iterations).
     * @return The array or range of column numbers.
     */
    private createColumnsRange(): number[] {
        return Array.from(Array(this.numColumns).keys());
    }


    /**
     * Creates an array/range containing incremental integers representing the Food Types array indexes of all Food Types that
     * should be placed in a given column.
     * @param column The column that the numeric range shall be generated for (columns are zero based!).
     * @return The array or range of Food Type indexes that are to be rendered in the column.
     */
    private createFoodTypesRange(column: number) {
        let range: number[] = [];

        /* Calculate the number of extra Food Types that must be added to the first column if the total number of Food TYpes is not
           evenly divisble by the number of columns! Also, all other ranges (column begins) must be offset by this amount! */
        let remainder: number = (this.foodTypes.length % this.numColumns);

        // Base range parameters off of number of columns specified by parent component and the number of Food Types from server.
        let rangeLength: number = Math.floor(this.foodTypes.length / this.numColumns);
        let rangeBegin: number = (column * rangeLength) + (column !== 0 ? remainder : 0);
        let rangeEnd: number = (rangeBegin + rangeLength) + (column === 0 ? remainder : 0);

        for (let i: number = rangeBegin; i < rangeEnd; i++) {
            range.push(i);
        }

        return range;
    }
}
