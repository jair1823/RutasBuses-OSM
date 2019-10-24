import { Component, OnInit } from '@angular/core';
import { SignInService } from 'src/app/services/sign-in.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-user',
  templateUrl: './navbar-user.component.html',
  styleUrls: ['./navbar-user.component.css']
})
export class NavbarUserComponent implements OnInit {

  constructor(private signInService:SignInService,private route:Router) { }

  ngOnInit() {
  }

  logOut(){
    this.signInService.removeLocal();
    //this.route.navigate(['/']);
  }

}
