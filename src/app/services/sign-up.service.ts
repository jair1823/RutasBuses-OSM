import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  constructor(private http: HttpClient) { }

  register(data) {
    return this.http.post('http://localhost:8000/api/user',data);
  }

  checkUnique(data){
    return this.http.post('http://localhost:8000/api/user/unique',data)
  }
}
