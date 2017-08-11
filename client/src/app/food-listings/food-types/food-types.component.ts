import { Component, OnInit, Output } from '@angular/core';
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

    constructor(// private routerSnapshot: ActivatedRoute,
                private foodTypesService: FoodTypesService)
    {
        this.foodTypes = [];
        this.foodTypesForm = new FormGroup({});

        // this.foodTypes = this.routerSnapshot.data['value']['foodTypes'];

        /* Ideally, this should resolve immediately because of a resolver used in route to parent component! The Food Types should have
           already been fetched and cached from the server before this component was initialize and rendered, but just in case we will
           call getFoodTypes instead of directly getting results form ActiveRoute. */
        this.foodTypesService.getFoodTypes().subscribe((foodTypes: string[]) => {
            this.foodTypes = foodTypes;

            for (let i: number = 0; i < this.foodTypes.length; i++) {
                this.foodTypesForm.addControl(this.foodTypes[i], new FormControl(true));
            }
        });
    }

    ngOnInit() {}
    
    /**
     * Called whenever there is an update to the Food Types form controls. Will provide the caller with a (string) list of the selected Food Types.
     * @param callback The callback function that will be given the selected Food Types.
     */
    public onFoodTypesUpdate(callback: (foodTypes: string[]) => void): void {
        this.foodTypesForm.valueChanges.subscribe(data => {
            callback(this.getSelectedFoodTypes());
        });
    }

    /**
     * Gets the currently selected Food Types.
     * @return A list of the currently selected Food Types.
     */
    public getSelectedFoodTypes(): string[] {
        return this.foodTypesService.getFoodTypesAssocWithTrue(this.foodTypesForm.value);
    }
}
