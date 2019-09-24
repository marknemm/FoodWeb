import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { finalize, catchError, flatMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ErrorHandlerService } from '../../../shared/services/error-handler/error-handler.service';
import { GeneralStats } from '../../../../../../shared/src/interfaces/heuristics/general-stats';
export { GeneralStats };

@Injectable({
  providedIn: 'root'
})
export class GeneralStatsService {

  readonly url = `${environment.server}/heuristics`;

  private _loadingGeneralStats = false;

  constructor(
    private _httpClient: HttpClient,
    private _errorHandlerService: ErrorHandlerService
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
    return this._httpClient.get<GeneralStats>(`${this.url}/general-stats`).pipe(
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._loadingGeneralStats = false)
    )
  }
}
