import { Donor } from './donor';
import { Receiver } from './receiver';
export { Donor, Receiver };

export interface Organization {
  id?: number;
  name: string;
  description?: string;
  deliveryInstructions?: string;
  donor?: Donor;
  receiver?: Receiver;
}