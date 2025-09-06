import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CommonService } from '../../../services/commonService';
import { ExcelService } from 'src/app/tableExportService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-infuencer-coupon-transaction-report',
  templateUrl: './infuencer-coupon-transaction-report.component.html',
  styleUrls: ['./infuencer-coupon-transaction-report.component.css']
})
export class InfuencerCouponTransactionReportComponent implements OnInit {
  @ViewChild('responseModel') responseModel: TemplateRef<any>;
  maxDate = new Date();
  bsValue = new Date();
  today: Date;
  errorMessage: any;
  pageArray: any = [];
  totalPage = 1;
  currentPage = 1;
  couponTransactionDetails: any = []
  influencerCouponReport: any = new FormGroup({
    couponCode: new FormControl(""),
    couponName: new FormControl(""),
    influencerName: new FormControl("")
  });
  influencerCouponDetails: any = [];
  constructor(private commonService: CommonService, private modalService: NgbModal, private excelService: ExcelService,) {
    this.today = new Date();
    // this.maxDate.setDate((this.maxDate.getDate() - 7));
  }
  ngOnInit() {
    // let body = { "lookups": [] };
    // document.getElementById('loader').style.display = 'block';
    // this.commonService.getLookups(body).subscribe(res => {

    //   document.getElementById('loader').style.display = 'none';
    //   if (res.success == true) {

    //   } else {

    //   }
    // });
    this.search(1);
    this.todaydate()
  }


  closeModal() {
    this.modalService.dismissAll();
  }
  resetData() {
    this.influencerCouponReport.reset();
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
      "couponCode": this.influencerCouponReport.controls.couponCode.value,
      "couponName": this.influencerCouponReport.controls.couponName.value,
      "influencerName": this.influencerCouponReport.controls.influencerName.value,
    }

    document.getElementById('loader')!.style.display = 'block';
    this.commonService.getinfluencerCouponReport(body, page, false).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.influencerCouponDetails = res.result.data;
        this.currentPage = res.result.pageInfo.curentPage || 1;
        this.totalPage = res.result.pageInfo.totalPage || 1;
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
  // getLookups(value, fieldName) {
  //   let element: any;
  //   else if (fieldName == 'couponStatus') {
  //     element = this.couponStatus.filter(element => element.key == value)[0];
  //   }

  //   if (element) {
  //     return element.value;
  //   }

  // }
  goToPage(page) {
    if (page >= 1 && page <= this.totalPage) {
      this.search(page);
    }
  }
  exportInfluencerCouponReport() {
    let body = {
      "couponCode": this.influencerCouponReport.controls.couponCode.value,
      "couponName": this.influencerCouponReport.controls.couponName.value,
      "influencerName": this.influencerCouponReport.controls.influencerName.value,
    }

    document.getElementById('loader').style.display = 'block';
    this.commonService.getinfluencerCouponReport(body, '', true).subscribe(res => {
      document.getElementById('loader').style.display = 'none';
      if (res.success == false) {
        this.errorMessage = res.message;
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
      else if (res.result.data.length > 0) {
        let headings = [
          'S. No.',
          'Start Date and Time',
          'End Date and Time',
          'Coupon Code',
          'Coupon Count',
          'Coupon Name',
          'Influencer Name',
          'Redeem Count',
          'Discount Percent',
          'Is Active',
          'Is Deleted'
        ];
        this.excelService.exportInfluencerCouponReportNewAsExcelFile(headings, JSON.parse(JSON.stringify(res.result.data)))
      }
      else {
        this.errorMessage = 'No Data Found';
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
    });

  }

}
