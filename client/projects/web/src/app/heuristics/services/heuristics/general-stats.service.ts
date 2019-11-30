import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { never, Observable, timer } from 'rxjs';
import { catchError, finalize, flatMap } from 'rxjs/operators';
import { GeneralStats } from '~shared';
import { environment } from '~web/environments/environment';
export { GeneralStats };

@Injectable({
  providedIn: 'root'
})
export class GeneralStatsService {

  readonly url = `${environment.server}/heuristics`;

  private _loadingGeneralStats = false;

  constructor(
    private _httpClient: HttpClient
  ) {}

  get loading(): boolean {
    return this._loadingGeneralStats;
  }

  watchGeneralStats(refreshInterval = 30000): Observable<GeneralStats> {
    return timer(0, refreshInterval).pipe(
      flatMap(() => this.getGeneralStats())
    );
  }

  getGeneralStats(): Observable<GeneralStats> {
    this._loadingGeneralStats = true;
    return this._httpClient.get<GeneralStats>(`${this.url}/general-stats`, { withCredentials: true }).pipe(
      finalize(() => this._loadingGeneralStats = false),
      catchError((err: HttpErrorResponse) => {
        console.error(err);
        return never();
      })
    )
  }
}
