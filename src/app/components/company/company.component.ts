import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/services/company.service';
import { Alert } from 'src/app/models/alert';
import { SignInService } from 'src/app/services/sign-in.service';


const NOCOMPANIES: Alert = {
  type: 'info',
  message: 'No hay compañías creadas.'
};

const DELETE: Alert = {
  type: 'info',
  message: 'Compañía eliminada.'
};

const CREATEDCOMPANY: Alert = {
  type: 'info',
  message: 'Compañía creada!'
};

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  companies: any[];
  noCompanies: Alert;
  delete: Alert;
  createCompany: Alert;


  constructor(private router: Router, private company: CompanyService, private login: SignInService) { }

  ngOnInit() {
    if (localStorage.getItem('company_created') != null) {
      this.resetCreatedCompany();
      localStorage.removeItem('company_created');
    }
    this.getCompanies();
  }

  closeNoCompanies() {
    this.noCompanies = undefined;
  }

  resetNoCompanies() {
    this.noCompanies = NOCOMPANIES;
  }

  closeDelete() {
    this.delete = undefined;
  }

  resetDelete() {
    this.delete = DELETE;
  }

  closeCreatedCompany() {
    this.createCompany = undefined;
  }

  resetCreatedCompany() {
    this.createCompany = CREATEDCOMPANY;
  }


  getCompanies() {
    this.company.getCompanies().subscribe(
      res => {
        let r: any = res;
        if (r.success) {
          this.companies = r.data;
          this.closeNoCompanies();
        } else {
          //no existe
          this.resetNoCompanies();
          console.log('No existe.');
          this.companies = [];
        }
      },
      err => {
        console.log(err);
        console.log('Error con laravel.');
      }
    );
  }

  editCompany(c) {
    this.router.navigate(['/', 'editar-empresa', `${c.value}`]);
  }

  deleteCompany(c) {
    this.company.deleteCompany(c.value).subscribe(
      res => {
        let r: any = res;
        if (r.success) {

          this.company.deleteLog(this.login.getLocal().id_user, c.value).subscribe(
            res => {
              console.log(res);
              console.log('listo.');
            },
            err => {
              console.log(err);
              console.log('Error con laravel.');
            }
          );

          this.resetDelete();
          this.getCompanies();
        } else {
          //no se pudo eliminar
          console.log('Error con laravel.');
        }
      },
      err => {
        console.log(err);
        console.log('Error con laravel.');
      }
    );
  }

}
