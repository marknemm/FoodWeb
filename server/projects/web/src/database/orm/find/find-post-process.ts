import { OrmEntityMetadata } from '../entity-metadata/orm-entity-metadata';
import { postProcessFindOne } from '../findOne/find-one-post-process';

export function postProcessFind<E>(entityMeta: OrmEntityMetadata, entities: E[]): Promise<E[]> {
  return Promise.all(
    entities.map((entity: E) => postProcessFindOne(entityMeta, entity))
  );
}
