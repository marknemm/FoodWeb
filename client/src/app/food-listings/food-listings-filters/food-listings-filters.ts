import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

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
    ){}
}