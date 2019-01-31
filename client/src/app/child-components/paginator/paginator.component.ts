import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'food-web-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {

  @Input() length: number;
  @Input() page: number;
  @Input() limit: number;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this._initPage();
    this._initLimit();
  }

  private _initPage(): void {
    if (!this.page) {
      const pageParam: string = this._activatedRoute.snapshot.queryParamMap.get('page');
      this.page = (pageParam ? parseInt(pageParam, 10) : 1);
    }
  }

  private _initLimit(): void {
    if (!this.limit) {
      const limitParam: string = this._activatedRoute.snapshot.queryParamMap.get('limit');
      this.limit = (limitParam ? parseInt(limitParam, 10) : 10);
    }
  }

  onPageEvent(event: PageEvent): void {
    this._router.navigate(
      [],
      {
        relativeTo: this._activatedRoute,
        queryParams: { page: (event.pageIndex + 1), limit: event.pageSize },
        queryParamsHandling: 'merge'
      }
    );
  }

}
