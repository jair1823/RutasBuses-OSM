import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { api } from "./url.api";
@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

  constructor(private http:HttpClient) { }

  change_password(data){
    return this.http.post(`${api}/user/changePassword`,data);
  }
}
