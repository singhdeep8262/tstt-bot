import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonService } from '../../../services/commonService';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { initOffset } from 'ngx-bootstrap/chronos/units/offset';
import { InputOutputPropertySet } from '@angular/compiler';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-add-platform-report',
  templateUrl: './add-platform-report.component.html',
  styleUrls: ['./add-platform-report.component.css']
})
export class AddPlatformReportComponent implements OnInit {
  @ViewChild('responseModel') responseModel: TemplateRef<any>;
  @ViewChild('successModel') successModel: TemplateRef<any>;
  @ViewChild('confirmationModal') confirmationModal: TemplateRef<any>;

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
  reportName = "";
  lookupValues: any = [];

  submitted = false;
  resDateArray = new Map();

  provideReportDetails: FormGroup = new FormGroup({
    "reportType": new FormControl('', Validators.required),
  });
  reportType = new FormControl('', Validators.required)
  resultLookUp: any = [];
  filterData: any = [];
  npsFormLabels: boolean=false;

  constructor(private commonService: CommonService, private router: Router, private route: ActivatedRoute, private modalService: NgbModal) {
    this.today = new Date();
    this.maxDate.setDate((this.maxDate.getDate() - 7))
  }

  fromDate = this.bsValue;
  toDate = this.maxDate;
  public placeholder: string = "dd/mm/yyyy";

  ngOnInit() {
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

  }

  todaydate() {
    if (this.today != this.bsValue) {
      this.bsValue == this.today
    }
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
          if (element.key == "fromDate") {
            form[element.key] = new FormControl(this.maxDate);
          } else if (element.key == "toDate") {
            form[element.key] = new FormControl(this.bsValue);
          } else {
            form[element.key] = new FormControl('');
          }
          if (element.type == 'SELECT_LOOKUP') {
            if(element.lookupKey==="npsFormLabels") {
              this.npsFormLabels=true;
            }
            else{
                this.npsFormLabels=false;
            }
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
  reportData = [];

  openGenerateModel() {
    this.modalService.open(this.confirmationModal);
  }

  cancelGeneration() {
    this.router.navigate(['/admin/platform-reports']);
  }

  search() {
    this.modalService.dismissAll();
    this.submitted = true;
    if (!this.provideReportDetails.valid) {
      return;
    }


    if (this.provideReportDetails.get("fromDate")) {
      this.provideReportDetails.controls['fromDate'].updateValueAndValidity();
      this.provideReportDetails.controls['fromDate'].setValue(this.changeDateFormat(this.provideReportDetails.controls['fromDate'].value) == undefined ? "" : this.changeDateFormat(this.provideReportDetails.controls['fromDate'].value))
    }

    if (this.provideReportDetails.get("toDate")) {
      this.provideReportDetails.controls['toDate'].updateValueAndValidity();
      this.provideReportDetails.controls['toDate'].setValue(this.changeDateFormat(this.provideReportDetails.controls['toDate'].value) == undefined ? "" : this.changeDateFormat(this.provideReportDetails.controls['toDate'].value))
    }

    let obj = {};

    this.filterData.forEach((element, i) => {

      obj[element.key] = this.provideReportDetails.get(`${element.key}`).value;

    });

    let body = {
      "reportType": this.reportType.value,
      "filters": obj
    }

    document.getElementById('loader')!.style.display = 'block';
    this.commonService.generateReport(body).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.router.navigate(['/admin/platform-reports']);
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

  resetData() {
    this.provideReportDetails.reset();
  }
  
  close() {
    this.modalService.dismissAll();
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
    document.getElementById('loader').style.display = 'block';
    this.commonService.fileUrl(fileUrl).subscribe(res => {
      document.getElementById('loader').style.display = 'none';
      const blob = new Blob([res], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = reportName + '.csv';
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

}
