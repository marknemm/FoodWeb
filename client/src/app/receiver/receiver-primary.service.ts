import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Food } from './shared/food';
import { Filters } from './shared/filters';

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

@Injectable()
export class ReceiverPrimaryService {
    models: Food[];

    constructor(private http: Http) { }
    
    updateFeed(filterObj: Filters) {
      var observer : Observable<Response> = this.http.post('/receiver/filter',
      JSON.stringify({ filters: filterObj }))
      return observer.map((response : Response) =>
        {
          let feed = response.json();
          if (feed && feed.name) {
              console.log('Got feed response: ' + feed.name);
          }
          return name;
        }
      );
    }
    /*
    updateFeed(filterObj: Filters): Promise<Food[]> {
      return Promise.resolve(MODELS);
    }*/

}