import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CommonService } from '../../../services/commonService';
import { ExcelService } from 'src/app/tableExportService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-redeemed-coupon-transaction-history',
  templateUrl: './redeemed-coupon-transaction-history.component.html',
  styleUrls: ['./redeemed-coupon-transaction-history.component.css']
})
export class RedeemedCouponTransactionHistoryComponent implements OnInit {
  @ViewChild('responseModel') responseModel: TemplateRef<any>;
  maxDate = new Date();
  bsValue = new Date();
  today: Date;
  transactionTypeVal = [];
  transactionStatus = [];
  errorMessage: any;
  pageArray: any = [];
  couponSource=[];
  totalPage = 1;
  currentPage = 1;
  summary: {
    discountAmountApplied: string;
    totalAmountPaid: string;
    totalCouponTransactions: string;
  } = {
    discountAmountApplied: '',
    totalAmountPaid: '',
    totalCouponTransactions: '',
    };
  couponTransactionDetails: any = []
  coupontransactionHistory: any = new FormGroup({
    couponCode: new FormControl(""),
    couponSource: new FormControl(""),
    couponName: new FormControl(""),
    influencerName: new FormControl(""),
    customerId: new FormControl(""),
    lastName: new FormControl(""),
    firstName: new FormControl(""),
    dateFrom: new FormControl(this.maxDate),
    dateTo: new FormControl(this.bsValue),
    status: new FormControl(""),
    email: new FormControl(""),
    phone: new FormControl(""),
    accountNumber: new FormControl("")
  });

  constructor(private commonService: CommonService, private modalService: NgbModal, private excelService: ExcelService,) {
    this.today = new Date();
    this.maxDate.setDate((this.maxDate.getDate() - 7));
  }
  ngOnInit() {
    let body = { "lookups": ["transactionStatus","couponSource"] };
    document.getElementById('loader').style.display = 'block';
    this.commonService.getLookups(body).subscribe(res => {

      document.getElementById('loader').style.display = 'none';
      if (res.success == true) {
        this.transactionStatus = res.result.transactionStatus;
        this.couponSource = res.result.couponSource;
      } else {
        this.transactionStatus = [];
      }
    });
    this.search(1);
    this.todaydate()
  }
  resetData(){
    this.coupontransactionHistory.reset();
    this.coupontransactionHistory.get('dateFrom')?.setValue(this.maxDate);
    this.coupontransactionHistory.get('dateTo')?.setValue(this.bsValue);
    this.coupontransactionHistory.get('couponSource')?.setValue('');
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

  closeModal() {
    this.modalService.dismissAll();
  }
  search(page) {
    let body = {
      "couponCode": this.coupontransactionHistory.controls.couponCode.value,
      "couponSource": this.coupontransactionHistory.controls.couponSource.value,
      "couponName": this.coupontransactionHistory.controls.couponName.value,
      "influencerName": this.coupontransactionHistory.controls.influencerName.value,
      "fromDate": this.changeDateFormat(this.coupontransactionHistory.controls.dateFrom.value) == undefined ? "" : this.changeDateFormat(this.coupontransactionHistory.controls.dateFrom.value),
      "toDate": this.changeDateFormat(this.coupontransactionHistory.controls.dateTo.value) == undefined ? "" : this.changeDateFormat(this.coupontransactionHistory.controls.dateTo.value),
      "status": this.coupontransactionHistory.controls.status.value,
      "phone": this.coupontransactionHistory.controls.phone.value,
      "email": this.coupontransactionHistory.controls.email.value,
      "firstName": this.coupontransactionHistory.controls.firstName.value,
      "lastName": this.coupontransactionHistory.controls.lastName.value,
      "customerId": this.coupontransactionHistory.controls.customerId.value,
      "accountNumber": this.coupontransactionHistory.controls.accountNumber.value,
    }

    document.getElementById('loader')!.style.display = 'block';
    this.commonService.getRedeemedTransactionHistory(body, page, false).subscribe(res => {
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
    if (fieldName == 'transactionStatus') {
      element = this.transactionStatus.filter(element => element.key == value)[0];
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
  exportRedeemedCouponTransactionHistory() {
    let body = {
      "couponCode": this.coupontransactionHistory.controls.couponCode.value,
      "couponSource": this.coupontransactionHistory.controls.couponSource.value,
      "couponName": this.coupontransactionHistory.controls.couponName.value,
      "influencerName": this.coupontransactionHistory.controls.influencerName.value,
      "fromDate": this.changeDateFormat(this.coupontransactionHistory.controls.dateFrom.value) == undefined ? "" : this.changeDateFormat(this.coupontransactionHistory.controls.dateFrom.value),
      "toDate": this.changeDateFormat(this.coupontransactionHistory.controls.dateTo.value) == undefined ? "" : this.changeDateFormat(this.coupontransactionHistory.controls.dateTo.value),
      "status": this.coupontransactionHistory.controls.status.value,
      "phone": this.coupontransactionHistory.controls.phone.value,
      "email": this.coupontransactionHistory.controls.email.value,
      "firstName": this.coupontransactionHistory.controls.firstName.value,
      "lastName": this.coupontransactionHistory.controls.lastName.value,
      "customerId": this.coupontransactionHistory.controls.customerId.value,
      "accountNumber": this.coupontransactionHistory.controls.accountNumber.value,
    }

    document.getElementById('loader').style.display = 'block';
    this.commonService.getRedeemedTransactionHistory(body, '', true).subscribe(res => {
      document.getElementById('loader').style.display = 'none';
      if (res.success == false) {
        this.errorMessage = res.message;
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
      else if (res.result.data.length > 0) {
        let headings1 = [
          "Total Coupon Transactions",
          "Total Amount Paid (TTD)",
          "Discount Amount Applied  (TTD)"
        ];

        let headings = [
          "S. No.",
          "Customer ID",
          "Transaction ID",
          "Name",
          "Phone",
          "Email",
          "Account Number",
          "Coupon Code",
          "Influencer Name",
          "Coupon Source",
          "Coupon Name",
          "Bundle Name",
          "Card Number",
          "Discount (TTD)",
          "Discounted Amount (TTD)",
          "Discounted Tax (TTD)",
          "Discounted Total Amount (TTD)",
          "Loan Amount (TTD)",
          "Original Amount (TTD)",
          "Original Tax (TTD)",
          "Original Total Amount (TTD)",
          "Transaction Date and Time",
          "Transaction Status"
          // "Transaction Type"
        ];       
        this.excelService.exportUsersRedeemedCouponTransactionHistoryNewAsExcelFile(res.result.reportData.dateTime, res.result.summary, headings, JSON.parse(JSON.stringify(res.result.data)), headings1, this.transactionStatus, res.result.reportData.fromDate, res.result.reportData.toDate,this.couponSource)
      }
      else {
        this.errorMessage = 'No Data Found';
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
    });

  }

}
