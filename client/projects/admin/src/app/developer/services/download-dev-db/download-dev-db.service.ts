import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '~admin-env/environment';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';

@Injectable({
  providedIn: 'root'
})
export class DownloadDevDbService {

  readonly url = `${environment.server}/developer/dev-db`;

  constructor(
    private _httpClient: HttpClient,
    private _httpResponseService: HttpResponseService,
  ) {}

  get loading(): boolean {
    return this._httpResponseService.anyLoading(this);
  }

  /**
   * Downloads a dev version of the production database.
   */
  downloadDevDb(): void {
    if (!this._httpResponseService.isLoading(this)) {
      const headers = new HttpHeaders({ 'Content-Disposition': 'attachment' });
      this._httpClient.get(this.url, { withCredentials: true, headers, responseType: 'blob' }).pipe(
        this._httpResponseService.handleHttpResponse(this.downloadDevDb, {
          loaderBlocking: false,
          successMessage: 'Dev DB Download Successful'
        })
      ).subscribe((fileBlob: any) => {
        // Requires entire file to be loaded in memory, kind of hacky, but works for now...
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(fileBlob);
        downloadLink.download = 'dev-db-init.pgsql';
        downloadLink.click();
      });
    }
  }
}
