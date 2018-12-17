export class UnregisteredClass {

    public str1: string;
    public int1: number;

    public constructor() {
        this.str1 = 'Unregistered string';
        this.int1 = 1111;
    }

    public logText(): void {
        console.log('I am not a registered deserializable class');
    }
}
