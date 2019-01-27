import { Directive, Input, HostListener } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Directive({
  selector: '[foodWebReturnLink]'
})
export class ReturnLinkDirective {
  
  @Input('foodWebReturnLink') returnFragment: string;
  @Input() routerLink: string[];
  @Input() queryParams: Params;
  @Input() state: any;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {}

  @HostListener('click')
  onclick(): void {
    this._addReturnFragment();
    this._routeToNext();
  }

  private _addReturnFragment(): void {
    this._router.navigate(
      [this._activatedRoute.snapshot.url.toString()],
      {
        fragment: `${this.returnFragment}`,
        queryParams: this._activatedRoute.snapshot.queryParams,
        replaceUrl: true
      }
    );
  }

  private _routeToNext(): void {
    setTimeout(() => {
      this._router.navigate(
        this.routerLink,
        {
          queryParams: this.queryParams,
          state: this.state
        }
      );
    });
  }

}
