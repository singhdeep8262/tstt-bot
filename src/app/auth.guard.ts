import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { Observable } from 'rxjs';

import { CommonService } from './../services/commonService';
import { AuthService } from './auth.service';
import { CanActivateChild } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private router: Router,
    private authService: AuthService,
    private commonService: CommonService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    return this.checkLogin(url);
  }
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.checkLogin(state.url);
  }
  
    checkLogin(url: string): boolean {
      if(url == '/admin/login' ) {
        return true;
      }
      if(CommonService.isAuthenticated == true) {
        return true;
      }
      this.router.navigate(['admin/login'], { queryParams: { returnUrl: url }});
      return false;
    }

  isAllowedToAccess(url: any) {
    // if(url == '/dashboard/homeScreen'){
    //   return true;
    // }
    // if (!this.commonService) {
    //   return this.unAuthorizedAction();
    // }
    // let res = this.commonService.getSecurityObject();
    // if (!res || !res.accessMap || (url != '' && (res.accessMap[url] === undefined || res.accessMap[url].accessMode === 'h' ) )) {
    //   return this.unAuthorizedAction();
    // }
    // return true;
  }
  unAuthorizedAction(): any {
    this.router.navigate(['error']);
    return false;
  }

}
