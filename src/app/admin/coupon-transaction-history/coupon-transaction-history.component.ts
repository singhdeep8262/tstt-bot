import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CommonService } from '../../../services/commonService';
import { ExcelService } from 'src/app/tableExportService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-coupon-transaction-history',
  templateUrl: './coupon-transaction-history.component.html',
  styleUrls: ['./coupon-transaction-history.component.css']
})
export class CouponTransactionHistoryComponent implements OnInit {
  @ViewChild('responseModel') responseModel: TemplateRef<any>;
  maxDate = new Date();
  bsValue = new Date();
  today: Date;
  transactionTypeVal = [];
  transactionStatus = [];
  errorMessage: any;
  pageArray: any = [];
  totalPage = 1;
  currentPage = 1;
  summary: {
    issuedCoupons: string;
    couponsRedeemed: string;
    couponsRemaining: string;
    unredeeemedCoupons: string;
  } = {
      issuedCoupons: '',
      couponsRedeemed: '',
      couponsRemaining: '',
      unredeeemedCoupons: ''
    };
  couponTransactionDetails: any = []
  coupontransactionHistory: any = new FormGroup({
    couponCode: new FormControl(""),
    couponSource: new FormControl(""),
    couponName: new FormControl(""),

    // customerId:new FormControl(""),
    dateFrom: new FormControl(),
    dateTo: new FormControl(),
    status: new FormControl(""),
    email: new FormControl(""),
    issuedPhone: new FormControl(""),
    redeemedPhone: new FormControl(""),
    // mobile: new FormControl(""),
    // transactionType: new FormControl(""),
    // accountNumber: new FormControl("")
  });
  couponSource = [];
  couponStatus = [];
  constructor(private commonService: CommonService, private modalService: NgbModal, private excelService: ExcelService,) {
    this.today = new Date();
    // this.maxDate.setDate((this.maxDate.getDate() - 7));
  }
  ngOnInit() {
    let body = { "lookups": ["transactionType", "transactionStatus", "couponStatus", "couponSource"] };
    document.getElementById('loader').style.display = 'block';
    this.commonService.getLookups(body).subscribe(res => {

      document.getElementById('loader').style.display = 'none';
      if (res.success == true) {
        this.transactionTypeVal = res.result.transactionType;
        this.transactionStatus = res.result.transactionStatus;
        this.couponStatus = res.result.couponStatus;
        this.couponSource = res.result.couponSource;
      } else {
        this.transactionTypeVal = [];
        this.transactionStatus = [];
        this.couponStatus = [];
      }
    });
    this.search(1);
    this.todaydate()
  }


  closeModal() {
    this.modalService.dismissAll();
  }
  resetData() {
    this.coupontransactionHistory.reset();
    this.coupontransactionHistory.get('status')?.setValue('');

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
  search(page) {
    let body = {
      "couponCode": this.coupontransactionHistory.controls.couponCode.value,
      "couponSource": this.coupontransactionHistory.controls.couponSource.value,
      "couponName": this.coupontransactionHistory.controls.couponName.value,
      "fromDate": this.changeDateFormat(this.coupontransactionHistory.controls.dateFrom.value) == undefined ? "" : this.changeDateFormat(this.coupontransactionHistory.controls.dateFrom.value),
      "toDate": this.changeDateFormat(this.coupontransactionHistory.controls.dateTo.value) == undefined ? "" : this.changeDateFormat(this.coupontransactionHistory.controls.dateTo.value),
      "status": this.coupontransactionHistory.controls.status.value,
      // "issuedPhone": this.coupontransactionHistory.controls.issuedPhone.value,
      // "redeemedPhone": this.coupontransactionHistory.controls.redeemedPhone.value,
      // "email": this.coupontransactionHistory.controls.email.value,
      // "phone": this.coupontransactionHistory.controls.mobile.value
    }

    document.getElementById('loader')!.style.display = 'block';
    this.commonService.couponTransactionHistory(body, page, false).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.summary = res.result.summary;
        this.couponTransactionDetails = res.result.data;
        this.currentPage = res.result.pageInfo.curentPage;
        this.totalPage = res.result.pageInfo.totalPage;
        this.pageArray = this.getArrayOfPage(this.totalPage, this.currentPage);
      }
      else {
        this.errorMessage = res.message;
        this.currentPage = 1;
        this.totalPage = 1;
        this.pageArray = this.getArrayOfPage(this.totalPage, this.currentPage);
      }
    })
  }
  spaceRestrict(event: any) {
    if (event.target.selectionStart == 0 && event.code == 'Space')
      event.preventDefault();
  }

  restrictAlphas(e) {
    // e.target.value = e.target.value.replace(/[\D]/g, '').replace(/(\d{2})/, "$1-").replace(/(\d{2}\-\d{2})/, "$1-");
    e.preventDefault();
    e.stopPropagation()
  }
  isScreenMobile() {
    let screenWidth = window.innerWidth;
    if (screenWidth < 770) return true;
    else return false;
  }
  getLookups(value, fieldName) {
    let element: any;
    if (fieldName == 'transactionType') {
      element = this.transactionTypeVal.filter(element => element.key == value)[0];
    }
    else if (fieldName == 'transactionStatus') {
      element = this.transactionStatus.filter(element => element.key == value)[0];
    }
    else if (fieldName == 'couponStatus') {
      element = this.couponStatus.filter(element => element.key == value)[0];
    }
    else if (fieldName == 'couponSource') {
      element = this.couponSource.filter(element => element.key == value)[0];
    }

    if (element) {
      return element.value;
    }

  }
  goToPage(page) {
    if (page >= 1 && page <= this.totalPage) {
      this.search(page);
    }
  }
  exportCouponTransactionHistory() {
    let body = {
      "couponCode": this.coupontransactionHistory.controls.couponCode.value,
      "couponSource": this.coupontransactionHistory.controls.couponSource.value,
      "couponName": this.coupontransactionHistory.controls.couponName.value,
      "fromDate": this.changeDateFormat(this.coupontransactionHistory.controls.dateFrom.value) == undefined ? "" : this.changeDateFormat(this.coupontransactionHistory.controls.dateFrom.value),
      "toDate": this.changeDateFormat(this.coupontransactionHistory.controls.dateTo.value) == undefined ? "" : this.changeDateFormat(this.coupontransactionHistory.controls.dateTo.value),
      "status": this.coupontransactionHistory.controls.status.value,
      // "issuedPhone": this.coupontransactionHistory.controls.issuedPhone.value,
      // "redeemedPhone": this.coupontransactionHistory.controls.redeemedPhone.value,
      // "email": this.coupontransactionHistory.controls.email.value,
      // "phone": this.coupontransactionHistory.controls.mobile.value
    }

    document.getElementById('loader').style.display = 'block';
    this.commonService.couponTransactionHistory(body, '', true).subscribe(res => {
      document.getElementById('loader').style.display = 'none';
      if (res.success == false) {
        this.errorMessage = res.message;
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
      else if (res.result.data.length > 0) {
        let headings1 = [
          "Total Coupons Issued ",
          "Total Coupons Redeemed",
          "Total Coupons Unredeemed",
          "Total Coupons Remaining"
        ];

        let headings = [
          "S. No.",
          "Issued Transaction Id",
          // "Name",
          "Email",
          // "Consumer Phone",
          "Coupon Code",
          "Coupon Source",
          "Coupon Name",
          "Issued Start Date",
          "Issued End Date",
          "Redeem Start Date",
          "Redeeem End Date",
          "Is Expired",
          "Is Used",
          "Issued Phone",
          "Issued At",
          "Redeemed Phone",
          "Used At",
          // "Vendor",
          "Status"
        ];
        this.excelService.exportUsersCouponTransactionHistoryNewAsExcelFile(res.result.summary, headings, JSON.parse(JSON.stringify(res.result.data)), headings1, this.couponStatus,this.couponSource)
      }
      else {
        this.errorMessage = 'No Data Found';
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
    });

  }

}
