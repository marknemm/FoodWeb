import { Component, OnInit, NgModule, Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModule, NgbModal, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { Food } from './shared/food';
import { Filters } from './shared/filters';
import { ReceiverPrimaryService } from './receiver-primary.service';

const now = new Date();

const MODELS: Food[] = [
    {name: "Beef Stew",
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
    imgUrl: "https://i5.walmartimages.com/asr/4026d667-1824-48e3-acab-c46642521070_1.a0a61552b58949ce15a4990a2e02b050.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF"}
]

@Component({
  selector: 'app-receiver',
  templateUrl: './receiver.component.html',
  styleUrls: ['./receiver.component.css'],
  providers: [ReceiverPrimaryService]
})

export class ReceiverComponent implements OnInit {
  tester: any;
  models: Food[];
  selectedModel: Food;
  filters: Filters;
  filterForm: FormGroup;
  quantityVals: string[];
  tFrameVals: string[];
  distVals: string[];
  
  constructor(private formBuilder: FormBuilder,
  private receiverPrimaryService: ReceiverPrimaryService,
  private modalService: NgbModal) {}

  ngOnInit() {
    this.filters = new Filters(true, true, true, true, true, true, false, {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()}, 0, 0);

    this.onChange(this.filters);

    this.quantityVals = ["Car", "Van", "Truck"];
    this.tFrameVals = ["0-6 Days", "6-12 Days", "12+ Days"];
    this.distVals = ["0-6 Miles", "6-12 Miles", "12+ Miles"];

    this.filterForm = this.formBuilder.group({
      grain: this.filters.grain,
      meat: this.filters.meat,
      vegetable: this.filters.vegetable,
      fruit: this.filters.fruit,
      drink: this.filters.drink,
      minExpireAfterDays: this.filters.minExpireAfterDays,
      maxQuantity: this.filters.maxQuantity,
      maxDistance: this.filters.maxDistance,
      perishable: this.filters.perishable,
      notPerishable: this.filters.notPerishable
    });

    this.filterForm.valueChanges.subscribe(data => {
      this.onChange(this.filterForm.value);
    });
  }

  toggleFilters(filters: HTMLElement, filtersButton: HTMLElement) {
    var self = this;
    // Change translation amount based off of current state.
    if (filtersButton.textContent === '>') {
      // First calculate what our offset should be to move just the filters onto the page!
      filters.style.transform = 'translateX(' + filters.offsetWidth + 'px)';
      filtersButton.textContent = '<';
      filtersButton.style.right = '0px';
      // We have to handle position of filters panel when we resize the window.
      window.onresize = function() {
        self.tempDisableSmoothTranslate([filters, filtersButton]);
        // Moving from mobile to desktop filters panel style. Here we have to make sure we get rid of any translation that was applied!
        if (window.innerWidth > 1200) {
          filters.style.transform = 'none';
          filtersButton.textContent = '>';
          filtersButton.style.right = '-' + filtersButton.offsetWidth + 'px';
          window.onresize = undefined;
        }
        // Else if we are going 
        else {
          filters.style.transform = 'translateX(' + filters.offsetWidth + 'px)';
        }
      }
    }
    else {
      filters.style.transform = 'none';
      filtersButton.textContent = '>';
      filtersButton.style.right = '-' + filtersButton.offsetWidth + 'px';
      window.onresize = undefined;
    }
  }

  private tempDisableSmoothTranslate(elements: Array<HTMLElement>) {
    for (let i: number = 0; i < elements.length; i++) {
      let element: HTMLElement = elements[i];
      element.style.transition = undefined; // Stop the smooth translation with delay for an instant.
      // This shall run after we are finished with all of our processing!
      setTimeout(() => {element.style.transition = 'all 1s ease';}, 0);
    }
  }
  
  onChange(value: Filters) {
    //this.receiverPrimaryService.updateFeed(value).then(models => this.models = models);
    var observer = this.receiverPrimaryService.updateFeed(value);

    observer.subscribe(
      data => {
        //Apply Food model to data and store in this.models
        this.models = data as Food[];
      }
    );
    //this.models = MODELS;
  }

  selectItem(content, value: Food) {
    //For viewing specifics and taking a listing down from the server
    this.selectedModel = value;
    this.modalService.open(content).result.then((result) => {
      if (result === "Request click") {
        //Send item request to back end
      }
    })
  }
}
