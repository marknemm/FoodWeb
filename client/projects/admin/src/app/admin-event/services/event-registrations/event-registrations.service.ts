import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { environment } from '~admin-env/environment';
import { FeaturedEvent } from '~shared';
import { ImmutableStore } from '~web/data-structure/immutable-store';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';

@Injectable({
  providedIn: 'root'
})
export class EventRegistrationsService {

  readonly url = `${environment.server}/featured-event/:id/registrations`;
  readonly featuredEventStore = new ImmutableStore<FeaturedEvent>();

  constructor(
    private _httpClient: HttpClient,
    private _httpResponseService: HttpResponseService
  ) {}

  get loading(): boolean {
    return this._httpResponseService.loading;
  }

  getEventOnIdUrlParamChange(activatedRoute: ActivatedRoute): void {
    activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      const eventIdStr: string = paramMap.get('id');
      this._getEventWithRegistrations(eventIdStr);
    });
  }

  private _getEventWithRegistrations(eventIdStr: string): void {
    const url: string = this.url.replace(':id', eventIdStr);
    this._httpClient.get<FeaturedEvent>(url, { withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse({
        immutableStore: this.featuredEventStore,
        showPageProgressOnLoad: false
      })
    ).subscribe();
  }
}
