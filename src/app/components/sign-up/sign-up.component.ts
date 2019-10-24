import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  inForm: FormGroup;
  submitted:boolean=false;

  constructor(private formBuilder:FormBuilder, private router:Router) { }

  ngOnInit() {
    this.construirForm();
  }

  construirForm(){
    this.inForm = this.formBuilder.group({
      name: ['',[Validators.required]],
      last_name: ['',[Validators.required]],
      second_last_name: ['',[Validators.required]],
      username: ['',[Validators.required]],/* REVISAR SI YA existe */
      password: ['',[Validators.required, Validators.minLength(4)]]
    });
  }

  submit(){
    this.submitted = true;
    if(this.inForm.invalid){
      return;
    }
    //revisar que el username no se repita
    //si todo bien entonces lléveme a vista
    this.router.navigate(['iniciar-sesión']);
  }

  get f(){
    return this.inForm.controls;
  }

}
