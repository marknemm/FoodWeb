import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {

  constructor() { }

  sendPasswordResetEmail(email: string): Observable<void> {
    return of(null);
  }

  resetPassword(password: string): void {

  }
}
