import { Component } from '@angular/core';
import { DialogService } from "ng2-bootstrap-modal";
import { Observable } from "rxjs/Observable";

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
        let dialogObserver: Observable<boolean> = LoginComponent.display(this.dialogService); 
        // Necessary so that observable action takes place!
        dialogObserver.subscribe(() => {});
    }


    private logout(): void {
        this.logoutService.logout();
    }
}
