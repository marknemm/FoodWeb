import { Donor } from './donor';
import { Receiver } from './receiver';
export { Donor, Receiver };

/**
 * Organization information that is assocaited with either a `Donor` or `Receiver` type account on the platform.
 */
export interface Organization {
  /**
   * The auto-generated integer ID of the organization.
   */
  id?: number;
  /**
   * The name of the organization/business.
   */
  name: string;
  /**
   * The description or mission statement of the organization.
   */
  description?: string;
  /**
   * The delivery instructions for the organization.
   * If the account type is `Donor`, then may consist of donation pickup instructions.
   * If the account type is `Receiver`, then may consist of donation drop-off instructions.
   */
  deliveryInstructions?: string;
  /**
   * The donor specific information, which will only be present for organizations associated with `Donor` type accounts.
   */
  donor?: Donor;
  /**
   * The receiver specific information, which will only be present for organizations associated with `Receiver` type accounts.
   */
  receiver?: Receiver;
}
