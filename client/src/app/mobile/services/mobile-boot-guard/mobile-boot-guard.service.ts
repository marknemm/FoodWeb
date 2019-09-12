import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { SessionService } from '../../../session/services/session/session.service';

@Injectable()
export class MobileBootGuardService implements CanActivate {
  
  constructor(
    private _sessionService: SessionService
  ) {}

  canActivate(): boolean {
    return this._sessionService.loggedIn;
  }
}
