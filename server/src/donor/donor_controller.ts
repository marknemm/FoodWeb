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

    public addFoodListing(req, res) {
        var promise = this.donorModel.intepretData(req.body,req.file);
        promise.then(function(){
            res.send('Submitted!');
        }).catch(function(){
            res.send('Could not submit');
        });
    }

};