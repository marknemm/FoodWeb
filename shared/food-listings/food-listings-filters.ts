import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
export { NgbDateStruct };

/**
 * A basic container for Food Listing filter data that may be sent to/from the server/client.
 */
export class FoodListingsFilters {
    constructor(
        public foodTypes?: string[],
        public perishable?: boolean,
        public notPerishable?: boolean,
        public minExpireAfterDays?: NgbDateStruct,
        public maxQuantity?: number,
        public maxDistance?: number,
        public retrievalOffset?: number,
        public retrievalAmount?: number
    ) { }
}
