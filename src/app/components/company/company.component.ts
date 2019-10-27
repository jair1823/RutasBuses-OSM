import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  companies:any[];

  constructor(private router:Router, private company:CompanyService) { }

  ngOnInit() {
    this.getCompanies();
  }

  getCompanies(){
    this.company.getCompanies().subscribe(
      res => {
        let r: any = res;
        if(r.success){
          this.companies = r.data;
        }else{
          //no existe
          console.log('No existe.');
          this.companies=[];
        }
      },
      err => {
        console.log(err);
        console.log('Error con laravel.');
      }
    );
  }

  editCompany(c){
    this.router.navigate(['/', 'editar-empresa', `${c.value}`]);
  }

  deleteCompany(c){
    this.company.deleteCompany(c.value).subscribe(
      res => {
        let r: any = res;
        if(r.success){
          this.getCompanies();
        }else{
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
