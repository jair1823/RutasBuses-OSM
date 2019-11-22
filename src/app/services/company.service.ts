import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { api } from "./url.api";
@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { }

  save(data) {
    return this.http.post(`${api}/company`, data);
  }

  getCompany(id) {
    return this.http.get(`${api}/company/${id}`);
  }

  getCompanies() {
    return this.http.get(`${api}/company`);
  }

  getCompaniesActive() {
    return this.http.get(`${api}/company/index/activas`);
  }

  deleteCompany(id) {
    return this.http.delete(`${api}/company/${id}`);
  }

  restore(id) {
    return this.http.get(`${api}/company/restore/${id}`);
  }

  updateCompany(id, data) {
    return this.http.put(`${api}/company/${id}`, data);
  }

  createLog(id_user, id_company) {
    return this.http.get(`${api}/company_log/new/${id_user}/${id_company}`);
  }

  updateLog(id_user, id_company) {
    return this.http.get(`${api}/company_log/update/${id_user}/${id_company}`);
  }

  deleteLog(id_user, id_company) {
    return this.http.get(`${api}/company_log/delete/${id_user}/${id_company}`);
  }

  restoreLog(id_user, id_company) {
    return this.http.get(`${api}/company_log/restore/${id_user}/${id_company}`);
  }
}
