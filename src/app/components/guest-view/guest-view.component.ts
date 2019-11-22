import { Component, OnInit } from '@angular/core';
import { Map, tileLayer, latLng, Routing, marker, circle } from 'leaflet';
import 'leaflet-routing-machine';
import { CompanyService } from 'src/app/services/company.service';
import { RouteService } from 'src/app/services/route.service';
@Component({
  selector: 'app-guest-view',
  templateUrl: './guest-view.component.html',
  styleUrls: ['./guest-view.component.css']
})
export class GuestViewComponent implements OnInit {

  options;
  map: Map;

  routesInfo: any[] = [];//informacion de la ruta
  routes: any[] = [];//route control para cada routa


  colors = [
    'green',
    'red',
    'blue',
    'purple',
    'pink',
    'yellow'
  ]

  query: number = 0;


  companies: any[] = [];
  selectedCompany: any = null;

  allRoutes: any[] = [];
  selectedRoute: any = null;



  provinces: any[] = [];
  cantones: any[] = [];
  districs: any[] = [];
  selectedProvince: any = null;
  selectedCanton: any = null;
  selectedDistric: any = null;


  accessClick: boolean = false;
  circle;
  routeForWrite = [];

  constructor(private company: CompanyService, private routeService: RouteService) { }

  ngOnInit() {
    console.log(7 % 8)
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
  }

  onMapReady(map) {
    this.map = map;
    console.log(map);
    navigator.geolocation.getCurrentPosition(pos => {
      console.log(pos.coords);
      this.map.setView([pos.coords.latitude, pos.coords.longitude], 17);
    })
  }
  preparing() {
    if (this.circle) {
      this.map.removeLayer(this.circle);
    }
    this.accessClick = false;
    switch (this.query) {
      case 1:
        this.companyQuery();
        break;
      case 2:
        this.routeQuery();
        break;
      case 3:
        this.districQuery();
        break;
      case 4:
        this.stopQuery();
        break;
      default:
        console.log("nel");
        break;
    }
  }


  stopQuery() {
    this.accessClick = true;
  }

  onClickMap(e) {
    this.refreshMap();
    if (!this.accessClick) {
      return;
    }
    if (this.circle) {
      this.map.removeLayer(this.circle);
    }
    this.circle = circle([e.latlng.lat, e.latlng.lng], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 40
    });
    this.map.addLayer(this.circle);

    this.routeService.getAllPoints().subscribe(
      res => {
        let r: any = res;
        if (r.success) {
          this.samePosition(r.data);
        } else {
          console.log('No hay puntos');
        }
      },
      err => {
        console.log(err);
        console.log('Error con laravel.');
      }
    )

    console.log(this.circle);
    //console.log(latLng(map.latlng.lat, map.latlng.lng));
  }


  samePosition(r) {
    
    for (let index = 0; index < r.length; index++) {
      const p = r[index];

      var distance = this.map.distance([p.lat, p.lng], this.circle.getLatLng())
      var isInside = distance <= this.circle.getRadius();
      if (isInside) {
        var id_route = p.id_route;
        if (!this.routeForWrite.includes(id_route)) {
          this.routeForWrite.push(id_route);
        }
      }


    }
    console.log(this.routeForWrite);
    console.log('vamos')
    let data = {
      ids: this.routeForWrite
    }
    this.routeService.getRoutesByIds(data).subscribe(
      res => {
        let r: any = res;
        if (r.success) {
          console.log(r.data);
          this.routesInfo = r.data;
          this.getRoutePoints();
        } else {
          console.log('No hay puntos');
        }
      },
      err => {
        console.log(err);
        console.log('Error con laravel.');
      }
    )
  }


  companyQuery() {
    this.selectedCompany = null;
    this.company.getCompaniesActive().subscribe(
      res => {
        let r: any = res;
        if (r.success) {
          this.companies = r.data;
          //this.closeNoCompanies();
        } else {
          //no existe
          //this.resetNoCompanies();
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
  selectCompany() {
    this.refreshMap();
    this.routeService.getRoutesByCompany(this.selectedCompany.id_company).subscribe(
      res => {
        let r: any = res;
        if (r.success) {
          this.routesInfo = r.data;
          this.getRoutePoints();
        } else {
          this.routesInfo = [];
          console.log('no routes')
        }
      },
      err => {
        console.log(err);
        console.log('error con laravel');
        this.routesInfo = [];
      }
    );
  }

  routeQuery() {
    this.selectedRoute = null;
    this.routeService.getActiveRoutes().subscribe(
      res => {
        let r: any = res;
        if (r.success) {
          this.allRoutes = r.data;
          console.log(r.data)
          //this.closeNoCompanies();
        } else {
          //no existe
          //this.resetNoCompanies();
          console.log('No hay rutas.');
          this.allRoutes = [];
        }
      },
      err => {
        console.log(err);
        console.log('Error con laravel.');
        this.allRoutes = [];
      }
    )
  }

  selectRoute() {
    this.refreshMap();
    this.routeService.getRoute(this.selectedRoute.id_route).subscribe(
      res => {
        let r: any = res;
        if (r.success) {
          this.routesInfo = r.data;
          this.getRoutePoints();
        } else {
          this.routesInfo = [];
          console.log('no routes')
        }
      },
      err => {
        console.log(err);
        console.log('error con laravel');
        this.routesInfo = [];
      }
    )
  }


  districQuery() {
    this.selectedProvince = null;
    this.selectedCanton = null;
    this.selectedDistric = null;
    this.routeService.getProvince().subscribe(
      res => {
        let r: any = res;
        if (r.success) {
          this.provinces = r.data;
        } else {
          this.provinces = [];
        }
      },
      err => {
        console.log(err);
        console.log('error con laravel');
        this.provinces = [];
      }
    )
  }

  selectProvince() {
    this.selectedCanton = null;
    this.selectedDistric = null;
    console.log();
    this.routeService.getCantonByProvince(this.selectedProvince.id_province).subscribe(
      res => {
        let r: any = res;
        if (r.success) {
          this.cantones = r.data;
        } else {
          this.cantones = [];
          console.log('No hay cantones');
        }
      },
      err => {
        this.cantones = [];
        console.log(err);
        console.log('Erro conexion');
      }
    )
  }

  selectCanton() {
    this.selectedDistric = null;
    this.routeService.getDistricByCanton(this.selectedCanton.id_canton).subscribe(
      res => {
        let r: any = res;
        if (r.success) {
          this.districs = r.data;
        } else {
          this.districs = [];
          console.log('No hay distritos');
        }
      },
      err => {
        this.districs = [];
        console.log(err);
        console.log('Erro conexion');
      }
    );
  }

  selectDistric() {
    this.refreshMap();
    this.routeService.getRoutesByDistric(this.selectedDistric.id_distric).subscribe(
      res => {
        let r: any = res;
        if (r.success) {
          this.routesInfo = r.data;
          this.getRoutePoints();
        } else {
          this.routesInfo = [];
          console.log('no routes')
        }
      },
      err => {
        console.log(err);
        console.log('error con laravel');
        this.routesInfo = [];
      }
    );
  }

  /**
   * despues de cargar routesInfo
   * esta funcion obtiene los puntos de cada ruta.
   */
  getRoutePoints() {
    for (let index = 0; index < this.routesInfo.length; index++) {
      const r = this.routesInfo[index];
      this.routeService.getPoints(r.id_route).subscribe(
        res => {
          let r: any = res;
          if (r.success) {
            this.createRouteControl(r.data, index);
            var top = document.getElementsByClassName("leaflet-top leaflet-right");
            while (top[0].firstChild) {
              console.log('entre')
              top[0].removeChild(top[0].firstChild);
            }
          } else {
            console.log('no points');
          }
        },
        err => {
          console.log(err);
          console.log('error con laravel');
        }
      );
    }

  }

  /**
   * 
   * @param p puntos de la ruta
   * @param c index de la ruta que dibujo
   * crea una router control y lo agrega al mapa
   */
  createRouteControl(p, c) {
    let messages = [];
    let points = [];
    let contador = 0;
    for (let index = 0; index < p.length; index++) {
      const point = p[index];
      let marker = {
        id: contador,
        me: point.description
      }
      contador++;
      messages.push(marker);
      points.push(latLng(point.lat, point.lng));
      contador++;
    }
    let r = Routing.control({
      draggableWaypoints: false,
      addWaypoints: false,
      messages: messages,
      waypoints: points,
      show: false,
      lineOptions: {
        styles: [{ color: this.colors[c % this.colors.length] }]
      },
      createMarker: function (i, wp) {
        return marker(wp.latLng).bindPopup(`${this.messages[i].me}`);
      }
    });
    this.map.addControl(r);
    this.routes.push(r);


  }

  //quita la rutas y pone arreglos en 0;
  refreshMap() {
    for (let index = 0; index < this.routes.length; index++) {
      const r = this.routes[index];
      this.map.removeControl(r);
    }
    this.routes = [];
    this.routesInfo = [];
    this.routeForWrite = [];
  }

}
