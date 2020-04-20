import { AppData } from './app-data';
import { WriteRequest } from '../write-request';

export interface AppDataSaveRequest extends WriteRequest {
  appData: AppData;
}
