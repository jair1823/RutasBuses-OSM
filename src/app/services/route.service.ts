import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor(private http: HttpClient) { }

  createNewPlace(data) {
    return this.http.post('http://localhost:8000/api/new_place', data);
  }

  getProvince() {
    return this.http.get('http://localhost:8000/api/province');
  }

  getCantonByProvince(id) {
    return this.http.get(`http://localhost:8000/api/canton/by_province/${id}`);
  }

  getDistricByCanton(id) {
    return this.http.get(`http://localhost:8000/api/distric/by_canton/${id}`);
  }

  createRoute(data) {
    return this.http.post('http://localhost:8000/api/route', data);
  }

  createPoint(data) {
    return this.http.post('http://localhost:8000/api/point', data);
  }

  getRoutes() {
    return this.http.get(`http://localhost:8000/api/route`);
  }

  getRoute(id) {
    return this.http.get(`http://localhost:8000/api/route/${id}`);
  }

  deletePoints(id) {
    return this.http.delete(`http://localhost:8000/api/point/${id}`);
  }

  deleteRoute(id) {
    return this.http.delete(`http://localhost:8000/api/route/${id}`);
  }

  updateRoute(id,data){
    return this.http.put(`http://localhost:8000/api/route/${id}`,data);
  }

}
