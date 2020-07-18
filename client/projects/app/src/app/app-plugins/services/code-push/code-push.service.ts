import { Injectable } from '@angular/core';
import { CodePush } from '@ionic-native/code-push/ngx';

@Injectable({
  providedIn: 'root'
})
export class CodePushService {

  constructor(
    private _codePush: CodePush
  ) {}

  /**
   * Performs an initial code sync and listens for app resume to perform additional syncs.
   */
  maintainSynchronization(): void {
    this._codePush.sync();
    document.addEventListener('resume', () =>
      this._codePush.sync()
    );
  }

}
