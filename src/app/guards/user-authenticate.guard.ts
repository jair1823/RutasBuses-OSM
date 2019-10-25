import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SignInService } from '../services/sign-in.service';

@Injectable({
  providedIn: 'root'
})
export class UserAuthenticateGuard implements CanActivate {
  
  constructor(private signInService:SignInService, private router:Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.signInService.isLogged()) {
      return true;
    } else {
      return this.router.parseUrl("/iniciar-sesión");
    }
  }
  
}
