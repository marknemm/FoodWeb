import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LeftNavService } from '~web/left-nav/left-nav.service';

@Component({
  selector: 'food-web-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {

  @Input() length: number;
  @Input() page: number;
  @Input() limit: number;

  private _destory$ = new Subject();

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _leftNavService: LeftNavService
  ) {}

  ngOnInit() {
    this._initPageParams();
    this._listenForQueryParamChange();
  }

  ngOnDestroy() {
    this._destory$.next();
  }

  private _initPageParams(): void {
    let pageIndex: number = (this.page ? this.page - 1 : null);
    let pageSize: number = (this.limit ? this.limit : null);
    if (pageIndex || pageSize) {
      this.onPageEvent({ pageIndex, pageSize, length: pageSize });
    }
  }

  private _listenForQueryParamChange(): void {
    this._activatedRoute.queryParamMap.pipe(
      takeUntil(this._destory$)
    ).subscribe((params: ParamMap) => {
      const pageParam: string = params.get('page');
      const limitParam: string = params.get('limit');
      this.page = (pageParam ? parseInt(pageParam, 10) : 1);
      this.limit = (limitParam ? parseInt(limitParam, 10) : 10);
    });
  }

  onPageEvent(event: PageEvent): void {
    const page: number = (event.pageIndex ? event.pageIndex + 1 : undefined);
    const limit: number = (event.pageSize ? event.pageSize : undefined);
    this._router.navigate(
      [],
      {
        relativeTo: this._activatedRoute,
        queryParams: { page, limit },
        queryParamsHandling: 'merge'
      }
    ).then(() => this._leftNavService.scrollContentToTop());
  }

}
