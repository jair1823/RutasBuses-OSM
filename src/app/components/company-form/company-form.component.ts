import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { CompanyService } from 'src/app/services/company.service';
import { CombineLatestOperator } from 'rxjs/internal/observable/combineLatest';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css']
})
export class CompanyFormComponent implements OnInit {

  inForm: FormGroup;
  submitted:boolean=false;
  edit:boolean=false;
  params:number = 0;

  constructor(private route:ActivatedRoute,private formBuilder:FormBuilder,private router:Router, private company:CompanyService) { }

  ngOnInit() {
    this.construirForm();
    const params = this.route.snapshot.params;
    if(params.id_company){
      this.params=params.id_company;
      this.getCompany();
      this.edit=true;
    }
  }

  getCompany(){
    this.company.getCompany(this.params).subscribe(
      res => {
        let r: any = res;
        if(r.success){
          this.setData(r.data[0]);
        }else{
          console.log('No existe.');
        }
      },
      err => {
        console.log(err);
        console.log('Error con laravel.');
      }
    );
  }

  setData(data){
    this.inForm.setValue({
      name: data.name,
      service_zone: data.service_zone,
      phone: data.phone,
      email: data.email,
      address: data.address,
      lat: data.lat,
      lng: data.lng,
      start_time: data.start_time,
      end_time: data.end_time
    });
  }

  construirForm(){
    this.inForm = this.formBuilder.group({
      name: ['',[Validators.required]],
      service_zone: ['',[Validators.required]],
      phone: ['',[Validators.required]],
      email: ['',[Validators.required]],
      address: ['',[Validators.required]],
      lat: ['',[Validators.required]],
      lng: ['',[Validators.required]],
      start_time: ['',[Validators.required]],
      end_time: ['',[Validators.required]]
    });
  }

  submit(){
    this.submitted = true;
    if(this.inForm.invalid){
      return;
    }
    let data = {
      name: this.inForm.value.name,
      service_zone: this.inForm.value.service_zone,
      phone: this.inForm.value.phone,
      email: this.inForm.value.email,
      address: this.inForm.value.address,
      lat: this.inForm.value.lat,
      lng: this.inForm.value.lng,
      start_time: this.inForm.value.start_time,
      end_time: this.inForm.value.end_time
    }
    if(this.edit){
      this.company.updateCompany(this.params,data).subscribe(
        res => {
          let r: any = res;
          if(r.success){
            //alerta se guardó correctamente
            this.router.navigate(['empresas']);
          }else{
            //no se pudo guardar
            console.log('No existe.');
          }
        },
        err => {
          console.log(err);
          console.log('Error con laravel.');
        }
      );
    }else{
      this.company.save(data).subscribe(
        res => {
          let r: any = res;
          if(r.success){
            //alerta se guardó correctamente
            this.router.navigate(['empresas']);
          }else{
            //no se pudo guardar
            console.log('Error con laravel.');
          }
        },
        err => {
          console.log(err);
          console.log('No hay conexión.');
        }
      );
    }
  }

  get f(){
    return this.inForm.controls;
  }

}
