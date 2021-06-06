import { EntityManager, EntityTarget, getConnection, Repository } from 'typeorm';
import { OrmRepository } from './orm-repository';
export { OrmRepository };

export abstract class OrmEntityManager extends EntityManager {

  static transaction<T>(runInTransaction: (ormEntityManager: OrmEntityManager) => Promise<T>): Promise<T> {
    return getConnection().transaction((manager: EntityManager) => {
      const origGetRepository: OriginalGetRepositoryFn<T> = manager.getRepository.bind(manager);
      manager.getRepository = _getRepository.bind(manager, origGetRepository);
      return runInTransaction(<OrmEntityManager>manager);
    });
  }

  abstract getRepository<Entity>(target: EntityTarget<Entity>): OrmRepository<Entity>;
}

function _getRepository<Entity>(
  origGetRepository: OriginalGetRepositoryFn<Entity>,
  EntityClass: EntityTarget<Entity>
): OrmRepository<Entity> {
  const repository: Repository<Entity> = origGetRepository(EntityClass);
  return OrmRepository._createInstance(repository, EntityClass);
}

type OriginalGetRepositoryFn<Entity> = (target: EntityTarget<Entity>) => Repository<Entity>;
