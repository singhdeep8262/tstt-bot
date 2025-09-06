import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonService } from '../services/commonService';
import { TranslationLoaderService } from '../services/translationLoader.service';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../services/base.service';
import { CookieService } from 'ngx-cookie';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent extends BaseService implements OnInit {
  @ViewChild('responseModel') responseModel: TemplateRef<any>;
  errorMessage: any;
  constructor(private cookie_service: CookieService, private translator: TranslationLoaderService, public commonService: CommonService, http: HttpClient, private modalService: NgbModal,) {
    super(http);
  }
  ngOnInit() {
    this.isLoggedIn();
    this.setToken();
    this.startInterval();
  }

  setToken() {
    if (this.cookie_service.get('TOKEN') != '' && (this.cookie_service.get('TOKEN') != undefined || this.cookie_service.get('TOKEN') != null)) {
      this.commonService.setAccessToken(this.cookie_service.get('TOKEN'));
      CommonService.isAuthenticated = true;
    } else {
      CommonService.isAuthenticated = false;
      this.cookie_service.removeAll();
    }
  }

  startInterval() {
    let interval = setInterval(() => {
      if(CommonService.isShowSessionTimeoutModal) {
        this.modalService.dismissAll();
        this.errorMessage = 'Your account is logged out. Please login again to continue.';
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
        CommonService.isShowSessionTimeoutModal = false;
      }
      if(CommonService.sessionTimeout == true) {
        this.modalService.dismissAll();
        this.errorMessage = 'Your session is expired due to inactivity. Please login again to continue.';
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
        CommonService.sessionTimeout = false;
      }
    }, 1000);
  }

  isLoggedIn() {
    return CommonService.isAuthenticated;
  }

  closeModal() {
    this.modalService.dismissAll();
  }
}
