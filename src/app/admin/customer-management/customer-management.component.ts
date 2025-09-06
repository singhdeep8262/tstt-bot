import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonService } from '../../../services/commonService';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExcelService } from 'src/app/tableExportService';

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.css']
})
export class CustomerManagementComponent implements OnInit {
  @ViewChild('responseModel') responseModel: TemplateRef<any>;
  rolesList = [];
  userList = [];
  pageInfo: any;
  bsValue = new Date();
  today: Date;
  maxDate = new Date();
  from: any;
  to: any;
  errorMessage: any;
  pageArray: any = [];
  totalPage = 1;
  currentPage = 1;
  customerId: any;
  userSearchForm = new FormGroup({
    dateFrom: new FormControl(this.maxDate),
    dateTo: new FormControl(this.bsValue),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    creationDate: new FormControl(''),
    status: new FormControl(''),
    customerId: new FormControl(''),
  });
  viewAccess = false;
  signupMethod=[];
  constructor(private commonService: CommonService, private router: Router, private cookie_service: CookieService,
     private modalService: NgbModal,
     private excelService: ExcelService) {
      this.today = new Date();
    this.maxDate.setDate((this.maxDate.getDate() - 7));
      }
  fromDate = this.bsValue;
  toDate = this.maxDate;

  cmsStatus = [];
  ngOnInit() {
    this.customerId = this.commonService.getCustomerId();
    let access = JSON.parse(localStorage.getItem('acl'));
    access.forEach((element) => {
      if (element.key == 'CMS') {
        this.viewAccess = element.access.view;
      }
    })
    this.todaydate()
    this.from = (this.changeDateFormat(this.maxDate))
    this.to = this.changeDateFormat(this.bsValue)
    this.search(1);
    let body = { "lookups": ["consumerUserStatus","consumerSignupMethod"] };
    document.getElementById('loader').style.display = 'block';
    this.commonService.getLookups(body).subscribe(res => {
      document.getElementById('loader').style.display = 'none';
      if (res.success == true) {
        this.cmsStatus = res.result.consumerUserStatus;
        this.signupMethod=res.result.consumerSignupMethod;
      } else {
        this.cmsStatus = [];
        this.signupMethod=[];
      }
    });
  }
  todaydate() {
    if (this.today != this.bsValue) {
      this.bsValue == this.today
    }
  }
  changeDateFormat(date) {
    if (date == "") {
      return "";
    }
    if (date == undefined) {
      return "";
    }

    let month = (date.getMonth() + 1);
    if (month < 10) {
      month = "0" + month.toString();
    } else {
      month = month.toString();
    }
    let day = date.getDate();
    if (date.getDate() < 10) {
      day = "0" + date.getDate().toString();
    } else {
      day = date.getDate().toString();
    }

    date = date.getFullYear() + '-' + month + '-' + day;
    return date;
  }
  letterOnly(event) 
  {
              var charCode = event.keyCode;
  
              if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8)
  
                  return true;
              else
                  return false;
  }
  // getRoles() {
  //   document.getElementById('loader')!.style.display = 'block';
  //   this.commonService.getDropdownRoles().subscribe(res => {
  //     document.getElementById('loader')!.style.display = 'none';
  //     if (res.success == true) {
  //       this.rolesList = res.result.roles;
  //       if (res.result.roles) {
  //         this.search(1);
  //       }
  //     }
  //   });
  // }
  search(page) {
    let body = {
      "fromDate": this.changeDateFormat(this.userSearchForm.controls.dateFrom.value) == undefined ? "" : this.changeDateFormat(this.userSearchForm.controls.dateFrom.value),
      "toDate": this.changeDateFormat(this.userSearchForm.controls.dateTo.value) == undefined ? "" : this.changeDateFormat(this.userSearchForm.controls.dateTo.value),
      // "creationDate":this.convert(this.userSearchForm.controls.creationDate.value),
      "phone": this.userSearchForm.controls.phone.value,
      "email": this.userSearchForm.controls.email.value,
      "firstName": this.userSearchForm.controls.firstName.value,
      "lastName": this.userSearchForm.controls.lastName.value,
      "status": this.userSearchForm.controls.status.value,
      "customerId":this.userSearchForm.controls.customerId.value,
    }
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.getCustomerList(body, page,false).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.userList = res.result.data;
        if(page > res.result.pageInfo.totalPage) {
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

  spaceRestrict(event: any) {
    if (event.target.selectionStart == 0 && event.code == 'Space')
      event.preventDefault();
  }
  
  closeModal() {
    this.modalService.dismissAll();
    this.userSearchForm.reset();
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
  viewData(value) { 
    if(this.viewAccess == true)  {
      this.router.navigate(['/admin/demographics'], { queryParams: { data: JSON.stringify(value) }, skipLocationChange: true });
    }

  }
  isScreenMobile() {
    let screenWidth = window.innerWidth;
    if (screenWidth < 770) return true;
    else return false;
  }
  restrictAlphas(e) {
    // e.target.value = e.target.value.replace(/[\D]/g, '').replace(/(\d{2})/, "$1-").replace(/(\d{2}\-\d{2})/, "$1-");
    e.preventDefault();
    e.stopPropagation()
  }
  getLookups(value,id) {

    if(id=='STATUS'){
    let element = this.cmsStatus.filter(element => element.key == value)[0];
    if (element) {
      return element.value;
    }
  }else if(id=='SIGNUP METHOD'){
    let element = this.signupMethod.filter(element => element.key == value)[0];
    if (element) {
      return element.value;
    }
  }
  }
  exportCmshistory() {
    let body = {
      "fromDate": this.changeDateFormat(this.userSearchForm.controls.dateFrom.value) == undefined ? "" : this.changeDateFormat(this.userSearchForm.controls.dateFrom.value),
      "toDate": this.changeDateFormat(this.userSearchForm.controls.dateTo.value) == undefined ? "" : this.changeDateFormat(this.userSearchForm.controls.dateTo.value),
      "phone": this.userSearchForm.controls.phone.value,
      "email": this.userSearchForm.controls.email.value,
      "firstName": this.userSearchForm.controls.firstName.value,
      "lastName": this.userSearchForm.controls.lastName.value,
      "status": this.userSearchForm.controls.status.value,
      "customerId":this.userSearchForm.controls.customerId.value,
    }
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.getCustomerList(body,"",true).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        let header=['S. No.','First Name','Last Name','Signup Method','Mobile','Customer ID','Email','Creation Date','Status'];
        this.excelService.exportCMSAsExcelFile(JSON.parse(JSON.stringify(res.result.data)),header,"Customer Management",res.result.reportData.dateTime,res.result.reportData.fromDate,res.result.reportData.toDate);
      }else{
        this.errorMessage = res.message;
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
    });
  }
}
