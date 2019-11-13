import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { api } from "./url.api";
@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor(private http: HttpClient) { }

  createNewPlace(data) {
    return this.http.post(`${api}/new_place`, data);
  }

  getProvince() {
    return this.http.get(`${api}/province`);
  }

  getCantonByProvince(id) {
    return this.http.get(`${api}/canton/by_province/${id}`);
  }

  getDistricByCanton(id) {
    return this.http.get(`${api}/distric/by_canton/${id}`);
  }

  createRoute(data) {
    return this.http.post(`${api}/route`, data);
  }

  createPoint(data) {
    return this.http.post(`${api}/point`, data);
  }

  getRoutes() {
    return this.http.get(`${api}/route`);
  }

  getRoute(id) {
    return this.http.get(`${api}/route/${id}`);
  }

  deletePoints(id) {
    return this.http.delete(`${api}/point/${id}`);
  }

  deleteRoute(id) {
    return this.http.delete(`${api}/route/${id}`);
  }

  updateRoute(id, data) {
    return this.http.put(`${api}/route/${id}`, data);
  }

  getroutesByCompany(id) {
    return this.http.get(`${api}/route/by_company/${id}`);
  }

  getPoints(id){
    return this.http.get(`${api}/point/${id}`);
  }
}
