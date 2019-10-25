import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { GuestViewComponent } from './components/guest-view/guest-view.component';
import { UserViewComponent } from './components/user-view/user-view.component';
import { UserAuthenticateGuard } from './guards/user-authenticate.guard';


const routes: Routes = [

  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    component: GuestViewComponent
  },
  {
    path: 'iniciar-sesión',
    component: SignInComponent
  },
  {
    path: 'registrarme',
    component: SignUpComponent
  },
  {
    path: 'mapea',
    component: UserViewComponent,
    canActivate: [UserAuthenticateGuard]
  },
  {
    path: '**',
    redirectTo: 'inicio',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
