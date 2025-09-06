import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/services/commonService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-demographics',
  templateUrl: './demographics.component.html',
  styleUrls: ['./demographics.component.css']
})
export class DemographicsComponent implements OnInit {
  @ViewChild('responseModel') responseModel: TemplateRef<any>;
  @ViewChild('successModel') successModel: TemplateRef<any>;
  @ViewChild('DeletesuccessModel') DeletesuccessModel: TemplateRef<any>;
  @ViewChild('ConfirmationModal') ConfirmationModal: TemplateRef<any>;
  @ViewChild('changeMobileConfirmationModal') changeMobileConfirmationModal: TemplateRef<any>;
  @ViewChild('delConfirmationModal') delConfirmationModal: TemplateRef<any>;
  @ViewChild('deactivateModal') deactivateModal: TemplateRef<any>;
  cmsScreenList: any = {
    "demographics": false,
    "transaction-history": false,
    "added-accounts": false,
    "added-cards": false
  };
  isDeactivated = false;
  enableConsumerDeactivateFlow = false;
  customerId: any;
  successMessage: any;
  errorMessage: any;
  submitted = false;
  view = false;
  cityList = [];
  viewHistoryAccess = false;
  logoutAccess = false;
  deleteCustomerAccess = false;
  customerData: any;
  isMobileInputVisible = false;
  selectedDeactivationReason = '';
  deactivationReasons: any[] = [];
  isDeactivationSubmitted = false;
  constructor(private router: Router, private route: ActivatedRoute, private commonService: CommonService, private modalService: NgbModal, private cookie_service: CookieService) { }

  uploadForm = new FormGroup({
    mobileNum: new FormControl('', Validators.required)
  })

  ngOnInit() {
    this.cmsScreenList['demographics'] = true;
    let access = JSON.parse(localStorage.getItem('acl'));
    access.forEach((element) => {
      if (element.key == 'CMS_TRANSACTION_HISTORY') {
        this.viewHistoryAccess = element.access.list;
      }
    })
    access.forEach((element) => {
      if (element.key == 'CMS_LOGOUT') {
        this.logoutAccess = element.access.edit;
      }
      if (element.key == 'CMS') {
        this.deleteCustomerAccess = element.access.delete;
      }
    })
    this.route.queryParams.subscribe((params) => {
      let response = JSON.parse(params['data']);
      if (response) {
        this.customerId = response;
        this.commonService.setCustomerId(this.customerId);
        document.getElementById('loader')!.style.display = 'block';
        this.commonService.getCustomerData(response).subscribe(res => {
          document.getElementById('loader')!.style.display = 'none';
          if (res.success == true) {
            this.customerData = res.result.data;
            this.commonService.setAccountDetails(this.customerData.accountDetails);
            this.commonService.setCardsDetails(this.customerData.cards);
          }
          else {
            this.errorMessage = res.message;
            this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
          }
        }, error => {
          document.getElementById('loader').style.display = 'none';
          this.errorMessage = "There is a problem processing your request. Please try again after some time.";
          this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
        });
      }
    });

    let body = { "lookups": ["city", "enableConsumerDeactivateFlow", "AccountDeactivationReason"] };
    document.getElementById('loader').style.display = 'block';
    this.commonService.getLookups(body).subscribe(res => {
      document.getElementById('loader').style.display = 'none';
      if (res.success == true) {
        this.cityList = res.result.city;
        this.enableConsumerDeactivateFlow = res.result.enableConsumerDeactivateFlow;
        this.deactivationReasons = res.result.AccountDeactivationReason;
      } else {
        this.cityList = [];
      }
    });
  }
  getData() {
    this.route.queryParams.subscribe((params) => {
      let response = JSON.parse(params['data']);
      if (response) {
        this.customerId = response;
        this.commonService.setCustomerId(this.customerId);
        document.getElementById('loader')!.style.display = 'block';
        this.commonService.getCustomerData(response).subscribe(res => {
          document.getElementById('loader')!.style.display = 'none';
          if (res.success == true) {
            this.customerData = res.result.data;
            this.commonService.setAccountDetails(this.customerData.accountDetails);
            this.commonService.setCardsDetails(this.customerData.cards);
          }
          else {
            this.errorMessage = res.message;
            this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
          }
        }, error => {
          document.getElementById('loader').style.display = 'none';
          this.errorMessage = "There is a problem processing your request. Please try again after some time.";
          this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
        });
      }
    });
  }

  // updateMobileNum() {
  //   this.isMobileInputVisible = true;
  //   this.uploadForm.get('mobileNum').setValidators(Validators.required);
  //   this.uploadForm.get('mobileNum').updateValueAndValidity();

  // }
  activateAccount() {
    this.customerData.status = 'ACTIVE';
    let body = {
      "id": this.customerData.id
    }
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.toggleCustomerStatus(body).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.successMessage = res.message;
        this.modalService.dismissAll();
        this.modalService.open(this.successModel);
      }
      else {
        this.errorMessage = res.message;
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
    })
  }

  confirmDeactivate() {
    this.isDeactivationSubmitted = true;
    if (!this.selectedDeactivationReason) {
      return;
    }
    this.customerData.status = 'DEACTIVATED';
    this.isDeactivated = true;
    let body = {
      "id": this.customerData.id,
      "reason": this.selectedDeactivationReason
    }
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.toggleCustomerStatus(body).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.successMessage = res.message;
        this.modalService.dismissAll();
        this.modalService.open(this.successModel);
      }
      else {
        this.errorMessage = res.message;
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
    })

  }
  openDeactivateModal() {
    this.selectedDeactivationReason = '';
    this.isDeactivationSubmitted = false;
    this.modalService.open(this.deactivateModal, {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'deactivate-account-modal'
    });
  }





  updateNumField() {
    this.isMobileInputVisible = false;
    this.uploadForm.get('mobileNum').clearValidators()
    this.uploadForm.get('mobileNum').updateValueAndValidity();
    this.uploadForm.get('mobileNum').setValue("")

  }

  openUpdateMobileModel() {
    this.submitted = true;
    if (!this.uploadForm.valid) {
      return;
    }
    this.modalService.open(this.changeMobileConfirmationModal)

  }

  updateNum() {
    this.submitted = true;
    if (!this.uploadForm.valid) {
      return;
    }

    let body = {
      "phone": this.uploadForm.controls.mobileNum.value,
      "customerId": this.customerId
    }

    document.getElementById('loader')!.style.display = 'block';
    this.commonService.editMobile(body, this.customerId).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.modalService.dismissAll();
        this.successMessage = res.message
        this.modalService.open(this.successModel, { backdrop: 'static', keyboard: false });
        this.getData();
        this.updateNumField();
      }
      else {
        this.modalService.dismissAll();
        this.errorMessage = res.message;
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
        this.updateNumField();
      }
    });



  }

  goToPath(screenName) {
    for (let [key] of Object.entries(this.cmsScreenList)) {
      if (key == screenName) {
        this.cmsScreenList[key] = true;
      } else {
        this.cmsScreenList[key] = false;
      }
    }
  }

  spaceRestrict(event: any) {
    if (event.target.selectionStart == 0 && event.code == 'Space')
      event.preventDefault();
  }

  goBack() {
    this.router.navigateByUrl('/admin/customer-management');
  }

  // goToAccountdetails(screenName) {
  //   if(screenName == 'added-accounts') {
  //     this.cmsScreenList['added-accounts'] = true;
  //     this.cmsScreenList['demographics'] = false;
  //     this.cmsScreenList['transaction-history'] = false;
  //     // this.router.navigate(['/admin/added-accounts'], { queryParams: { data: JSON.stringify(this.customerData.accountDetails) }, skipLocationChange: true });
  //   } else {
  //     this.cmsScreenList['added-accounts'] = false;
  //     this.cmsScreenList['demographics'] = false;
  //     this.cmsScreenList['transaction-history'] = false;
  //   }

  // }
  isScreenMobile() {
    let screenWidth = window.innerWidth;
    if (screenWidth < 900) return true;
    else return false;
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  openConfirmModal() {
    this.modalService.dismissAll();
    this.modalService.open(this.ConfirmationModal)
  }
  delConfirmModal() {
    this.modalService.dismissAll();
    this.modalService.open(this.delConfirmationModal)
  }
  close() {
    this.router.navigateByUrl('/admin/customer-management');
    this.modalService.dismissAll();
  }


  getLookups(value) {
    let element = this.cityList.filter(element => element.key == value)[0];
    if (element) {
      return element.value;
    }

  }

  logoutCustomer() {
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.logoutCustomers(this.customerId).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.modalService.dismissAll();
        this.successMessage = res.message;
        this.modalService.open(this.successModel)
      }
      else {
        this.modalService.dismissAll();
        this.errorMessage = res.message;
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
    }, error => {
      document.getElementById('loader').style.display = 'none';
      this.errorMessage = "There is a problem processing your request. Please try again after some time.";
      this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
    });
  }
  confirmDelete() {
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.deleteUser(this.customerId).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.closeModal();
        this.successMessage = res.message;
        this.modalService.open(this.DeletesuccessModel, { backdrop: 'static', keyboard: false });
      } else {
        this.errorMessage = res.message;
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
    });
  }
}
