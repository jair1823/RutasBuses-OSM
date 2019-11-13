import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { api } from './url.api';
@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  constructor(private http: HttpClient) { }

  register(data) {
    return this.http.post(`${api}/user`, data);
  }

  checkUnique(data) {
    return this.http.post(`${api}/user/unique`, data)
  }
}
