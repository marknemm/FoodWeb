import { SaveOptions } from 'typeorm';

export interface OrmSaveOptions<E> extends SaveOptions {
  mergeInto?: E;
  mergeOnInsert?: true;
  reload?: false;
}
