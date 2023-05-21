import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { ObjectHelper } from '~shared';

/**
 * Global utility service containing helper methods for JS objects.
 * @see ObjectHelper
 */
@Injectable({
  providedIn: 'root'
})
export class ObjectService extends ObjectHelper {}
