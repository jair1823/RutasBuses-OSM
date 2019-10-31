import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GuestViewComponent } from './components/guest-view/guest-view.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NavbarUserComponent } from './components/navbar-user/navbar-user.component'
import { HttpClientModule } from '@angular/common/http'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SignInService } from './services/sign-in.service';
import { SignUpService } from './services/sign-up.service';
import { CompanyComponent } from './components/company/company.component';
import { CompanyFormComponent } from './components/company-form/company-form.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { CompanyService } from './services/company.service';
import { RouteService } from './services/route.service';
import { RouteComponent } from './components/route/route.component';
import { RouteFormComponent } from './components/route-form/route-form.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ChangePasswordService } from './services/change-password.service';


@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    GuestViewComponent,
    NavbarComponent,
    NavbarUserComponent,
    CompanyComponent,
    CompanyFormComponent,
    RouteComponent,
    RouteFormComponent,
    ChangePasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    LeafletModule.forRoot()
  ],
  providers: [
    SignInService,
    SignUpService,
    CompanyService,
    RouteService,
    ChangePasswordService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
