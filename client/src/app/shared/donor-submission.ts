export class DonorSubmission {
    constructor(
        public postedByAppUserKey: number,
        public foodType: string,
        public perishable: boolean,
        public foodDescription: string,
        public expireDate: string,
        public image: string,
        public imageName: string
    )
    {}
}