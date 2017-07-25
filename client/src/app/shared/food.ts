import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

export class Food {

  constructor (
    public foodType?: string,
    public perishable?: boolean,
    public foodDescription?: string,
    public expirationDate?: NgbDateStruct,
    public image?: string
  )
  {}

};
