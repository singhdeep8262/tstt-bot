import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonService } from '../../../services/commonService';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExcelService } from 'src/app/tableExportService';


@Component({
  selector: 'app-refund-payment',
  templateUrl: './refund-payment.component.html',
  styleUrls: ['./refund-payment.component.css']
})
export class RefundPaymentComponent implements OnInit {
  @ViewChild('responseModel') responseModel: TemplateRef<any>;
  @ViewChild('confirmationModal') confirmationModal: TemplateRef<any>;
  @ViewChild('successModel') successModel: TemplateRef<any>;
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  datepickerModel?: Date;
  today: Date;
  from: any;
  to: any;
  customerId: any;
  successMessage: any;
  errorMessage: any;
  userTransactionList: [];
  pageArray: any = [];
  totalPage = 1;
  currentPage = 1;
  searchFormat = false;
  transactionHistory: any = new FormGroup({
    dateFrom: new FormControl(this.maxDate),
    dateTo: new FormControl(this.bsValue),
    mobile: new FormControl(""),
    status: new FormControl(""),
    transactionType: new FormControl(""),
    customerId: new FormControl(""),
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
  editUserAccess: any;
  // public myDatePickerOptions: IMyDpOptions = {
  //   dateFormat: "dd/mm/yyyy",
  //   // todayBtnTxt: 'Today',
  // };
  public placeholder: string = "dd/mm/yyyy";
  transactionTypeVal = [];
  transactionStatus = [];
  ngOnInit(): void {
    let access = JSON.parse(localStorage.getItem('acl'));
    access.forEach((element) => {
      if (element.key == 'REFUND_PAYMENT_REPORT') {
        this.editUserAccess = element.access.edit;
      }
    })
    this.customerId = this.commonService.getCustomerId();
    let body = { "lookups": ["transactionType", "consumerPaymentStatus"] };
    document.getElementById('loader').style.display = 'block';
    this.commonService.getLookups(body).subscribe(res => {
      document.getElementById('loader').style.display = 'none';
      if (res.success == true) {
        this.transactionTypeVal = res.result.transactionType;
        this.transactionStatus = res.result.consumerPaymentStatus;
      } else {
        this.transactionTypeVal = [];
        this.transactionStatus = [];
      }
    });
    this.todaydate()
    this.from = (this.changeDateFormat(this.maxDate))
    this.to = this.changeDateFormat(this.bsValue)
    this.search(1);
  }
  todaydate() {
    if (this.today != this.bsValue) {
      this.bsValue == this.today
    }
  }

  spaceRestrict(event: any) {
    if (event.target.selectionStart == 0 && event.code == 'Space')
      event.preventDefault();
  }

  refundId: any;
  refundData: any;
  openrefundConfirmationModal(id, data) {
    this.refundId = id;
    this.refundData = data;
    this.modalService.open(this.confirmationModal);
  }

  close() {
    this.modalService.dismissAll();
  }

  confirmRefund() {
    let body = {
      "id": this.refundId
    }
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.refundPaymentById(body).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.modalService.dismissAll();
        this.successMessage = res.message;
        this.modalService.open(this.successModel);
        this.search(1);
      }
      else {
        this.modalService.dismissAll();
        this.errorMessage = res.message;
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
    })

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
      "paymentStatus": this.transactionHistory.controls.status.value,
      "transactionType": this.transactionHistory.controls.transactionType.value,
      "mobileNumber": this.transactionHistory.controls.mobile.value,
      "customerId": this.transactionHistory.controls.customerId.value,
      "accountNumber": this.transactionHistory.controls.accountNumber.value,
    }
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.getrefundTransactionHistory(body, page, false).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.userTransactionList = res.result.data;
        if (page > res.result.pageInfo.totalPage) {
          this.search(1);
        }
        this.currentPage = res.result.pageInfo.curentPage;
        this.totalPage = res.result.pageInfo.totalPage;
        this.pageArray = this.getArrayOfPage(this.totalPage, this.currentPage);
      }
      else {
        this.errorMessage = res.message;
        this.userTransactionList = [];
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
      "paymentStatus": this.transactionHistory.controls.status.value,
      "transactionType": this.transactionHistory.controls.transactionType.value,
      "mobileNumber": this.transactionHistory.controls.mobile.value,
      "customerId": this.transactionHistory.controls.customerId.value,
      "accountNumber": this.transactionHistory.controls.accountNumber.value,
    }
    document.getElementById('loader').style.display = 'block';
    this.commonService.getrefundTransactionHistory(body, '', true).subscribe(res => {
      document.getElementById('loader').style.display = 'none';
      if (res.success == true) {
        if (res.result.data.length > 0) {
          let headings = ["S. No.", "Transaction ID", "Transaction Date", "Order ID", "Customer ID", "Account No.", "Mobile", "Card No.", "Amount (TTD)", "VAT (TTD)", "Total Amount (TTD)", "Transaction Type", "Status"];
          this.excelService.exportrefundTransactionHistoryNewAsExcelFile(res.result.reportData.dateTime, headings, JSON.parse(JSON.stringify(res.result.data)), this.transactionTypeVal, res.result.reportData.fromDate, res.result.reportData.toDate);
        }
        else {
          this.errorMessage = 'No Data Found';
          this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
        }
      }
      else {
        this.errorMessage = res.message;
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

  getLookups(value, fieldName) {
    let element: any;
    if (fieldName == 'transactionType') {
      element = this.transactionTypeVal.filter(element => element.key == value)[0];
    }
    else if (fieldName == 'transactionStatus') {
      element = this.transactionStatus.filter(element => element.key == value)[0];
    }

    if (element) {
      return element.value;
    }

  }

}

