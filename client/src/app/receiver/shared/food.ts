export class Food {
    constructor(
        public id?: number,
        public name?: string,
        public iurl?: string,
        public tframe?: number,
        public quantity?: number,
        public location?: string,
        public porn?: boolean
    ){}
    /*
    constructor(
        public foodListingKey?: number,
        public donorOrganizationName?: string,
        public donorOrganizationAddress?: string,
        public donorOrganizationCity?: string,
        public donorOrganizationState?: string,
        public donorOrganizationZip?: number,
        public donorLastName?: number,
        public donorFirstName?: number,
        public foodTypeDescription?: string,
        public foodDescription?: string,
        public preishable?: boolean,
        public expirationDate?: string,
        public imgUrl?: string
    ){}
    */
}