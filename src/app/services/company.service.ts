import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http:HttpClient) { }

  save(data) {
    return this.http.post('http://localhost:8000/api/company',data);
  }

  getCompany(id){
    return this.http.get(`http://localhost:8000/api/company/${id}`);
  }

  getCompanies(){
    return this.http.get('http://localhost:8000/api/company');
  }

  deleteCompany(id){
    return this.http.delete(`http://localhost:8000/api/company/${id}`);
  }

  updateCompany(id,data){
    return this.http.put(`http://localhost:8000/api/company/${id}`,data);
  }
}
