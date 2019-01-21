import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {

  constructor() { }

  sendPasswordResetEmail(usernameEmail: string): Observable<void> {
    return of(null);
  }

  resetPassword(password: string): void {

  }
}
