import { Injectable } from '@angular/core';
import { LeftNavService } from '~web/shell/services/left-nav/left-nav.service';

@Injectable({
  providedIn: 'root'
})
export class AppLeftNavService extends LeftNavService {

  constructor() {
    super();
  }
}
