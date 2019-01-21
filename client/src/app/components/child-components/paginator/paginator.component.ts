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

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {}

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
