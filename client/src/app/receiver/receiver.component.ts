import { Component, OnInit, NgModule, Injectable, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { NgbModule, NgbModal, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { Food } from './shared/food';
import { Filters } from './shared/filters';
import { UnclaimedFoodListingService } from './unclaimed-food-listings.service';

const appReceiverTagName = 'app-receiver';
const now = new Date();

const MODELS: Food[] = [
    {
        name: "Beef Stew",
        foodListingKey: 0,
        donorOrganizationName: "Stew's Stews",
        donorOrganizationAddress: "800 Beef Lane",
        donorOrganizationCity: "Williamsville",
        donorOrganizationState: "New York",
        donorOrganizationZip: 14221,
        donorLastName: "Stew",
        donorFirstName: "Steven",
        donorDistance: 6,
        foodTypeDescription: "Meat, Vegetable, Drink",
        foodDescription: "Quite the beefy stew...",
        preishable: true,
        expirationDate: "13/32/2017",
        quantityClass: "Car",
        imgUrl: "https://i5.walmartimages.com/asr/4026d667-1824-48e3-acab-c46642521070_1.a0a61552b58949ce15a4990a2e02b050.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF"
    }
]

@Component({
    selector: appReceiverTagName,
    templateUrl: './receiver.component.html',
    styleUrls: ['./receiver.component.css'],
    providers: [UnclaimedFoodListingService]
})
export class ReceiverComponent implements OnInit {
    models: Food[];
    selectedModel: Food;
    filterForm: FormGroup;

    @ViewChild('foodListingsFilters') foodListingsFilters;

    constructor(private formBuilder: FormBuilder,
                private unclaimedFoodListingService: UnclaimedFoodListingService,
                private modalService: NgbModal) { }

    ngOnInit() {
        this.filterForm = this.foodListingsFilters.filterForm;
        // This is how you would add the code behind for additional filters specific to the receiver form.
        // this.filterForm.addControl('dummyControl', new FormControl('dummy control'));

        this.filterForm.valueChanges.subscribe(data => {
            this.onChange(this.filterForm.value);
        });
        this.onChange(this.filterForm.value);
    }

    /**
     * Whenever our filterForm form group changes state, this method will be invoked.
     * @param value The current raw values of our filterForm form group abstract controls.
     */
    private onChange(value: Filters): void {
        //this.receiverPrimaryService.updateFeed(value).then(models => this.models = models);
        var observer = this.unclaimedFoodListingService.getUnclaimedFoodListings(value);

        observer.subscribe(
            data => {
                //Apply Food model to data and store in this.models
                this.models = data as Food[];
            }
        );
        //this.models = MODELS;
    }

    private selectItem(content, value: Food): void {
        //For viewing specifics and taking a listing down from the server
        this.selectedModel = value;
        this.modalService.open(content).result.then((result) => {
            if (result === "Request click") {
                //Send item request to back end
            }
        })
    }
}
