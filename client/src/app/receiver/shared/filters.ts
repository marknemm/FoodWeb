export class Filters{
    constructor(
        public grain: boolean,
        public meat: boolean,
        public fruit: boolean,
        public vegetable: boolean,
        public drink: boolean,
        public perishable?: boolean,
        public notPerishable?: boolean,
        public minExpireAfterDays?: number,
        public maxQuantity?: number,
        public maxDistance?: number,
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