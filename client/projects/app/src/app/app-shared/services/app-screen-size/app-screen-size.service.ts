import { Injectable } from '@angular/core';
import { Application, Screen } from '@nativescript/core';
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { ScreenSizeService } from '~web/shared/services/screen-size/screen-size.service';

@Injectable({
  providedIn: 'root'
})
export class AppScreenSizeService extends ScreenSizeService {

  constructor() {
    super();
  }

  /**
   * The width of the device viewport pixels.
   */
  get width(): number {
    return Screen.mainScreen.widthPixels;
  }

  /**
   * The height of the device viewport pixels.
   */
  get height(): number {
    return Screen.mainScreen.heightPixels;
  }

  /**
   * @override
   */
  onResize(destroy$: Observable<any> = new Observable()): Observable<number> {
    const resizeSubject = new Subject<number>();
    const resizeHandlerFn = () => resizeSubject.next(this.width);
    Application.on('orientationChanged', resizeHandlerFn);

    return resizeSubject.asObservable().pipe(
      takeUntil(destroy$),
      finalize(() => Application.off('resize', resizeHandlerFn))
    );
  }
}
