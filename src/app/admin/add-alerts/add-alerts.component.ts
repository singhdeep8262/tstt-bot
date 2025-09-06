import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonService } from '../../../services/commonService';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { initOffset } from 'ngx-bootstrap/chronos/units/offset';
import { InputOutputPropertySet } from '@angular/compiler';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-alerts',
  templateUrl: './add-alerts.component.html',
  styleUrls: ['./add-alerts.component.css']
})
export class AddAlertsComponent implements OnInit {
  @ViewChild('responseModel') responseModel: TemplateRef<any>;
  @ViewChild('addPromoModel') addPromoModel: TemplateRef<any>;
  @ViewChild('confirmationModal') confirmationModal: TemplateRef<any>;
  @ViewChild('editConfirmationModal') editConfirmationModal: TemplateRef<any>;
  @ViewChild('successModel') successModel: TemplateRef<any>;
  errorMessage: any;
  isMeridian = false;
  showSpinners = true;
  myTime: Date = new Date();
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  datepickerModel?: Date;
  uploadForm = new FormGroup({
    subject: new FormControl('', Validators.required),
    body: new FormControl('', Validators.required),
  });
  isEditScreen = false;
  editUserAccess = false;
  createUserAccess = false;
  deleteUserAccess = false;
  bannerList: any;
  adminUserStatus: any;
  submitted = false;
  showNewToggle = false;
  reverseToggleValue = false;
  successMessage: any;
  prevImage: any;
  toggleDataId: any;
  newIdValue: any;
  today: Date;
  promoUrl: any
  editAlertId: any;
  constructor(private commonService: CommonService, private router: Router, private route: ActivatedRoute, private modalService: NgbModal) {
    this.today = new Date();
    this.maxDate.setDate((this.maxDate.getDate() - 7))
  }
  fromDate = this.bsValue;
  toDate = this.maxDate;
  public placeholder: string = "dd/mm/yyyy";
  editAlert = false;
  ngOnInit() {
    let access = JSON.parse(localStorage.getItem('acl'));
    access.forEach((element) => {
      if (element.key == 'ALERTS') {
        this.createUserAccess = element.access.create;
      }
    })

    this.route.queryParams.subscribe((params) => {
      let response = JSON.parse(params['data']);
      if (response) {
        this.isEditScreen = true;
        this.uploadForm.controls.body.setValue(response[0].body);
        this.uploadForm.controls.subject.setValue(response[0].subject);
        this.editAlertId = response[0].id;
      } else {
        this.isEditScreen = false;
      }
    });

    this.promoUrl = environment.baseApiUrl;
  }

  closeModal() {
    this.modalService.dismissAll();
    this.submitted = false;
    this.uploadForm.reset();
  }

  spaceRestrict(event: any) {
    if (event.target.selectionStart == 0 && event.code == 'Space')
      event.preventDefault();
  }

  goBack() {
    this.router.navigateByUrl('/admin/alert');
  }


  back() {
    this.modalService.dismissAll();
  }

  addAlertDetails() {
    this.submitted = true;
    if (!this.uploadForm.valid) {
      return;
    }
    this.modalService.dismissAll();
    if (this.isEditScreen == false) {
      this.modalService.open(this.confirmationModal, { backdrop: 'static', keyboard: false });

    }
    if (this.isEditScreen == true) {
      this.modalService.open(this.editConfirmationModal, { backdrop: 'static', keyboard: false });

    }
  }

  confirmEdit() {

    this.submitted = true;
    if (!this.uploadForm.valid) {
      return;
    }

    let body = {
      "subject": this.uploadForm.controls.subject.value,
      "body": this.uploadForm.controls.body.value,
    }

    document.getElementById('loader')!.style.display = 'block';
    this.commonService.editAlert(body, this.editAlertId).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.modalService.dismissAll();
        this.successMessage = res.message
        this.modalService.open(this.successModel, { backdrop: 'static', keyboard: false });
        this.isEditScreen = false;
      }
      else {
        this.isEditScreen = false;
        this.modalService.dismissAll();
        this.errorMessage = res.message;
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
    });
  }

  confirmUpload() {
    this.submitted = true;
    if (!this.uploadForm.valid) {
      return;
    }

    let body = {
      "subject": this.uploadForm.controls.subject.value,
      "body": this.uploadForm.controls.body.value,
    }

    document.getElementById('loader')!.style.display = 'block';
    this.commonService.addAlert(body).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.modalService.dismissAll();
        this.successMessage = res.message
        this.modalService.open(this.successModel, { backdrop: 'static', keyboard: false });

      }
      else {
        this.modalService.dismissAll();
        this.errorMessage = res.message;
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
    });

  }
  promodatevalidity(event) {
    if (event.target.checked) {
      this.uploadForm.controls['dateFrom'].setValidators([Validators.required]);
      this.uploadForm.controls['dateFrom'].updateValueAndValidity();
      this.uploadForm.controls['dateTo'].setValidators([Validators.required]);
      this.uploadForm.controls['dateTo'].updateValueAndValidity();
    }
    else {
      this.uploadForm.controls['dateFrom'].clearValidators();
      this.uploadForm.controls['dateFrom'].updateValueAndValidity();
      this.uploadForm.controls['dateTo'].clearValidators();
      this.uploadForm.controls['dateTo'].updateValueAndValidity();
    }
  }

  // onUpload(event, type) {
  //   let file = event.target.files[0];
  //   if (/jpeg|jpg|png/.test(file.type)) {
  //     const oFReader = new FileReader();
  //     oFReader.readAsDataURL(file);
  //     oFReader.onload = (e: any) => {
  //       if (type == 'add') {
  //         let image = document.querySelector("#previewPromo") as HTMLImageElement;
  //         image.src = oFReader.result as string;
  //         this.prevImage = oFReader.result as string;
  //         this.uploadForm.controls.image.setValue(file);
  //       }
  //     };
  //   } else {
  //     this.modalService.dismissAll();
  //     this.errorMessage = "Please select a valid image";
  //     this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
  //   }

  //   if (file.size / 1024 > 500) {
  //     this.modalService.dismissAll();
  //     this.errorMessage = "Please select a valid image, this file is greater than 500 KB.";
  //     this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
  //   }

  // }


  close() {
    this.modalService.dismissAll();
    this.router.navigateByUrl('/admin/alert');

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
}

