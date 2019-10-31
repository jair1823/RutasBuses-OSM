import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { CompanyService } from 'src/app/services/company.service';
import { Map, tileLayer, latLng, LatLng, Routing, marker } from 'leaflet';
import { Alert } from '../../models/alert';

const UPDATED:Alert = {
  type: 'success', message: 'Compañía actualizada.'
}

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css']
})
export class CompanyFormComponent implements OnInit {

  inForm: FormGroup;
  submitted: boolean = false;
  edit: boolean = false;
  params: number = 0;

  sTime = { hour: 12, minute: 0 };
  eTime = { hour: 12, minute: 0 };

  updated:Alert;

  map: Map;

  m;

  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '<a href="https://www.openstreetmap.org/">OpenStreetMap</a>|<a href="https://www.liedman.net/leaflet-routing-machine/">Routeing Machine</a>'
      })
    ],
    zoom: 8,
    center: latLng(9.930976812881799, -84.0886688232422)
  };

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private router: Router, private company: CompanyService) { }

  ngOnInit() {
    this.construirForm();
    const params = this.route.snapshot.params;
    if (params.id_company) {
      this.params = params.id_company;
      this.getCompany();
      this.edit = true;
    }
  }

  getCompany() {
    this.company.getCompany(this.params).subscribe(
      res => {
        let r: any = res;
        if (r.success) {
          this.setData(r.data[0]);
        } else {
          console.log('No existe.');
        }
      },
      err => {
        console.log(err);
        console.log('Error con laravel.');
      }
    );
  }

  setData(data) {
    let t1 = data.start_time.split(':');
    let t2 = data.end_time.split(':');
    this.m.setLatLng([data.lat, data.lng]).update();
    this.map.setView([data.lat, data.lng], 8);
    this.inForm.patchValue({
      name: data.name,
      service_zone: data.service_zone,
      phone: data.phone,
      email: data.email,
      address: data.address,
      lat: data.lat,
      lng: data.lng,
      start_time: { hour: Number.parseInt(t1[0]), minute: Number.parseInt(t1[1]) },
      end_time: { hour: Number.parseInt(t2[0]), minute: Number.parseInt(t2[1]) },
    });
  }

  construirForm() {
    this.inForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      service_zone: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required]],
      address: ['', [Validators.required]],
      lat: ['', [Validators.required]],
      lng: ['', [Validators.required]],
      start_time: ['', [Validators.required]],
      end_time: ['', [Validators.required]]
    });
  }

  submit() {
    this.submitted = true;
    if (this.inForm.invalid) {
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
      start_time: this.inForm.value.start_time.hour + ':' + this.inForm.value.start_time.minute,
      end_time: this.inForm.value.end_time.hour + ':' + this.inForm.value.end_time.minute
    }

    if (this.edit) {
      this.company.updateCompany(this.params, data).subscribe(
        res => {
          let r: any = res;
          if (r.success) {
            //alerta se guardó correctamente
            //this.router.navigate(['empresas']);
            this.resetUpdated();
          } else {
            //no se pudo guardar
            console.log('No existe.');
          }
        },
        err => {
          console.log(err);
          console.log('Error con laravel.');
        }
      );
    } else {
      this.company.save(data).subscribe(
        res => {
          let r: any = res;
          if (r.success) {
            //alerta se guardó correctamente
            localStorage.setItem('company_created', 'true');
            this.router.navigate(['empresas']);
          } else {
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

  get f() {
    return this.inForm.controls;
  }

  onMapReady(map: Map) {
    this.map = map;
    if (this.edit) {
      this.m = marker([this.inForm.value.lat, this.inForm.value.lng]).addTo(map);
    } else {
      this.m = marker([9.930976812881799, -84.0886688232422]).addTo(map);
      this.inForm.patchValue({
        lat: 9.93097681,
        lng: -84.08866882
      });
    }

  }

  onClickMap(map: Map) {
    //console.log(this.map);
    this.m.setLatLng([map.latlng.lat, map.latlng.lng]).update();
    this.map.setView([map.latlng.lat, map.latlng.lng], 8);
    this.inForm.patchValue({
      lat: map.latlng.lat.toFixed(8),
      lng: map.latlng.lng.toFixed(8)
    });

  }

  closeUpdated(){
    this.updated = undefined;
  }

  resetUpdated(){
    this.updated = UPDATED;
  }

}
