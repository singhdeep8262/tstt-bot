import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExcelService } from 'src/app/tableExportService';
import { CommonService } from 'src/services/commonService';

@Component({
  selector: 'app-push-notification',
  templateUrl: './push-notification.component.html',
  styleUrls: ['./push-notification.component.css']
})
export class PushNotificationComponent implements OnInit {
  @ViewChild('sendNotificationModal') sendNotificationModal: TemplateRef<any>;
  @ViewChild('responseModel') responseModel: TemplateRef<any>;
  @ViewChild('successModal') successModal: TemplateRef<any>;

  bsValue = new Date();
  today: Date;
  errorMessage: any;
  successMessage: any = "";
  pageArray: any = [];
  totalPage = 1;
  currentPage = 1;
  isConfirmNotification = false;
  showPushNotificationTypeFilter = false;
  submitted: boolean;
  pushNotificationDetails: any = [];
  pushNotificationForm: any = new FormGroup({
    dateFrom: new FormControl(),
    dateTo: new FormControl(),
    topics: new FormControl(),
  });
  sendNotificationForm = new FormGroup({
    subject: new FormControl('', Validators.required),
    body: new FormControl('', Validators.required),
    topics: new FormControl('')
  });
  getNotificationForm = new FormGroup({
    dateFrom: new FormControl(''),
    dateTo: new FormControl(''),
  });
  notificationTopics: any;

  constructor(private commonService: CommonService, private modalService: NgbModal, private excelService: ExcelService,) {
    this.today = new Date();
  }
  ngOnInit() {
    this.search(1);
    let body = { "lookups": ["notificationTopics", "showPushNotificationTypeFilter"] };
    document.getElementById('loader').style.display = 'block';
    this.commonService.getLookups(body).subscribe(res => {
      document.getElementById('loader').style.display = 'none';
      if (res.success == true) {
        this.notificationTopics = res.result.notificationTopics;
        this.showPushNotificationTypeFilter = res.result.showPushNotificationTypeFilter;
      } else {
        this.showPushNotificationTypeFilter = false;
      }
    });
  }


  closeModal() {
    this.modalService.dismissAll();
  }

  close() {
    this.modalService.dismissAll();
  }

  resetData() {
    this.pushNotificationForm.reset();
    this.pushNotificationForm.get('status')?.setValue('');
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
      "dateFrom": this.changeDateFormat(this.pushNotificationForm.controls.dateFrom.value) == undefined ? "" : this.changeDateFormat(this.pushNotificationForm.controls.dateFrom.value),
      "dateTo": this.changeDateFormat(this.pushNotificationForm.controls.dateTo.value) == undefined ? "" : this.changeDateFormat(this.pushNotificationForm.controls.dateTo.value),
      "notificationCode": this.pushNotificationForm.controls.topics.value
    }

    document.getElementById('loader')!.style.display = 'block';
    this.commonService.pushNotification(body, page, false).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.pushNotificationDetails = res.result.data;
        this.currentPage = res.result.pageInfo.curentPage;
        this.totalPage = res.result.pageInfo.totalPages;
        this.pageArray = this.getArrayOfPage(this.totalPage, this.currentPage);
      }
      else {
        this.errorMessage = res.message;
        this.modalService.dismissAll();
        this.pushNotificationDetails = [];
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
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
    e.preventDefault();
    e.stopPropagation()
  }
  isScreenMobile() {
    let screenWidth = window.innerWidth;
    if (screenWidth < 770) return true;
    else return false;
  }
  goToPage(page) {

    if (page >= 1 && page <= this.totalPage) {
      this.search(page);
    }
  }


  confirmSendNotification() {
    this.modalService.dismissAll();
    this.submitted = true;
    if (!this.sendNotificationForm.valid) {
      return;
    }
    else {
      this.isConfirmNotification = true;
      this.modalService.dismissAll();
      this.modalService.open(this.sendNotificationModal, { windowClass: 'notificationModal', backdrop: 'static' });
    }
  }


  pushNotificationModal() {
    this.sendNotificationForm.reset();
    this.submitted = false;
    this.isConfirmNotification = false;
    this.modalService.dismissAll();
    this.modalService.open(this.sendNotificationModal, { windowClass: 'voucherReqModal', backdrop: 'static' });
  }

  sendNotification() {
    let body = {
      "title": this.sendNotificationForm.controls.subject.value,
      "body": this.sendNotificationForm.controls.body.value,
      "notificationCode": this.sendNotificationForm.controls.topics.value,
    }
    document.getElementById('loader').style.display = 'block';
    this.commonService.sendNotification(body).subscribe(res => {
      document.getElementById('loader').style.display = 'none';
      if (res.success) {
        this.successMessage = res.message;
        this.modalService.dismissAll();
        this.modalService.open(this.successModal);
        this.search(1);
      }
      else {
        this.errorMessage = res.message;
        this.modalService.dismissAll();
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }

    });
  }

  getNotificationTopicValue(): string {
    const selectedKey = this.sendNotificationForm.controls.topics.value;
    const match = this.notificationTopics.find(topic => topic.key === selectedKey);
    return match ? match.value : selectedKey;
  }


}


