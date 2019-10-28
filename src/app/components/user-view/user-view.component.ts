import { Component, OnInit } from '@angular/core';
import { Map, tileLayer, latLng, Routing, marker } from 'leaflet';
import 'leaflet-routing-machine';
import { CompanyService } from 'src/app/services/company.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouteService } from 'src/app/services/route.service';
@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements OnInit {


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


  constructor(
    private companyService: CompanyService,
    private formBuilder: FormBuilder,
    private routeService: RouteService
  ) { }

  ngOnInit() {
    this.loadCompanies();
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
    this.getProvince(true);
    this.getProvince(false);
  }


  createRoute() {
    this.submitted = true;

    if (this.routeForm.invalid) {
      console.log('Errores en el form');
      return;
    }

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
  }

  loadCompanies() {
    this.companyService.getCompanies().subscribe(
      res => {
        let r: any = res;
        if (r.success) {
          console.log(r.data);
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

  getProvince(origen) {
    this.routeService.getProvince().subscribe(
      res => {
        let r: any = res;
        if (r.success) {
          console.log(r.data)
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
          console.log(r.data);
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
          console.log(r.data);
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
    )
  }












  onMapReady(map: Map): void {
    this.map = map;

    this.route = Routing.control({
      draggableWaypoints: false,
      addWaypoints: false,
      messages: this.messages,
      waypoints: this.points,
      show: false,
      createMarker: function (i, wp) {

        return marker(wp.latLng).bindPopup(`${this.messages[i].me}`);

      }

    }).addTo(this.map);
  }

  onClickMap(map: Map) {
    /*console.log(map.latlng.lat + ',' + map.latlng.lng);
  
    console.log(this.points);
    console.log(this.route.options.m);
    */
    console.log(this.route);
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


}
