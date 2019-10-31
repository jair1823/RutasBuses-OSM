import { Component, OnInit } from '@angular/core';

import { Map, tileLayer, latLng, Routing, marker } from 'leaflet';
import 'leaflet-routing-machine';
import { CompanyService } from 'src/app/services/company.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouteService } from 'src/app/services/route.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Alert } from '../../models/alert';

const UPDATED:Alert = {
  type: 'success', message: 'Ruta actualizada.'
}

@Component({
  selector: 'app-route-form',
  templateUrl: './route-form.component.html',
  styleUrls: ['./route-form.component.css']
})
export class RouteFormComponent implements OnInit {

  updated:Alert;

  routeForm: FormGroup;
  submitted: boolean = false;
  sTime = { hour: 12, minute: 0 };
  eTime = { hour: 12, minute: 0 };

  provinciasO: any[];
  cantonesO: any[];
  districtoO: any[];

  provinciasD: any[];
  cantonesD: any[];
  districtoD: any[];

  map: Map;

  messages: any = [];
  points = [];
  contador = 0;
  route;

  companies: any[];

  options;

  edit: boolean = false;
  params: number = 0;

  constructor(
    private companyService: CompanyService,
    private formBuilder: FormBuilder,
    private routeService: RouteService,
    private activateRoute: ActivatedRoute,
    private router:Router
  ) { }

  ngOnInit() {
    this.createForm();
    this.route = Routing.control({
      draggableWaypoints: false,
      addWaypoints: false,
      messages: this.messages,
      waypoints: this.points,
      show: false,
      createMarker: function (i, wp) {
        return marker(wp.latLng).bindPopup(`${this.messages[i].me}`);
      }
    });
    this.options = {
      layers: [
        tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution:
            "<a target='_blank' href='https://www.openstreetmap.org/'>OpenStreetMap</a>|" +
            "<a target='_blank' href='https://www.liedman.net/leaflet-routing-machine/'>Routeing Machine</a>"
        })
      ],
      zoom: 17,
      center: latLng(9.932465, -84.049161)
    }


    const params = this.activateRoute.snapshot.params;
    if (params.id_route) {
      this.params = params.id_route;
      this.edit = true;
      this.getRoute();
    } else {
      this.loadCompanies();
      this.getProvince(true);
      this.getProvince(false);
    }
  }



  getRoute() {
    this.routeService.getRoute(this.params).subscribe(
      res => {
        let r: any = res;
        if (r.success) {
          this.loadRoute(r.points);
          this.loadCompany(r.data[0]);
          this.loadProvince(true, r.origin[0]);
          this.loadProvince(false, r.destination[0]);
          this.loadInformation(r.data[0]);
        } else {
          console.log('Error en obtener la ruta');
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  loadRoute(p) {
    for (let index = 0; index < p.length; index++) {
      const point = p[index];
      let marker = {
        id: this.contador,
        me: point.description
      }
      this.contador++;
      this.messages.push(marker);
      this.points.push(latLng(point.lat, point.lng));
      this.contador++;
    }
    this.route.setWaypoints(this.points);
  }

  loadCompany(data) {
    let id = data.id_company;
    this.companyService.getCompanies().subscribe(
      res => {
        let r: any = res;
        if (r.success) {
          this.companies = r.data;
          for (let index = 0; index < this.companies.length; index++) {
            const company = this.companies[index];
            if (company.id_company == id) {
              this.routeForm.patchValue({
                company: this.companies[index]
              });
            }

          }
        } else {
          this.companies = [];
          console.log('no hay companies');
        }
      },
      err => {
        this.companies = [];
        console.log(err);
      }
    );
  }

  loadProvince(origen, data) {
    console.log('loading...');
    this.routeService.getProvince().subscribe(
      res => {
        let r: any = res;
        if (r.success) {
          if (origen) {
            this.provinciasO = r.data;
            for (let index = 0; index < this.provinciasO.length; index++) {
              const p = this.provinciasO[index];
              if (data.id_province == p.id_province) {
                this.routeForm.patchValue({
                  originP: p
                });
              }
            }
            this.loadCanton(true, data);
          } else {
            this.provinciasD = r.data;
            for (let index = 0; index < this.provinciasD.length; index++) {
              const p = this.provinciasD[index];
              if (data.id_province == p.id_province) {
                this.routeForm.patchValue({
                  destinationP: p
                });
              }
            }
            this.loadCanton(false, data);
          }



        } else {
          console.log('No hay provincias');
        }
      },
      err => {
        console.log(err);
        console.log('Erro conexion');
      }
    );
  }

  loadCanton(origen, data) {
    let id;
    if (origen) {
      id = this.routeForm.value.originP.id_province;
    } else {
      id = this.routeForm.value.destinationP.id_province;
    }
    this.routeService.getCantonByProvince(id).subscribe(
      res => {
        let r: any = res;
        if (r.success) {
          if (origen) {
            this.cantonesO = r.data;
            for (let index = 0; index < this.cantonesO.length; index++) {
              const c = this.cantonesO[index];
              if (c.id_canton == data.id_canton) {
                this.routeForm.patchValue({
                  originC: c
                });
              }
            }
            this.loadDistric(origen, data);
          } else {
            this.cantonesD = r.data;
            for (let index = 0; index < this.cantonesD.length; index++) {
              const c = this.cantonesD[index];
              if (c.id_canton == data.id_canton) {
                this.routeForm.patchValue({
                  destinationC: c
                });
              }

            }
            this.loadDistric(origen, data);
          }
        } else {
          console.log('No hay cantones');
        }
      },
      err => {
        console.log(err);
        console.log('Erro conexion');
      }
    )
  }

  loadDistric(origen, data) {
    let id;
    if (origen) {
      id = this.routeForm.value.originC.id_canton;
    } else {
      id = this.routeForm.value.destinationC.id_canton;
    }
    this.routeService.getDistricByCanton(id).subscribe(
      res => {
        let r: any = res;
        if (r.success) {
          if (origen) {

            this.districtoO = r.data;
            for (let index = 0; index < this.districtoO.length; index++) {
              const d = this.districtoO[index];
              if (d.id_distric == data.id_distric) {
                this.routeForm.patchValue({
                  origin: d
                });
              }
            }
          } else {

            this.districtoD = r.data;
            for (let index = 0; index < this.districtoD.length; index++) {
              const d = this.districtoD[index];
              if (d.id_distric == data.id_distric) {
                this.routeForm.patchValue({
                  destination: d
                });
              }
            }
          }
        } else {
          console.log('No hay cantones');
        }
      },
      err => {
        console.log(err);
        console.log('Erro conexion');
      }
    )
  }

  loadInformation(data) {
    let t1 = data.start_time.split(':');
    let t2 = data.end_time.split(':');
    this.routeForm.patchValue({
      number: data.number,
      description: data.description,
      ticket_cost: data.ticket_cost,
      start_time: { hour: Number.parseInt(t1[0]), minute: Number.parseInt(t1[1]) },
      end_time: { hour: Number.parseInt(t2[0]), minute: Number.parseInt(t2[1]) },
      duration: data.duration,
      disability_system: data.disability_system
    })
  }





  createForm() {
    this.routeForm = this.formBuilder.group({
      company: [null, [Validators.required]],
      number: ['', [Validators.required]],
      description: ['', [Validators.required]],
      ticket_cost: ['', Validators.required],
      start_time: ['', [Validators.required]],
      end_time: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      disability_system: [true, []],
      originP: [null, [Validators.required]],
      originC: [null, [Validators.required]],
      origin: [null, [Validators.required]],
      destinationP: [null, [Validators.required]],
      destinationC: [null, [Validators.required]],
      destination: [null, [Validators.required]]
    });
  }

  createRoute() {
    let data = {
      id_company: this.routeForm.value.company.id_company,
      number: this.routeForm.value.number,
      description: this.routeForm.value.description,
      ticket_cost: this.routeForm.value.ticket_cost,
      start_time: this.routeForm.value.start_time.hour + ':' + this.routeForm.value.start_time.minute,
      end_time: this.routeForm.value.end_time.hour + ':' + this.routeForm.value.end_time.minute,
      duration: this.routeForm.value.duration,
      disability_system: this.routeForm.value.disability_system,
      origin: this.routeForm.value.origin.id_distric,
      destination: this.routeForm.value.destination.id_distric
    };

    this.routeService.createRoute(data).subscribe(
      res => {
        let r: any = res;
        if (r.success) {
          this.createPoints(r.data);
          localStorage.setItem('created_route','true');
          this.router.navigate(['/rutas']);
        } else {
          console.log('no se pudo crear')
        }
      },
      err => {
        console.log('No hay conexion con laravel');
        console.log(err);
      }
    )
  }

  updateRoute() {
    console.log('update...');
    let data = {
      id_company: this.routeForm.value.company.id_company,
      number: this.routeForm.value.number,
      description: this.routeForm.value.description,
      ticket_cost: this.routeForm.value.ticket_cost,
      start_time: this.routeForm.value.start_time.hour + ':' + this.routeForm.value.start_time.minute,
      end_time: this.routeForm.value.end_time.hour + ':' + this.routeForm.value.end_time.minute,
      duration: this.routeForm.value.duration,
      disability_system: this.routeForm.value.disability_system,
      origin: this.routeForm.value.origin.id_distric,
      destination: this.routeForm.value.destination.id_distric
    };
    this.routeService.updateRoute(this.params, data).subscribe(
      res => {
        let r: any = res;
        if (r.success) {
          this.deletePoints();
        } else {
          alert('unupdated');
        }
      },
      err => {
        console.log(err);
      }
    );



  }

  deletePoints() {
    this.routeService.deletePoints(this.params).subscribe(
      res => {
        let r: any = res;
        if (r.success) {
          this.createPoints(this.params);
        } else {
          alert('Error al eliminar puntos');
        }
      },
      err => {
        console.log(err);
        console.log('Error con laravel. borrando puntos');
      }
    )
  }

  submit() {
    this.submitted = true;

    if (this.routeForm.invalid) {
      console.log('Errores en el form');
      return;
    }

    if (this.edit) {
      this.updateRoute();
    } else {
      this.createRoute();
    }
  }

  createPoints(id) {
    for (let index = 0; index < this.points.length; index++) {
      const p = this.points[index];
      const m = this.messages[index];

      let data = {
        id_route: id,
        description: m.me,
        lat: p.lat,
        lng: p.lng
      }
      this.routeService.createPoint(data).subscribe(
        res => {
          console.log(res);
        }
      )
    }
    if (this.edit) {
      this.resetUpdated();
    }
  }

  loadCompanies() {
    this.companyService.getCompanies().subscribe(
      res => {
        let r: any = res;
        if (r.success) {
          this.companies = r.data;
        } else {
          this.companies = [];
          console.log('no hay companies');
        }
      },
      err => {
        this.companies = [];
        console.log(err);
      }
    )
  }


  get f() {
    return this.routeForm.controls;
  }






  onMapReady(map: Map): void {
    this.map = map;
    this.route.addTo(this.map);
  }

  onClickMap(map: Map) {
    let marker;
    if (this.contador == 0) {
      marker = {
        id: this.contador,
        me: 'Punto de salida'
      }
    } else {
      marker = {
        id: this.contador,
        me: 'Punto intermedio'
      }
    }
    this.messages.push(marker);
    this.points.push(latLng(map.latlng.lat, map.latlng.lng));
    this.route.setWaypoints(this.points);
    this.contador++;
  }

  updateMessage(id) {
    let e: any = document.getElementById(id);
    this.messages[id].me = e.value;
    this.route.setWaypoints(this.points);
  }

  new_place(id) {
    let e: any = document.getElementById(id);

    let data = {
      id_user: JSON.parse(localStorage.getItem('user')).id_user,
      description: e.value
    }
    this.routeService.createNewPlace(data).subscribe(
      res => {
        let r: any = res;
        if (r.success) {
          console.log('Se creo correctamente')
        } else {
          console.log('Al solicitar el lugar')
        }
      },
      err => {
        console.log(err);
        console.log('Error con la conexion');
      }
    )
  }

  deletePoint() {
    this.contador--;
    this.points.pop();
    this.messages.pop();
    this.route.setWaypoints(this.points);
  }

  getProvince(origen) {
    this.routeService.getProvince().subscribe(
      res => {
        let r: any = res;
        if (r.success) {
          if (origen) {
            this.provinciasO = r.data;
          } else {
            this.provinciasD = r.data;
          }
        } else {
          console.log('No hay provincias');
        }
      },
      err => {
        console.log(err);
        console.log('Erro conexion');
      }
    );
  }

  getCanton(origen) {
    console.log(origen);
    let id;
    if (origen) {
      id = this.routeForm.value.originP.id_province;
    } else {
      id = this.routeForm.value.destinationP.id_province;
    }
    this.routeService.getCantonByProvince(id).subscribe(
      res => {
        let r: any = res;
        if (r.success) {
          if (origen) {
            this.routeForm.patchValue({
              originC: null
            });
            this.cantonesO = r.data;
          } else {
            this.routeForm.patchValue({
              destinationC: null
            });
            this.cantonesD = r.data;
          }
        } else {
          console.log('No hay cantones');
        }
      },
      err => {
        console.log(err);
        console.log('Erro conexion');
      }
    )
  }

  getDistric(origen) {
    console.log(origen);
    let id;
    if (origen) {
      id = this.routeForm.value.originC.id_canton;
    } else {
      id = this.routeForm.value.destinationC.id_canton;
    }
    this.routeService.getDistricByCanton(id).subscribe(
      res => {
        let r: any = res;
        if (r.success) {
          if (origen) {
            this.routeForm.patchValue({
              origin: null
            });
            this.districtoO = r.data;
          } else {
            this.routeForm.patchValue({
              destination: null
            });
            this.districtoD = r.data;
          }
        } else {
          console.log('No hay cantones');
        }
      },
      err => {
        console.log(err);
        console.log('Erro conexion');
      }
    );
  }

  closeUpdated(){
    this.updated = undefined;
  }

  resetUpdated(){
    this.updated = UPDATED;
  }

}
