export class Food {
    constructor(
        public name?: string,
        public foodListingKey?: number,
        public donorOrganizationName?: string,
        public donorOrganizationAddress?: string,
        public donorOrganizationCity?: string,
        public donorOrganizationState?: string,
        public donorOrganizationZip?: number,
        public donorLastName?: string,
        public donorFirstName?: string,
        public donorDistance?: number,
        public foodTypeDescription?: string,
        public foodDescription?: string,
        public quantityClass?: string,
        public preishable?: boolean,
        public expirationDate?: string,
        public imgUrl?: string
    ){}
}