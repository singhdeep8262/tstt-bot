import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonService } from '../../../services/commonService';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExcelService } from 'src/app/tableExportService';

@Component({
  selector: 'app-users-transaction-history',
  templateUrl: './users-transaction-history.component.html',
  styleUrls: ['./users-transaction-history.component.css']
})
export class UsersTransactionHistoryComponent implements OnInit {
  @ViewChild('responseModel') responseModel: TemplateRef<any>;
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  datepickerModel?: Date;
  today: Date;
  from: any;
  to: any;
  customerId: any;
  successMessage: any;
  billPaymentTransactions:any;
  billPaymentAmount:any;
  prepaidBundleAmount:any;
  topupvoucherAmount:any;
  topupVoucherTransactions:any;
  prepaidBundleTransactions:any;
  prepaidBundleTaxAmount:any;
  topupAmount:any;
  topupTransactions:any;
  topupTaxAmount:any;
  totalAmount:any;
  totalTransactions:any;
  errorMessage: any;
  userTransactionList: [];
  summaryData:[];
  pageArray: any = [];
  totalPage = 1;
  currentPage = 1;
  searchFormat = false;
  transactionHistory: any = new FormGroup({
    dateFrom: new FormControl(this.maxDate),
    dateTo: new FormControl(this.bsValue),
    status: new FormControl(""),
    customerId:new FormControl(""),
    mobile: new FormControl(""),
    guestFilterType: new FormControl(""),
    transactionType: new FormControl(""),
    accountNumber: new FormControl("")
  });

  constructor(private commonService: CommonService,
    private router: Router,
    private excelService: ExcelService,
    private cookie_service: CookieService,
    private modalService: NgbModal) {
    this.today = new Date();
    this.maxDate.setDate((this.maxDate.getDate() - 7));
  }
  fromDate = this.bsValue;
  toDate = this.maxDate;

  // public myDatePickerOptions: IMyDpOptions = {
  //   dateFormat: "dd/mm/yyyy",
  //   // todayBtnTxt: 'Today',
  // };
  public placeholder: string = "dd/mm/yyyy";
  guestUserTypeVal = [];
  transactionTypeVal = [];
  transactionStatus = [];
  ngOnInit(): void {
    this.customerId = this.commonService.getCustomerId();
    let body = { "lookups": ["transactionType", "transactionStatus", "guestFilterType"] };
    document.getElementById('loader').style.display = 'block';
    this.commonService.getLookups(body).subscribe(res => {
      document.getElementById('loader').style.display = 'none';
      if (res.success == true) {
        this.guestUserTypeVal = res.result.guestFilterType;
        this.transactionTypeVal = res.result.transactionType;
        this.transactionStatus = res.result.transactionStatus;
      } else {
        this.guestUserTypeVal = [];
        this.transactionTypeVal = [];
        this.transactionStatus = [];
      }
    });
    this.todaydate()
    this.from = (this.changeDateFormat(this.maxDate))
    this.to = this.changeDateFormat(this.bsValue)
    this.billPaymentTransactions='0';
    this.billPaymentAmount='0';
    this.topupAmount='0';
    this.topupTransactions='0';
    this.totalAmount='0';
    this.prepaidBundleTaxAmount='0'
    this.totalTransactions='0';
    this.prepaidBundleTransactions ='0';
    this.topupTaxAmount='0'
    this.prepaidBundleAmount = '0';
    this.topupvoucherAmount = '0';
    this.topupVoucherTransactions = '0';
    this.search(1);
  }
  todaydate() {
    if (this.today != this.bsValue) {
      this.bsValue == this.today
    }
  }
  restrictAlphas(e) {
    // e.target.value = e.target.value.replace(/[\D]/g, '').replace(/(\d{2})/, "$1-").replace(/(\d{2}\-\d{2})/, "$1-");
    e.preventDefault();
    e.stopPropagation()
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

  spaceRestrict(event: any) {
    if (event.target.selectionStart == 0 && event.code == 'Space')
      event.preventDefault();
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
      "fromDate": this.changeDateFormat(this.transactionHistory.controls.dateFrom.value) == undefined ? "" : this.changeDateFormat(this.transactionHistory.controls.dateFrom.value),
      "toDate": this.changeDateFormat(this.transactionHistory.controls.dateTo.value) == undefined ? "" : this.changeDateFormat(this.transactionHistory.controls.dateTo.value),
      "status": this.transactionHistory.controls.status.value,
      "customerId":this.transactionHistory.controls.customerId.value,
      "guestFilterType": this.transactionHistory.controls.guestFilterType.value,
      "transactionType": this.transactionHistory.controls.transactionType.value,
      "accountNumber": this.transactionHistory.controls.accountNumber.value,
      "phone": this.transactionHistory.controls.mobile.value
    }
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.getUsersTransactionHistory(body, page, false).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.userTransactionList = res.result.data;
        if (page > res.result.pageInfo.totalPage) {
          this.search(1);
        }
        this.billPaymentTransactions=res.result.summary.billPaymentTransactions;
        this.billPaymentAmount=res.result.summary.billPaymentAmount;
        this.topupAmount=res.result.summary.topupAmount;
        this.topupTransactions=res.result.summary.topupTransactions;
        this.topupTaxAmount=res.result.summary.topupTaxAmount;
        this.totalAmount=res.result.summary.totalAmount;
        this.totalTransactions=res.result.summary.totalTransactions;
        this.prepaidBundleAmount=res.result.summary.prepaidBundleAmount;
        this.topupvoucherAmount=res.result.summary.topupVoucherAmount;
        this.topupVoucherTransactions=res.result.summary.topupVoucherTransactions;
        this.prepaidBundleTransactions=res.result.summary.prepaidBundleTransactions;
        this.prepaidBundleTaxAmount=res.result.summary.prepaidBundleTaxAmount;
        this.currentPage = res.result.pageInfo.curentPage;
        this.totalPage = res.result.pageInfo.totalPage;
        this.pageArray = this.getArrayOfPage(this.totalPage, this.currentPage);
      }
      else {
        this.errorMessage = res.message;
        this.userTransactionList = [];
        this.billPaymentTransactions='0';
        this.billPaymentAmount='0';
        this.topupAmount='0';
        this.topupTransactions='0';
        this.totalAmount='0';
        this.totalTransactions='0';
        this.prepaidBundleAmount='0';
        this.prepaidBundleTransactions='0';
        this.currentPage = 1;
        this.totalPage = 1;
        this.pageArray = this.getArrayOfPage(this.totalPage, this.currentPage);
      }
    })
  }
  exportTransactionHistory() {
    this.searchFormat = true;
    let body = {
      "fromDate": this.changeDateFormat(this.transactionHistory.controls.dateFrom.value) == undefined ? "" : this.changeDateFormat(this.transactionHistory.controls.dateFrom.value),
      "toDate": this.changeDateFormat(this.transactionHistory.controls.dateTo.value) == undefined ? "" : this.changeDateFormat(this.transactionHistory.controls.dateTo.value),
      "status": this.transactionHistory.controls.status.value,
      "customerId":this.transactionHistory.controls.customerId.value,
      "guestFilterType": this.transactionHistory.controls.guestFilterType.value,
      "transactionType": this.transactionHistory.controls.transactionType.value,
      "phone": this.transactionHistory.controls.mobile.value,
      "accountNumber": this.transactionHistory.controls.accountNumber.value,
    }
    document.getElementById('loader').style.display = 'block';
    this.commonService.getUsersTransactionHistory(body, '', true).subscribe(res => {
      document.getElementById('loader').style.display = 'none';
       if(res.success==false) {
        this.errorMessage = res.message;
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
     else if (res.result.data.length > 0) {
        let headings1 = [
          "Total Transactions",
          "Total Amount (TTD)",
          "Bill Payment Transactions",
          "Bill Payment Amount (TTD)",
          "Top Up Tax Amount (TTD)",
          "Top Up Transactions",
          "Top Up Amount (TTD)",
          "Bundle Tax Amount (TTD)",
          "Bundle Transactions",
          "Bundle Amount (TTD)",
          "Top Up Voucher Amount (TTD)",
          "Top Up Voucher Transactions"
        ];
        let headings = ["S. No.","Customer ID", "Transaction ID", "Transaction Date", "Account Number", "Mobile", "Card No.", "Amount(TTD)", "VAT(TTD)","Bligh Repayment(TTD)" ,"Total Amount(TTD)", "Transaction Type", "Bundle Name", "Status"];
        this.excelService.exportUsersTransactionHistoryNewAsExcelFile(res.result.reportData.dateTime,res.result.summary, headings, JSON.parse(JSON.stringify(res.result.data)), headings1, this.guestUserTypeVal, this.transactionTypeVal, this.transactionStatus, res.result.reportData.fromDate, res.result.reportData.toDate);
      }
      else {
        this.errorMessage = 'No Data Found';
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
    });

  }

  goToPage(page) {
    if (page >= 1 && page <= this.totalPage) {
      this.search(page);
    }
  }

  isScreenMobile() {
    let screenWidth = window.innerWidth;
    if (screenWidth < 770) return true;
    else return false;
  }

  close() {
    this.modalService.dismissAll();
  }

  getLookups(value, fieldName) {
    let element: any;
    if (fieldName == 'transactionType') {
      element = this.transactionTypeVal.filter(element => element.key == value)[0];
    }
    else if (fieldName == 'transactionStatus') {
      element = this.transactionStatus.filter(element => element.key == value)[0];
    }
    else if (fieldName == 'guestFilterType') {
      element = this.guestUserTypeVal.filter(element => element.key == value)[0];
    }

    if (element) {
      return element.value;
    }

  }

}
