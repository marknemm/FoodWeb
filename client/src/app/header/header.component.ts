import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../authentication/login.component';
import { DialogService } from "ng2-bootstrap-modal";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public localStorage = localStorage;

  constructor(private dialogService:DialogService) {}

  ngOnInit() {
  }

  showConfirm() {
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
}
