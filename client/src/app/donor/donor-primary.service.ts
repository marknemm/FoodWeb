import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { DateFormatterPipe } from "../shared/date-formatter.pipe"
import { DonorSubmission } from "../shared/donor-submission"

import { Food } from '../shared/food';

@Injectable()
export class DonorPrimaryService {
    constructor(private http: Http,
                private dateFormatter: DateFormatterPipe) {}

    addFoodListing(foodListing: Food) {
        // This is uniform with object on Server. In future, will make a shared directory where these class definitions can uniformly reside!
        var donorSubmission: DonorSubmission = new DonorSubmission(
            null,
            foodListing.foodType,
            foodListing.perishable === 'Perishable',
            foodListing.foodDescription,
            this.dateFormatter.formatDate(foodListing.expirationDate),
            foodListing.image,
            null
        )
        var headers = new Headers({
            'Content-Type': 'application/json'
        });
        var observer: Observable<Response> = this.http.post('/donor/addFoodListing', JSON.stringify(donorSubmission), {headers: headers, withCredentials: true});
        return observer.map((response : Response) => {
            console.log(response);
            let feed = response.json();
            if (feed && feed.name) {
                console.log('Got feed response: ' + feed.name);
            }
            return name;
        });
    }
}