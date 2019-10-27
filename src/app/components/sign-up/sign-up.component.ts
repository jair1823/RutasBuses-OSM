import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { SignUpService } from 'src/app/services/sign-up.service';
import { Alert } from 'src/app/models/alert'

const SIGNUPFAIL: Alert = {
  type: 'danger',
  message: 'El username ya está ocupado. Escoge otro.'
};

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  inForm: FormGroup;
  submitted:boolean=false;
  signUpFail:Alert;

  constructor(private formBuilder:FormBuilder, private router:Router, private signUp:SignUpService) { }

  closeSignUpFail() {
    this.signUpFail = undefined;
  }

  throwSignUpFail() {
    this.signUpFail = SIGNUPFAIL;
  }

  ngOnInit() {
    this.construirForm();
  }

  construirForm(){
    this.inForm = this.formBuilder.group({
      name: ['',[Validators.required]],
      last_name: ['',[Validators.required]],
      second_last_name: ['',[Validators.required]],
      username: ['',[Validators.required]],
      password: ['',[Validators.required, Validators.minLength(4)]]
    });
  }

  submit(){
    this.submitted = true;
    if(this.inForm.invalid){
      return;
    }
    let data = {
      name: this.inForm.value.name,
      last_name: this.inForm.value.last_name,
      second_last_name: this.inForm.value.second_last_name,
      username: this.inForm.value.username,
      password: this.inForm.value.password
    }
    this.signUp.checkUnique(data).subscribe(
      res => {
        let r:any = res;
        if(r.success){
          this.saveUsername(data);
        }else{
          this.throwSignUpFail();
        }
      },
      err => {
        console.log(err);
        console.log('Error con laravel.');
      }
    );
  }

  get f(){
    return this.inForm.controls;
  }

  saveUsername(data){
    this.signUp.register(data).subscribe(
      res => {
        let r:any = res;
        if(r.success){
          this.router.navigate(['iniciar-sesión']);
        } else{
          console.log('Error con laravel. No se pudo registrar el usuario');
        }
      },
      err => {
        console.log(err);
        console.log('Error con laravel.');
      }
    );
  }

}
