import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonService } from '../../../services/commonService';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-platform-reports',
  templateUrl: './platform-reports.component.html',
  styleUrls: ['./platform-reports.component.css']
})
export class PlatformReportsComponent implements OnInit {
  @ViewChild('responseModel') responseModel: TemplateRef<any>;
  @ViewChild('successModel') successModel: TemplateRef<any>;
  @ViewChild('deleteconfirmationModal') deleteconfirmationModal: TemplateRef<any>;

  totalPages = 1;
  currentPage = 1;
  pageArray: any = [];
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  datepickerModel?: Date;
  today: Date;
  from: any;
  to: any;
  metaData: any = [];
  errorMessage = "";
  successMessage = "";
  hitAgain:boolean=true;
  reportName = "";
  lookupValues: any = [];
  editUserAccess = false;
  createUserAccess = false;
  deleteUserAccess = false;
  submitted = false;
  resDateArray = new Map();

  provideReportDetails: FormGroup = new FormGroup({
    "reportType": new FormControl('', Validators.required),
  });

  reportGeneration: FormGroup = new FormGroup({
    "reportGenerationDateFrom": new FormControl(''),
    "reportGenerationDateTo": new FormControl(''),

  })

  reportType = new FormControl('', Validators.required)

  resultLookUp: any = [];
  filterData: any = [];

  constructor(private commonService: CommonService, private router: Router, private route: ActivatedRoute, private modalService: NgbModal) {
    this.today = new Date();
    this.maxDate.setDate((this.maxDate.getDate() - 7))
  }

  fromDate = this.bsValue;
  toDate = this.maxDate;
  public placeholder: string = "dd/mm/yyyy";

  ngOnInit() {

    let access = JSON.parse(localStorage.getItem('acl'));
    access.forEach((element) => {
      if (element.key == 'PLATFORM_REPORTS') {
        this.editUserAccess = element.access.edit;
        this.createUserAccess = element.access.create;
        this.deleteUserAccess = element.access.delete;
      }
    })
    document.getElementById('loader')!.style.display = 'block';
    let userBody = { "lookups": ["reportMetaData"] };
    this.commonService.getUserLookups(userBody).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.metaData = res.result.reportMetaData;
      } else {
        this.reportName = "";
        this.filterData = [];
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
    }, error => {
      document.getElementById('loader').style.display = 'none';
      this.errorMessage = "There is a problem processing your request. Please try again after some time.";
      this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
    });
    this.getReportData(this.currentPage);
  }

  resetData() {
    this.reportType.setValue("");
    this.reportGeneration.reset();
    this.getReportData(1);
  }

  todaydate() {
    if (this.today != this.bsValue) {
      this.bsValue == this.today
    }
  }

  reportData = [];

  createReport() {
    this.router.navigate(['/admin/add-platform-report']);

  }

  changeReport(data) {
    if (data == '') {
      this.filterData = [];
      return
    }
    let body = { "lookups": [] };
    let form = {};
    this.metaData.forEach((ele) => {
      if (ele.reportType == data) {
        this.filterData = ele.filters
        ele.filters.forEach((element) => {
          form[element.key] = new FormControl('');
          if (element.type == 'SELECT_LOOKUP') {
            body.lookups.push(element.lookupKey);
          }
        })
      }
    }
    );
    document.getElementById('loader').style.display = 'block';
    this.commonService.getLookups(body).subscribe(res => {
      document.getElementById('loader').style.display = 'none';
      if (res.success == true) {
        this.lookupValues = res.result;
        for (const [key, value] of Object.entries(res.result)) {
          this.resDateArray.set(key, value);
        }
      } else {
        this.lookupValues = [];
      }
    });
    this.provideReportDetails = new FormGroup(form);
    this.todaydate()
    this.from = (this.changeDateFormat(this.maxDate))
    this.to = this.changeDateFormat(this.bsValue)
  }

  getReportData(page) {

    if (this.reportGeneration.get("reportGenerationDateFrom")) {
      this.reportGeneration.controls['reportGenerationDateFrom'].updateValueAndValidity();
    }
    if (this.reportGeneration.get("reportGenerationDateTo")) {
      this.reportGeneration.controls['reportGenerationDateTo'].updateValueAndValidity();
    }

    let body = {
      "fromDate": this.changeDateFormat(this.reportGeneration.controls['reportGenerationDateFrom'].value) == undefined ? "" : this.changeDateFormat(this.reportGeneration.controls['reportGenerationDateFrom'].value),
      "toDate": this.changeDateFormat(this.reportGeneration.controls['reportGenerationDateTo'].value) == undefined ? "" : this.changeDateFormat(this.reportGeneration.controls['reportGenerationDateTo'].value),
      "reportType": this.reportType.value
    }

    document.getElementById('loader').style.display = 'block';
    this.commonService.getReportDataValue(page, body).subscribe(res => {
      document.getElementById('loader').style.display = 'none';
      if (res.message == "") {
        this.hitAgain=true;
        this.reportData = res.result.data;
        this.currentPage = res.result.pageInfo.currentPage;
        this.totalPages = res.result.pageInfo.totalPage;
        this.pageArray = this.getArrayOfPage(this.totalPages, this.currentPage);
        if (this.reportData.length > 0) {
          this.reportData.forEach(element => {
            if (element.status == 'INITIALIZED' && this.hitAgain==true) {
              this.hitAgain=false;
             this.reportInterval= setTimeout(() => {
                this.getReportData(this.currentPage)
              }, 10000);

            }
          });
        }
      } else {
        this.modalService.dismissAll();
        this.errorMessage = res.message;
        this.modalService.open(this.responseModel);
        this.reportData = [];
        this.currentPage = 1;
        this.totalPages = 1;
        this.pageArray = this.getArrayOfPage(this.totalPages, this.currentPage);
      }
    });
  }

  deleteId: any;
  deleteReport(id) {
    this.deleteId = id;
    this.modalService.open(this.deleteconfirmationModal, { windowClass: 'error-modal' });
  }
  reportInterval: any;
  ngOnDestroy() {
    clearInterval(this.reportInterval);
  }
  reportId: any;
  fileUrl: any;
  downloadReport(reportId) {
    this.reportId = reportId;
    document.getElementById('loader').style.display = 'block';
    this.commonService.downloadReport(this.reportId).subscribe(res => {
      document.getElementById('loader').style.display = 'none';
      if (res.message == "") {
        this.fileUrl = res.result.reportPath;

        this.fileReport(this.fileUrl, res.result.reportName)
      } else {
        this.modalService.dismissAll();
        this.errorMessage = res.message;
        this.modalService.open(this.responseModel);
      }
    });
  }

  fileReport(fileUrl, reportName) {
    const currentDate = new Date().toLocaleString('en-US', { timeZone: 'America/New_York', hour12: false });
    const dateTimeParts = currentDate.split(', ');
    const dateParts = dateTimeParts[0].split('/');
    const timeParts = dateTimeParts[1].split(':');

    const day = String(dateParts[1]).padStart(2, '0');
    const month = String(dateParts[0]).padStart(2, '0');
    const year = dateParts[2];
    const hours = String(timeParts[0]).padStart(2, '0');
    const minutes = String(timeParts[1]).padStart(2, '0');
    const seconds = String(timeParts[2]).padStart(2, '0');

    const formattedDate = `${day}-${month}-${year}_${hours}-${minutes}-${seconds}`;

    const fileName = `${reportName}_${formattedDate}.csv`;

    document.getElementById('loader').style.display = 'block';
    this.commonService.fileUrl(fileUrl).subscribe(res => {
      document.getElementById('loader').style.display = 'none';
      const blob = new Blob([res], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }, error => {
      if (error.status == 404)
        this.errorMessage = "File Not Found.";
      else
        this.errorMessage = "There is a problem processing your request. Please try again after some time.";
      document.getElementById('loader').style.display = 'none';
      this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
    });
  }

  goToPage(page) {
    if (page >= 1 && page <= this.totalPages) {
      this.getReportData(page);
    }
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
        pageArray.push(this.totalPages);
      } else {
        if (currentPage <= 2) {
          pageArray.push(1);
          pageArray.push(2);
          pageArray.push(3);
          pageArray.push(0);
          pageArray.push(this.totalPages);
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

  //   getLookUpDropDown(type){
  // console.log("getting called");
  //   this.resultLookUp=this.lookupValues.type;
  //   return this.resultLookUp;

  //   }

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

  closeModal() {
    this.modalService.dismissAll();
    this.submitted = false;

  }

  confirmDelete() {
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.deletePlatformReport(this.deleteId).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.modalService.dismissAll();
        this.successMessage = "Deleted Successfully";
        this.modalService.open(this.successModel);
        this.getReportData(1);
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

}
