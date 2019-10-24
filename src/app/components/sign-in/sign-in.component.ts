import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  inForm: FormGroup;
  submitted:boolean=false;

  constructor(private formBuilder:FormBuilder, private router:Router) { }

  ngOnInit() {
    this.construirForm();
  }

  construirForm(){
    this.inForm = this.formBuilder.group({
      username: ['',[Validators.required]],
      password: ['',[Validators.required]]
    });
  }

  submit(){
    this.submitted = true;
    if(this.inForm.invalid){
      return;
    }
    //revisar credenciales
    //si todo bien entonces lléveme a vista
    this.router.navigate(['mapea']);
  }

  get f(){
    return this.inForm.controls;
  }

}
