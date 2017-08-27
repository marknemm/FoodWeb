import { Subscription } from "rxjs/Subscription";
import { IBusyConfig } from 'angular2-busy';


/**
 * Default configuration for a busy loading symbol when wating for responses.
 */
export class FoodWebBusyConfig implements IBusyConfig {

    public busy: Subscription;

    constructor(
        public message: string = 'Please Wait',
        public backdrop: boolean = true,
        public delay: number = 100,
        public minDuration: number = 0
    ) {
        this.busy = null;
    }
}