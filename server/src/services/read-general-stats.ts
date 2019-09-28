import { getRepository } from 'typeorm';
import { DonationEntity } from '../entity/donation.entity';
import { GeneralStats } from '../../../shared/src/interfaces/heuristics/general-stats';

/**
 * Reads event registrations from the database.
 * @return A promise that resolves to the event registration query result.
 */
export function readGeneralStats(): Promise<GeneralStats> {
  return getRepository(DonationEntity).createQueryBuilder('donation')
    .select('COALESCE(COUNT(donation.id), 0)', 'totalDonations')
    .addSelect('COALESCE(SUM(donation.estimatedNumFeed), 0)', 'totalMeals')
    .where('donation.donationStatus = \'Complete\'')
    .getRawOne();
}
