import { plainToClass } from 'class-transformer';
import { EntityManager, getConnection, Repository } from 'typeorm';
import { AccountEntity } from '~entity';
import { DonationHub, DonationHubPledge } from '~shared';
import { DonationHubPledgeEntity } from '~web/database/entity/donation-hub-pledge.entity';
import { readDonationHubPledge, readDonationHubPledges } from './read-donation-hub-pledges';
import { validateDonationHubPledge, validateDonationHubPledgeUpdatePrivilege } from './validate-donation-hub-pledge';

/**
 * Creates a new donation hub and saves it to the database.
 * @param donationHubPledge The donation hub pledge that is to be created.
 * @param myAccount The account of the user who is creating the donation hub pledge.
 * @param donationHubId The ID of the donation hub that the pledge is associated with.
 * @return A promise that resolves to the newly created donation hub pledge.
 */
export async function createDonationHubPledge(
  donationHubPledge: DonationHubPledge,
  myAccount: AccountEntity,
  donationHubId: number
): Promise<DonationHubPledgeEntity> {
  donationHubPledge.donationHub = <DonationHub>{ id: donationHubId };
  return getConnection().transaction(async (manager: EntityManager) =>
    _saveDonationHubPledge(manager, donationHubPledge, myAccount)
  );
}

/**
 * Updates a given donation hub pledge within the database.
 * @param donationHubPledge The donation hub pledge that is to be updated.
 * @param myAccount The account of the user who is updating the donation hub pledge.
 * @return A promise that resolves to the updated donation hub pledge.
 */
export async function updateDonationHubPledge(
  donationHubPledge: DonationHubPledge,
  myAccount: AccountEntity
): Promise<DonationHubPledgeEntity> {
  return getConnection().transaction(async (manager: EntityManager) => {
    validateDonationHubPledgeUpdatePrivilege(donationHubPledge, myAccount);
    const savedDonationHubPledge: DonationHubPledgeEntity = await _saveDonationHubPledge(
      manager, donationHubPledge, myAccount
    );
    return readDonationHubPledge(savedDonationHubPledge.id);
  });
}

/**
 * Saves a given donation hub pledge. The save operation serves as both a create & update operation.
 * @param manager The entity manager that will be used for the database save transaction.
 * @param donationHubPledge The donation hub pledge that is to be saved.
 * @param myAccount The account of the user who is saving the donation hub pledge.
 * @return A promise that resolves to the saved donation hub pledge.
 */
async function _saveDonationHubPledge(
  manager: EntityManager,
  donationHubPledge: DonationHubPledge,
  myAccount: AccountEntity
): Promise<DonationHubPledgeEntity> {
  const donationHubPledgeRepo: Repository<DonationHubPledgeEntity> = manager.getRepository(DonationHubPledgeEntity);
  const preppedDonationHubPledge: DonationHubPledgeEntity = await _prepareDonationHubPledge(donationHubPledge, myAccount);
  validateDonationHubPledge(preppedDonationHubPledge);
  return await donationHubPledgeRepo.save(preppedDonationHubPledge);
}

/**
 * Prepares a donation hub pledge before it is saved to the database.
 * @param donationHub The donation hub pledge that is to be prepared.
 * @param myAccount The account of the user that is saving the donation hub pledge.
 * @return The prepared donation hub pledge entity.
 */
async function _prepareDonationHubPledge(
  donationHubPledge: DonationHubPledge,
  myAccount: AccountEntity
): Promise<DonationHubPledgeEntity> {
  const preppedDonationHub: DonationHubPledgeEntity = plainToClass(DonationHubPledgeEntity, donationHubPledge);
  preppedDonationHub.account = myAccount;
  delete preppedDonationHub.createTimestamp;
  delete preppedDonationHub.updateTimestamp;
  return preppedDonationHub;
}
