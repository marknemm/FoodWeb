import { Component, OnInit } from '@angular/core';
import { DialogService } from "ng2-bootstrap-modal";
import { LoginComponent } from '../authentication/login.component';
import { LogoutService } from '../authentication/logout.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [ LogoutService ]
})
export class HeaderComponent implements OnInit {

  public sessionStorage = sessionStorage;

  constructor(
    private dialogService: DialogService,
    private logoutService: LogoutService
  ) {}

  ngOnInit() {
  }

  public showLogin(): void {
    var dialogObserver = this.dialogService.addDialog (
      LoginComponent,
      // Dialog Initalization Data
      null,
      // DialogOptions
      {
        closeByClickingOutside: true,
        backdropColor: '#222222',
      }
    );

    // Observe what the dialog result is.
    dialogObserver.subscribe((isConfirmed) => {
        // TODO: Replace the Login link with username link.
    });
  }

  public logout(): void {
    this.logoutService.logout();
  }
}
