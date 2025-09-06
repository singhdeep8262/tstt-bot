import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonService } from '../../../services/commonService';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { AuthService } from '../../auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('responseModel') responseModel: TemplateRef<any>;
  hidePin: Boolean = true;
  errorMessage: any;
  loginForm = new FormGroup({
    "username": new FormControl('', Validators.required),
    "password": new FormControl('', Validators.required),
    // "remember": new FormControl(false)
  })
  constructor(private route: ActivatedRoute,
    private commonService: CommonService,
    private router: Router, private cookie_service: CookieService,
    private authService: AuthService,
    private modalService: NgbModal) { }

  ngOnInit() {
    if (CommonService.isAuthenticated == true) {
      this.router.navigateByUrl('admin/users');
    }
  }

  showPin() {
    { { this.hidePin ? 'visibility_off' : 'visibility' } }
    this.hidePin = !this.hidePin;
  }

  login() {
    if (!this.loginForm.valid) {
      return;
    }
    let body = {
      "username": this.loginForm.controls.username.value,
      "password": this.loginForm.controls.password.value
    }
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.login(body).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        // if (res.isDeactivated == false) {
          this.commonService.setAccessToken(res.result.token);
          this.authService.setToken(res.result.token);
          if (res.result.acl.length == 0) {
            this.authService.logout();
            CommonService.isAuthenticated = false;
            this.modalService.dismissAll();
            document.getElementById('loader')!.style.display = 'block';
            this.commonService.logoutUnauthenticated('').subscribe(res => {
              document.getElementById('loader')!.style.display = 'none';
              this.errorMessage = "Permission denied!";
              this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
            });
          // }

        } else {
          // this.errorMessage = res.accountDeactivatedMessage;
          // this.modalService.dismissAll();
          // this.modalService.open(this.responseModel);
          CommonService.isAuthenticated = true;
          localStorage.setItem('acl', JSON.stringify(res.result.acl));
          this.gotoPath(res.result.acl);
        }

      } else {
        this.errorMessage = res.message;
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
    }, error => {
      document.getElementById('loader').style.display = 'none';
      this.errorMessage = "There is a problem processing your request. Please try again after some time.";
      this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
    });
  }
  closeModal() {
    this.modalService.dismissAll();
  }

  spaceRestrict(event: any) {
    if (event.target.selectionStart == 0 && event.code == 'Space')
      event.preventDefault();
  }

  gotoPath(acl) {
    let keepGoing = true;
    acl.forEach(element => {
      if (element.key == 'USER' && element.access.list && keepGoing) {
        this.router.navigateByUrl('/admin/users');
        keepGoing = false;
      }
      else if (element.key == 'ROLE' && element.access.list && keepGoing) {
        this.router.navigateByUrl('/admin/roles')
        keepGoing = false;
      }
      else if (element.key == 'CMS' && element.access.list && keepGoing) {
        this.router.navigateByUrl('/admin/customer-management')
        keepGoing = false;
      }
      else if (element.key == 'PUSH_NOTIFICATIONS' && element.access.list && keepGoing) {
        this.router.navigateByUrl('/admin/push-notification')
        keepGoing = false;
      }
      else if (element.key == 'MODULE' && element.access.list && keepGoing) {
        this.router.navigateByUrl('/admin/modules')
        keepGoing = false;
      }
      else if (element.key == 'BUNDLE_MANAGEMENT' && element.access.list && keepGoing) {
        this.router.navigateByUrl('/admin/bundles')
        keepGoing = false;
      }
      else if (element.key == 'PROMOTIONS' && element.access.list && keepGoing) {
        this.router.navigateByUrl('/admin/promotions')
        keepGoing = false;
      }
      else if (element.key == 'CUSTOMER_TRANSACTION_HISTORY' && element.access.list && keepGoing) {
        this.router.navigateByUrl('/admin/users-transaction-history')
        keepGoing = false;
      }
      else if (element.key == 'COUPON_TRANSACTION_HISTORY' && element.access.list && keepGoing) {
        this.router.navigateByUrl('/admin/coupon-transaction-history')
        keepGoing = false;
      }
      else if (element.key == 'REDEEMED_COUPON_TRANSACTION_HISTORY' && element.access.list && keepGoing) {
        this.router.navigateByUrl('/admin/redeemed-coupon-transaction-history')
        keepGoing = false;
      }
      else if (element.key == 'INFLUENCER_COUPON_TRANSACTION_HISTORY' && element.access.list && keepGoing) {
        this.router.navigateByUrl('/admin/influencer-coupon-transaction-report')
        keepGoing = false;
      }
      else if ((element.key == 'REFUND_PAYMENT_REPORT') && element.access.list && keepGoing) {
        this.router.navigateByUrl('/admin/refund-payment')
        keepGoing = false;
      }
      else if ((element.key == 'LOCATIONS') && element.access.list && keepGoing) {
        this.router.navigateByUrl('/admin/locations')
        keepGoing = false;
      }
      else if ((element.key == 'ALERTS') && element.access.list && keepGoing) {
        this.router.navigateByUrl('/admin/alert')
        keepGoing = false;
      }
      else if ((element.key == 'FAQ_MANAGEMENT') && element.access.list && keepGoing) {
        this.router.navigateByUrl('/admin/faq')
        keepGoing = false;
      }
      else if ((element.key == 'SURVEY_MANAGEMENT') && element.access.list && keepGoing) {
        this.router.navigateByUrl('/admin/survey-management')
        keepGoing = false;
      }
    })
  }
}
