import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonService } from '../../../services/commonService';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {
  @ViewChild('responseModel') responseModel: TemplateRef<any>;
  @ViewChild('confirmationModal') confirmationModal: TemplateRef<any>;
  @ViewChild('editconfirmationModal') editconfirmationModal: TemplateRef<any>;
  @ViewChild('deleteconfirmationModal') deleteconfirmationModal: TemplateRef<any>;
  @ViewChild('toggleConfirmationModal') toggleConfirmationModal: TemplateRef<any>;
  @ViewChild('successModel') successModel: TemplateRef<any>;
  editArray = [];
  errorMessage: any;
  pageArray: any = [];
  totalPage = 1;
  currentPage = 1;
  myTime: Date = new Date();
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  datepickerModel?: Date;
  uploadForm = new FormGroup({
    name: new FormControl('', Validators.required),
    link: new FormControl(''),
    time: new FormControl(false),
    dateFrom: new FormControl(''),
    dateTo: new FormControl(''),
    image: new FormControl('', Validators.required)
  });

  editUserAccess = false;
  createUserAccess = false;
  deleteUserAccess = false;
  bannerList: any;
  adminUserStatus: any;
  deleteId: any;
  toggleDataId: any;
  editId: any;
  isToggleActive: any;
  newIdValue: any;
  submitted = false;
  showNewToggle = false;
  reverseToggleValue = false;
  successMessage: any;
  toggleMessage: any;
  today: Date;
  editDetails: any = [];
  constructor(private commonService: CommonService, private router: Router, private modalService: NgbModal) {
    this.today = new Date();
    this.maxDate.setDate((this.maxDate.getDate() - 7))
  }
  fromDate = this.bsValue;
  toDate = this.maxDate;
  public placeholder: string = "dd/mm/yyyy";

  ngOnInit() {
    let access = JSON.parse(localStorage.getItem('acl'));
    access.forEach((element) => {
      if (element.key == 'ALERTS') {
        this.editUserAccess = element.access.edit;
        this.createUserAccess = element.access.create;
        this.deleteUserAccess = element.access.delete;
      }
    })
    this.search(1);
  }

  addNewAlert() {
    this.router.navigate(['/admin/add-alert']);
  }

  search(page) {

    document.getElementById('loader')!.style.display = 'block';
    this.commonService.getAlerts(page).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.bannerList = res.result.alerts;
        this.currentPage = res.result.pageInfo.currentPage;
        this.totalPage = res.result.pageInfo.totalPage;
        this.pageArray = this.getArrayOfPage(this.totalPage, this.currentPage);
      } else {
        this.errorMessage = res.message;
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
    }, error => {
      document.getElementById('loader').style.display = 'none';
      this.errorMessage = "There is a problem processing your request. Please try again after some time.";
      this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
    });
  }


  goToPage(page) {
    if (page >= 1 && page <= this.totalPage) {
      this.search(page);
    }
  }

  closeModal() {
    this.modalService.dismissAll();
    this.submitted = false;
    this.uploadForm.reset();
  }

  deleteAlert(id) {
    this.deleteId = id;
    this.modalService.open(this.deleteconfirmationModal, { windowClass: 'error-modal' });
  }

  editAlert(id, subject, body, data) {
    this.editDetails.push({
      "data": data,
      "id": id,
      "subject": subject,
      "body": body,
      
    })
    this.router.navigate(['/admin/add-alert'], { queryParams: { data: JSON.stringify(this.editDetails) }, skipLocationChange: true });
    
  }

  toggle(){
    
     let body ={ "isActive": this.isToggleActive,
      "_method": "PUT"
     }
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.editAlert(body ,this.editId).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.modalService.dismissAll();
        this.successMessage = res.message;
        this.modalService.open(this.successModel);
        this.search(1);
      } else {
        this.modalService.dismissAll();
        this.errorMessage = res.message;
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
    });
  }

  confirmDelete() {
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.deleteAlert(this.deleteId).subscribe(res => {
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

  isScreenMobile() {
    let screenWidth = window.innerWidth;
    if (screenWidth >= 375 && screenWidth < 765) return true;
    else return false;
  }

  isScreenipad() {
    let screenWidth = window.innerWidth;
    if (screenWidth > 765 && screenWidth < 1024) return true;
    else return false;
  }
  getToggleValue(event, value, idToggle) {
    this.toggleDataId = idToggle;
    this.editId = idToggle;
    if (event.target.checked) {
      this.isToggleActive = true;
      this.toggleMessage = "Are you sure you want to activate this alert ?";
      this.modalService.open(this.toggleConfirmationModal, { backdrop: 'static', keyboard: false });
    } else if (!event.target.checked) {
      this.isToggleActive = false;
      this.toggleMessage = "Are you sure you want to deactivate this alert ?";
      this.modalService.open(this.toggleConfirmationModal, { backdrop: 'static', keyboard: false });
    }
  }
    setToggleVal() {
    this.modalService.dismissAll();
    this.submitted = false;
    this.uploadForm.reset();
    this.newIdValue = this.toggleDataId;
    if (this.showNewToggle == false) {
      this.showNewToggle = true;
      var p = document.getElementById(this.toggleDataId) as HTMLInputElement;
      this.reverseToggleValue = !p.checked
    } else {
      this.showNewToggle = false;
      var p = document.getElementById(this.toggleDataId) as HTMLInputElement;
      this.reverseToggleValue = !p.checked
    }
  }
}
