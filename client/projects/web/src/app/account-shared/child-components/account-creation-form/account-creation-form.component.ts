import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountCreationFormBaseComponent } from './account-creation-form.base.component';

@Component({
  selector: 'foodweb-account-creation-form',
  templateUrl: './account-creation-form.component.html',
  styleUrls: ['./account-creation-form.component.scss'],
})
export class AccountCreationFormComponent extends AccountCreationFormBaseComponent implements OnInit, OnDestroy {

  constructor(
    protected _activatedRoute: ActivatedRoute,
    protected _router: Router,
  ) {
    super(_activatedRoute, _router);
  }

}
