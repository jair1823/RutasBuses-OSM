import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { GuestViewComponent } from './components/guest-view/guest-view.component';
import { UserAuthenticateGuard } from './guards/user-authenticate.guard';
import { CompanyComponent } from './components/company/company.component';
import { CompanyFormComponent } from './components/company-form/company-form.component';
import { RouteComponent } from './components/route/route.component';
import { RouteFormComponent } from './components/route-form/route-form.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';


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
    path: 'rutas',
    component: RouteComponent,
    canActivate: [UserAuthenticateGuard]
  },
  {
    path: 'nueva-ruta',
    component: RouteFormComponent,
    canActivate: [UserAuthenticateGuard]
  },
  {
    path: 'editar-ruta/:id_route',
    component: RouteFormComponent,
    canActivate: [UserAuthenticateGuard]
  },
  {
    path: 'empresas',
    component: CompanyComponent,
    canActivate: [UserAuthenticateGuard]
  },
  {
    path: 'editar-empresa/:id_company',
    component: CompanyFormComponent,
    canActivate: [UserAuthenticateGuard]
  },
  {
    path: 'nueva-empresa',
    component: CompanyFormComponent,
    canActivate: [UserAuthenticateGuard]
  },
  {
    path: 'configuración',
    component: ChangePasswordComponent,
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
