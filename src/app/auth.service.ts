import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private myRoute: Router, private cookie_service: CookieService) { }
  setToken(token: string) {
    this.cookie_service.put('TOKEN', token);
  }
  getToken() {
    return this.cookie_service.get('TOKEN');
  }
  isLoggednIn() {
    return this.getToken() !== null;
  }
  logout() {
    this.cookie_service.remove('TOKEN');
    this.myRoute.navigate(['admin/login']);
  }
}
