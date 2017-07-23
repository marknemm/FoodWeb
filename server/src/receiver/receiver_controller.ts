/**
 *  Receiver Controller for handling of all Receiver requests. The 
 */  
'use strict';
import { ReceiverModel } from './receiver_model';
import { NextFunction, Request, Response } from 'express';


export class ReceiverController {

    private receiverModel : ReceiverModel;

    public constructor() {
        this.receiverModel = new ReceiverModel();
    }

    public getFoodListings(request: Request, response: Response) {
        response.setHeader('Content-Type', 'application/json');
        var promise = this.receiverModel.receiveData(request.body);
        promise.then((searchResult: Array<object>) => {
            response.send(JSON.stringify(searchResult));
        })
        .catch((err: Error) => {
            response.send(JSON.stringify([]))
        })
    }
};