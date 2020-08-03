import { Injectable } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { LeftNavService } from '~web/shell/services/left-nav/left-nav.service';
import { PageProgressService } from '~web/shared/services/page-progress/page-progress.service';

@Injectable({
  providedIn: 'root'
})
export class AppPageProgressService extends PageProgressService {

  constructor(
    protected _leftNavService: LeftNavService,
    protected _router: RouterExtensions
  ) {
    super(_leftNavService, <any>_router);
  }
}
