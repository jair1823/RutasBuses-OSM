import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChangePasswordService } from 'src/app/services/change-password.service';
import { Alert } from 'src/app/models/alert';
import { SignInService } from 'src/app/services/sign-in.service';

const CHANGEDONE: Alert = {
  type: 'success',
  message: 'La contraseña se ha cambiado exitosamente.'
};

const CHANGEFAILED: Alert = {
  type: 'danger',
  message: 'No se ha podido cambiar la contraseña.'
};

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  inForm: FormGroup;
  submitted: boolean = false;
  changeDone: Alert;
  changeFailed: Alert;

  constructor(private formBuilder: FormBuilder, private router: Router, private changePass: ChangePasswordService, private singIn: SignInService) { }

  closeChangeDone() {
    this.changeDone = undefined;
  }

  resetChangeDone() {
    this.changeDone = CHANGEDONE;
  }

  closeChangeFailed() {
    this.changeFailed = undefined;
  }

  resetChangeFailed() {
    this.changeFailed = CHANGEFAILED;
  }

  ngOnInit() {
    this.construirForm();
  }

  construirForm() {
    this.inForm = this.formBuilder.group({
      current_password: ['', [Validators.required]],
      new_password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  get f() {
    return this.inForm.controls;
  }

  submit() {
    this.submitted = true;
    if (this.inForm.invalid) {
      return;
    }
    let data = {
      username: this.singIn.getLocal().username,
      password: this.inForm.value.current_password,
      new_password: this.inForm.value.new_password
    }
    this.changePass.change_password(data).subscribe(
      res => {
        let r: any = res;
        if (r.success) {
          this.resetChangeDone();
          this.inForm.setValue({
            current_password: "",
            new_password: ""
          });
          this.submitted = false;
        } else {
          this.resetChangeFailed();
        }
      },
      err => {
        console.log(err);
        console.log('Error con laravel');
      }
    );
  }
}
