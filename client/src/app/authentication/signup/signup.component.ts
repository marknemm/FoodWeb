import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SignupModel } from './signup-model'
import { SignupService } from './signup.service'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [ SignupService ]
})
export class SignupComponent implements OnInit {

  public signupModel: SignupModel;

  constructor(
    private signupService: SignupService,
    private router: Router
  )
  {
    this.signupModel = new SignupModel();
  }
  
  ngOnInit() {
  }

  signupUser(event: Event): void {
    event.preventDefault();

    var observer = this.signupService.signup(this.signupModel);
    // This is the promise we get
    observer.subscribe(
      data => {
        // Fill our model with the JSON result and see if Login is a success.
        console.log(data.message);
        // Will set global local storage internally if success.
        this.signupModel.processSignupResult(data.success, data.message, data.appUserKey);
        if (data.success) {
          this.router.navigate([ '/home' ]);
        }
      },
      error => {
        console.log(error);
        // Shouldn't happen!
      }
    );
  }


}

