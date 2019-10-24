import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SignInService {

  constructor(private http: HttpClient) { }

  authenticate(data) {
    return this.http.post('http://localhost:8000/api/user/authenticate', data);
  }

  saveLocal(data) {
    localStorage.setItem('user', JSON.stringify(data));
  }

  isLogged() {
    return (localStorage.getItem('user') != null);
  }

  getLocal() {
    return JSON.parse(localStorage.getItem('user'));
  }

  removeLocal() {
    localStorage.clear();
  }
}
