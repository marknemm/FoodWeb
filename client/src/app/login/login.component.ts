import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import {UserService} from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
    document.getElementById('headerNavBar').style.visibility='hidden';
  }

  loginUser(event) {
    event.preventDefault();
    console.log(event);
    var username = event.target.elements[0].value;
    var password = event.target.elements[1].value;
    console.log(username, password);

    if (username == 'admin' && password == 'admin') {
      this.router.navigate(['home']);
    }
  }

}
