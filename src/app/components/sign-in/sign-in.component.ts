import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { SignInService } from 'src/app/services/sign-in.service';
import { Alert } from 'src/app/models/alert';


const SIGNINFAIL: Alert = {
  type: 'danger',
  message: 'Credenciales incorrectas.'
};

const SIGNUPSUCCESS: Alert = {
  type: 'success',
  message: 'Usuario creado correctamente. Ingrese con sus credenciales :)'
};

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  inForm: FormGroup;
  submitted: boolean = false;
  signInFail: Alert;
  signUpSuccess: Alert;

  constructor(private formBuilder: FormBuilder, private router: Router, private signIn: SignInService) { }

  closeSignInFail() {
    this.signInFail = undefined;
  }

  resetSignInFail() {
    this.signInFail = SIGNINFAIL;
  }

  closeSignUpSuccess() {
    this.signUpSuccess = undefined;
  }

  resetSignUpSuccess() {
    this.signUpSuccess = SIGNUPSUCCESS;
  }

  ngOnInit() {
    if (localStorage.getItem('user_created') != null) {
      this.resetSignUpSuccess();
      localStorage.removeItem('user_created');
    }

    this.construirForm();
  }

  construirForm() {
    this.inForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  submit() {
    this.submitted = true;
    if (this.inForm.invalid) {
      return;
    }

    let data = {
      username: this.inForm.value.username,
      password: this.inForm.value.password
    }

    this.signIn.authenticate(data).subscribe(
      res => {
        let r: any = res;
        if (r.success) {
          this.signIn.saveLocal(r.data);
          this.router.navigate(['mapea']);
        } else {
          this.resetSignInFail();
        }
      },
      err => {
        console.log(err);
        console.log('Error con laravel.');
      }
    );
  }

  get f() {
    return this.inForm.controls;
  }

}
