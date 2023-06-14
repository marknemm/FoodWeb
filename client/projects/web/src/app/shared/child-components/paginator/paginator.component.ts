import { Component, Input, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DestroyService } from '~web/shared/services/destroy/destroy.service';
import { ShellService } from '~web/shell/services/shell/shell.service';

@Component({
  selector: 'foodweb-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  providers: [DestroyService]
})
export class PaginatorComponent implements OnInit {

  @Input() length: number;
  @Input() page: number;
  @Input() pageSizeOptions: number[] = [10, 20, 50];
  @Input() limit: number;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _destroyService: DestroyService,
    private _router: Router,
    private _shellService: ShellService
  ) {}

  ngOnInit(): void {
    this._initPageParams();
    this._listenForQueryParamChange();
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
      this._destroyService.untilDestroy()
    ).subscribe((params: ParamMap) => {
      const pageParam: string = params.get('page');
      const limitParam: string = params.get('limit');
      this.page = (pageParam ? parseInt(pageParam, 10) : 1);
      this.limit = (limitParam ? parseInt(limitParam, 10) : this.pageSizeOptions[0]);
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
    ).then(() => this._shellService.scrollContentToTop());
  }

}
