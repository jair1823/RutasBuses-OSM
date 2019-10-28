import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GuestViewComponent } from './components/guest-view/guest-view.component';
import { UserViewComponent } from './components/user-view/user-view.component';
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


@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    GuestViewComponent,
    UserViewComponent,
    NavbarComponent,
    NavbarUserComponent,
    CompanyComponent,
    CompanyFormComponent
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
    RouteService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
