import { Component, OnInit, NgModule, Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Food } from './shared/food';
import { Filters } from './shared/filters';

const MODELS: Food[] = [
  { id: 0, name: "Beef Stew", iurl: "http://www.onceuponachef.com/images/2011/02/6a0115721bb963970b0147e234ca30970b-450wi.jpg",
    tframe: 0, quantity: 1, location: "NY", porn: true},
  { id: 1, name: "Noodles", iurl: "https://budgetbytes.com/wp-content/uploads/2009/12/Garlic-Noodles-front.jpg",
    tframe: 0, quantity: 1, location: "NY", porn: true},
  { id: 2, name: "Apple", iurl: "http://jonvilma.com/images/apple-16.jpg",
    tframe: 0, quantity: 1, location: "NY", porn: true},
  { id: 3, name: "Beef Stew", iurl: "http://www.onceuponachef.com/images/2011/02/6a0115721bb963970b0147e234ca30970b-450wi.jpg",
    tframe: 0, quantity: 1, location: "NY", porn: true},
  { id: 4, name: "Noodles", iurl: "https://budgetbytes.com/wp-content/uploads/2009/12/Garlic-Noodles-front.jpg",
    tframe: 0, quantity: 1, location: "NY", porn: true},
  { id: 5, name: "Apple", iurl: "http://jonvilma.com/images/apple-16.jpg",
    tframe: 0, quantity: 1, location: "NY", porn: true}
]

@Component({
  selector: 'app-receiver',
  templateUrl: './receiver.component.html',
  styleUrls: ['./receiver.component.css']
})

export class ReceiverComponent implements OnInit {
  
  models = MODELS;
  selectedModel: Food;
  filters: Filters;
  submittedFilters: Filters;
  filterForm: FormGroup;
  quantityVals: string[];
  tFrameVals: string[];
  
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.filters = new Filters([true, false, false], [true, false, false], [true, false]);

    this.quantityVals = ["car", "can", "truck"];
    this.tFrameVals = ["0-6 hours", "6-12 hours", "12+ hours"];

    this.filterForm = this.formBuilder.group({
      tFrame: this.filters.tFrame,
      tFrame0: this.filters.tFrame[0],
      tFrame1: this.filters.tFrame[1],
      tFrame2: this.filters.tFrame[2],
      quantity0: this.filters.quantity[0],
      quantity1: this.filters.quantity[1],
      quantity2: this.filters.quantity[2],
      pornp0: this.filters.pornp[0],
      pornp1: this.filters.pornp[1]
    });
  }
  
  onChange(value: Filters) {
    this.submittedFilters = value;
  }

  selectItem(value: Food) {
    this.selectedModel = value;
  }
}
