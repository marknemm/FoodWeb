import { FeaturedEventEntity } from '~entity';
import { getOrmRepository } from '~orm';

/**
 * Reads the primary identification data for all featured events.
 * @return A promise that resolves to partial Featured Event entities containing only primary identification data.
 */
export function readFeaturedEventIdentifiers(): Promise<Partial<FeaturedEventEntity>[]> {
  return getOrmRepository(FeaturedEventEntity).find({
    select: ['id', 'title', 'date'],
    order: { id: 'DESC' }
  });
}
