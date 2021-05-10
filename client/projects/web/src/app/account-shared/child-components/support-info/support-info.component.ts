import { Component } from '@angular/core';
import { FormHelperService, formProvider } from '~web/forms';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'foodweb-support-info',
  templateUrl: './support-info.component.html',
  styleUrls: ['./support-info.component.scss']
})
export class SupportInfoComponent  {

  constructor() {
  }

  ngOnInit() {}

  sendEmail() {}
}
