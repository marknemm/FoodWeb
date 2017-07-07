'use strict';

import { DonorModel } from './donor_model';

/**
 * Donor Controller for handling of all Donor requests. 
 */
export class DonorController {

    private donorModel : DonorModel;

    public constructor() {
        this.donorModel = new DonorModel();
    }

    public addFoodListing() {
        this.donorModel.intepretData();
    }

};