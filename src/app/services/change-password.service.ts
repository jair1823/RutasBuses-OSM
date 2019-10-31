import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

  constructor(private http:HttpClient) { }

  change_password(data){
    return this.http.post('http://localhost:8000/api/user/changePassword',data);
  }
}
