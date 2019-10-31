import { Component, OnInit } from '@angular/core';
import { RouteService } from 'src/app/services/route.service';

import { Alert } from 'src/app/models/alert';


const NOROUTES: Alert = {
  type: 'info', message: 'No hay rutas creadas.'
};

const DELETEDROUTE: Alert = {
  type: 'info', message: 'Se elimino la ruta.'
};

const CREATEDROUTE: Alert = {
  type: 'success', message: 'Ruta creada!.'
};

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css']
})
export class RouteComponent implements OnInit {

  routes: any[];

  noRoutes: Alert;
  deletedRoute: Alert;
  createdRoute:Alert;

  constructor(private routeService: RouteService) { }

  ngOnInit() {
    this.getRoutes();
    if(localStorage.getItem('created_route')!=null){
      localStorage.removeItem('created_route');
      this.resetCreatedRoute();
    }
  }

  getRoutes() {
    this.routeService.getRoutes().subscribe(
      res => {
        let r: any = res;
        if (r.success) {
          this.routes = r.data;
          console.log(this.routes);
        } else {
          this.resetNoRoutes();
          this.routes = [];
        }
      },
      err => {
        console.log(err);
        console.log('Error con laravel.');
        this.routes = [];
      }
    )
  }

  deleteRoute(id) {
    this.routeService.deleteRoute(id).subscribe(
      res => {
        let r: any = res;
        if (r.success) {
          this.getRoutes();
          this.resetDeleteRoute();
        } else {
          alert('Error al eliminar ruta');
        }
      },
      err => {
        console.log(err);
        console.log('Error con laravel. borrando ruta');
      }
    )
  }

  deletePoints(id) {
    this.routeService.deletePoints(id).subscribe(
      res => {
        let r: any = res;
        if (r.success) {
          this.deleteRoute(id);
        } else {
          this.deleteRoute(id);
        }
      },
      err => {
        console.log(err);
        console.log('Error con laravel. borrando puntos');
      }
    )
  }


  closeNoRoutes() {
    this.noRoutes = undefined;
  }
  resetNoRoutes() {
    this.noRoutes = NOROUTES;
  }

  closeDeleteRoute() {
    this.deletedRoute = undefined;
  }
  resetDeleteRoute() {
    this.deletedRoute = DELETEDROUTE;
  }

  closeCreatedRoute() {
    this.createdRoute = undefined;
  }
  resetCreatedRoute() {
    this.createdRoute = CREATEDROUTE;
  }


}
