import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

export class FoodListing {
    constructor(
        public donorAppUserKey: number,
        public foodType: string,
        public perishable: boolean,
        public foodDescription: string,
        public expirationDate: NgbDateStruct,
        public image: string,
        public imageName: string
    )
    {}
}