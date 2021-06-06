import { getRepository } from 'typeorm';
import { DonationEntity } from '~entity';
import { GeneralStats } from '~shared';
import { env } from '~web/helpers/globals/env';

/**
 * Reads event registrations from the database.
 * @return A promise that resolves to the event registration query result.
 */
export async function readGeneralStats(): Promise<GeneralStats> {
  const stats: GeneralStats = await getRepository(DonationEntity).createQueryBuilder('donation')
    .select('COALESCE(COUNT(donation.id), 0)::INTEGER', 'totalDonations')
    .addSelect('COALESCE(SUM(donation.estimatedNumFeed), 0)::INTEGER', 'totalMeals')
    .where('donation.donationStatus = \'Complete\'')
    .getRawOne();
  if (env.UNRECORDED_DONATION_COUNT) {
    stats.totalDonations += env.UNRECORDED_DONATION_COUNT;
    stats.totalMeals += env.UNRECORDED_MEAL_COUNT;
  }
  return stats;
}
