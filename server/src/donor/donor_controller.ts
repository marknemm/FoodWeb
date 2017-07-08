'use strict';

import { DonorModel } from './donor_model';
import { NextFunction, Request, Response } from 'express';


/**
 * Donor Controller for handling of all Donor requests. 
 */
export class DonorController {

    private donorModel : DonorModel;

    public constructor() {
        this.donorModel = new DonorModel();
    }

    public addFoodListing(request, response) {
        var donorsubmission = request.body()
        this.donorModel.intepretData(donorsubmission);
    }

};