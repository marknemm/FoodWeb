import { Component } from '@angular/core';
import { DialogService } from "ng2-bootstrap-modal";

import { LoginComponent } from '../authentication/login/login.component';
import { AuthSessionService } from '../authentication/misc/auth-session.service';
import { LogoutService } from '../authentication/misc/logout.service';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    providers: [LogoutService]
})
export class HeaderComponent {

    constructor(
        private dialogService: DialogService,
        private authSessionService: AuthSessionService,
        private logoutService: LogoutService
    ) { }


    private showLogin(): void {
        var dialogObserver = this.dialogService.addDialog(
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


    private logout(): void {
        this.logoutService.logout();
    }
}
