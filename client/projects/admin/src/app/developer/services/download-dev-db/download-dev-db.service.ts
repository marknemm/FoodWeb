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
    public httpResponseService: HttpResponseService,
    private _httpClient: HttpClient,
  ) {}

  /**
   * Downloads a dev version of the production database.
   */
  downloadDevDb(): void {
    if (!this.httpResponseService.loading) {
      const headers = new HttpHeaders({ 'Content-Disposition': 'attachment' });
      this._httpClient.get(this.url, { withCredentials: true, headers, responseType: 'blob' }).pipe(
        this.httpResponseService.handleHttpResponse({ successMessage: 'Dev DB Download Successful', pageProgressBlocking: false })
      ).subscribe((fileBlob: unknown) => {
        // Requires entire file to be loaded in memory, kind of hacky, but works for now...
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(fileBlob);
        downloadLink.download = 'dev-db-init.pgsql';
        downloadLink.click();
      });
    }
  }
}
