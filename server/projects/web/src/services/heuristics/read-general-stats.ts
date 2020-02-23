import 'dotenv';
import { getRepository } from 'typeorm';
import { DonationEntity } from 'database/src/entity/donation.entity';
import { GeneralStats } from '~shared';

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
  if (process.env.UNRECORDED_DONATION_COUNT) {
    stats.totalDonations += parseInt(process.env.UNRECORDED_DONATION_COUNT, 10);
    stats.totalMeals += parseInt(process.env.UNRECORDED_MEAL_COUNT, 10);
  }
  return stats;
}
