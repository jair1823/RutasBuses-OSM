import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { GuestViewComponent } from './components/guest-view/guest-view.component';
import { UserViewComponent } from './components/user-view/user-view.component';


const routes: Routes = [
  {
    path: '',
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
    component: UserViewComponent
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
