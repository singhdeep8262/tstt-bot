import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonService } from '../../../services/commonService';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-bundles',
  templateUrl: './bundles.component.html',
  styleUrls: ['./bundles.component.css']
})
export class BundlesComponent implements OnInit {
  @ViewChild('responseModel') responseModel: TemplateRef<any>;
  @ViewChild('confirmationModal') confirmationModal: TemplateRef<any>;
  @ViewChild('successModel') successModel: TemplateRef<any>;
  @ViewChild('deleteconfirmationModal') deleteconfirmationModal: TemplateRef<any>;

  rolesList = [];
  userList = [];
  pageInfo: any;
  errorMessage: any;
  pageArray: any = [];
  totalPage = 1;
  currentPage = 1;
  customerId: any;
  
  userSearchForm = new FormGroup({
    paidType: new FormControl(''),
    bundleType: new FormControl(''),
  });
  viewAccess = false;
  successMessage: any;
  constructor(private commonService: CommonService, private router: Router, private cookie_service: CookieService, private modalService: NgbModal) { }
  paidType = [];
  bundleType = [];
  cmsStatus = [];
  modalContent = "";
  editRoleAccess = true;
  deleteRoleAccess = true;
  createUserAccess = false;
  consumerAccountType: any = [];
  enableBundleAddOnFlow = false;
  ngOnInit() {
    // this.customerId = this.commonService.getCustomerId();
    // let access = JSON.parse(localStorage.getItem('acl'));
    // access.forEach((element) => {
    //   if (element.key == 'CMS') {
    //     this.viewAccess = element.access.view;
    // this.editRoleAccess = element.access.edit;
    // this.deleteRoleAccess = element.access.delete;
    // this.createUserAccess=element.access.create;
    //   }
    // })
    this.search(1);
    let body = { "lookups": ["consumerAccountType", "bundleType", "enableBundleAddOnFlow"] };
    document.getElementById('loader').style.display = 'block';
    this.commonService.getLookups(body).subscribe(res => {
      document.getElementById('loader').style.display = 'none';
      if (res.success == true) {
        this.paidType = res.result.consumerAccountType;
        this.bundleType = res.result.bundleType;
        this.consumerAccountType = res.result.consumerAccountType;
        this.enableBundleAddOnFlow = res.result.enableBundleAddOnFlow;
      } else {
        this.paidType = [];
        this.bundleType = [];
      }
    });
  }

  search(page) {
    let body = {
      "accountType": this.userSearchForm.controls.paidType.value,
      "bundleType": this.userSearchForm.controls.bundleType.value,
    }
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.getBundlesList(body, page).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.userList = res.result.tsttBundles;
        if (page > res.result.pageInfo.totalPage) {
          this.search(1);
        }
        this.currentPage = res.result.pageInfo.currentPage;
        this.totalPage = res.result.pageInfo.totalPage;
        this.pageArray = this.getArrayOfPage(this.totalPage, this.currentPage);
      } else {
        this.errorMessage = res.message;
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
        this.userList = [];
        this.currentPage = 1;
        this.totalPage = 1;
        this.pageArray = this.getArrayOfPage(this.totalPage, this.currentPage);
      }
    }, error => {
      document.getElementById('loader').style.display = 'none';
      this.errorMessage = "There is a problem processing your request. Please try again after some time.";
      this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
    });
  }

  addBundleScreen() {
    this.router.navigate(['/admin/add-bundles']);

  }

  spaceRestrict(event: any) {
    if (event.target.selectionStart == 0 && event.code == 'Space')
      event.preventDefault();
  }

  deleteId: any;
  deleteBundle(id) {
    this.deleteId = id;
    this.modalService.open(this.deleteconfirmationModal, { windowClass: 'error-modal' });
  }


  closeModal() {
    this.modalService.dismissAll();
    this.userSearchForm.reset();
  }
  close() {
    this.modalService.dismissAll();
  }

  private getArrayOfPage(pageCount: number, currentPage: number): number[] {
    let pageArray: number[] = [];

    if (pageCount < 4) {
      if (pageCount > 0) {
        for (var i = 1; i <= pageCount; i++) {
          pageArray.push(i);
        }
      }
    } else {
      let ratio = pageCount / currentPage;
      if (currentPage > 2 && currentPage < pageCount - 1) {
        pageArray.push(1);
        pageArray.push(0);
        pageArray.push(currentPage - 1);
        pageArray.push(currentPage);
        pageArray.push(currentPage + 1);
        pageArray.push(0);
        pageArray.push(this.totalPage);
      } else {
        if (currentPage <= 2) {
          pageArray.push(1);
          pageArray.push(2);
          pageArray.push(3);
          pageArray.push(0);
          pageArray.push(this.totalPage);
        } else if (currentPage >= pageCount - 1) {
          pageArray.push(1);
          pageArray.push(0);
          pageArray.push(pageCount - 2);
          pageArray.push(pageCount - 1);
          pageArray.push(pageCount);
        }
      }
    }

    return pageArray;
  }
  goToPage(page) {
    if (page >= 1 && page <= this.totalPage) {
      this.search(page);
    }
  }

  accessForBundle: any;
  bundleIndentifier: any;
  bundleAccess(value, access) {
    this.accessForBundle = access;
    this.bundleIndentifier = value;
    if (this.accessForBundle == true) {
      this.modalContent = "activate"
    } else {
      this.modalContent = "deactivate"
    }
    this.modalService.open(this.confirmationModal);
  }

  confirmDelete() {
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.deleteBundle(this.deleteId).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.modalService.dismissAll();
        this.successMessage = "Deleted Successfully";
        this.modalService.open(this.successModel);
        this.search(1);
      } else {
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

  editRole(value) {
    this.router.navigate(['/admin/edit-bundles'], { queryParams: { data: JSON.stringify(value) }, skipLocationChange: true });
  }

  confirmBundleAccess() {
    let body = {
      "isActive": this.accessForBundle
    }
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.activeDeactivateBundle(body, this.bundleIndentifier).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.modalService.dismissAll();
        this.successMessage = res.message;
        this.modalService.open(this.successModel);
        this.search(1);
      }
      else {
        this.errorMessage = res.message;
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
        // this.userList = [];
        // this.currentPage = 1;
        // this.totalPage = 1;
        // this.pageArray = this.getArrayOfPage(this.totalPage, this.currentPage);
      }
    }, error => {
      document.getElementById('loader').style.display = 'none';
      this.errorMessage = "There is a problem processing your request. Please try again after some time.";
      this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
    });
  }

  getLookups(value) {
    let element = this.cmsStatus.filter(element => element.key == value)[0];
    if (element) {
      return element.value;
    }

  }

  getLookup(value, fieldName) {
    let element: any;
    if (fieldName == 'bundleType') {
      element = this.bundleType.filter(element => element.key == value)[0];
    } else if (fieldName == 'accountType') {
      element = this.consumerAccountType.filter(element => element.key == value)[0];
    }

    if (element) {
      return element.value;
    }

    return "";
  }
}

