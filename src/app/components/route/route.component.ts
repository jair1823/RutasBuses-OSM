import { Component, OnInit } from '@angular/core';
import { RouteService } from 'src/app/services/route.service';

import { Alert } from 'src/app/models/alert';
import { SignInService } from 'src/app/services/sign-in.service';


const NOROUTES: Alert = {
  type: 'info', message: 'No hay rutas creadas.'
};

const DELETEDROUTE: Alert = {
  type: 'info', message: 'Se elimino la ruta.'
};

const RESTOREROUTE: Alert = {
  type: 'info', message: 'Se restauro la ruta.'
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
  createdRoute: Alert;

  message: Alert;

  bDolar:boolean = false;

  cDolar;

  constructor(private routeService: RouteService, private login: SignInService) { }

  ngOnInit() {
    this.getRoutes();
    if (localStorage.getItem('created_route') != null) {
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
          this.routeService.deleteLog(this.login.getLocal().id_user, id).subscribe(
            res => {
              console.log(res);
              console.log('listo.');
            },
            err => {
              console.log(err);
              console.log('Error con laravel.');
            }
          );
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

  restoreRoute(id){
    this.routeService.restore(id).subscribe(
      res => {
        let r: any = res;
        if (r.success) {
          this.resetRestore();
          this.getRoutes();
          this.routeService.restoreLog(this.login.getLocal().id_user, id).subscribe(
            res => {
              console.log(res);
              console.log('listo.');
            },
            err => {
              console.log(err);
              console.log('Error con laravel.');
            }
          );
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

  closeMessage() {
    this.message = undefined;
  }
  resetNoRoutes() {
    this.message = NOROUTES;
  }

  resetDeleteRoute() {
    this.message = DELETEDROUTE;
  }

  resetCreatedRoute() {
    this.message = CREATEDROUTE;
  }
  resetRestore() {
    this.message = RESTOREROUTE;
  }

  conversion(m){
    return (m/this.cDolar).toFixed(2);
  }

  dolares(){
    

    this.routeService.dolar().subscribe(
      res =>{
        let r:any = res;
        this.cDolar = r.compra;
        this.bDolar = !this.bDolar;
      },
      err => {
        console.log(err);
      }
    )
  }


}
