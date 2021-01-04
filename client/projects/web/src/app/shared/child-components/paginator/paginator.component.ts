import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Convert } from '~web/component-decorators';
import { LeftNavService } from '~web/shell/services/left-nav/left-nav.service';

@Component({
  selector: 'foodweb-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit, OnDestroy {

  @Convert()
  @Input() length: number;
  @Convert()
  @Input() page: number;
  @Convert()
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
    const pageIndex: number = (this.page ? this.page - 1 : null);
    const pageSize: number = (this.limit ? this.limit : null);
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
