import { SignupService } from './signup.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [SignupService],
  
})
export class SignupComponent implements OnInit {
  
ngOnInit() {
  }

  constructor(private signupservice: SignupService) { }

  styleUrls: ['./signup.component.css']
}

