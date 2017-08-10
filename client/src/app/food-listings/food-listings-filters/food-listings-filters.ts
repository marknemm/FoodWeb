import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export class FoodListingsFilters {
    constructor(
        public grain: boolean,
        public meat: boolean,
        public fruit: boolean,
        public vegetable: boolean,
        public drink: boolean,
        public perishable?: boolean,
        public notPerishable?: boolean,
        public minExpireAfterDays?: NgbDateStruct,
        public maxQuantity?: number,
        public maxDistance?: number,
        public retrievalOffset?: number,
        public retrievalAmount?: number
    ){}
    /*
    constructor(
        public foodType?: number[],
        public preishable?: boolean,
        public notPerishable?: boolean,
        public minExpireAfterDays?: number,
        public maxDistance?: number,
        public maxQuantity?: number
    ){}
    */
}