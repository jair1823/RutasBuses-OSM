import { Component } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { SignInService } from './services/sign-in.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  logged:boolean = false;
  constructor(private router: Router, private signInService:SignInService) {

    router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.logged =signInService.isLogged();
      }
    });

  }
}
