import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonService } from '../../../services/commonService';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { initOffset } from 'ngx-bootstrap/chronos/units/offset';
import { InputOutputPropertySet } from '@angular/compiler';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-promotions',
  templateUrl: './add-promotions.component.html',
  styleUrls: ['./add-promotions.component.css']
})
export class AddPromotionsComponent implements OnInit {
  @ViewChild('responseModel') responseModel: TemplateRef<any>;
  @ViewChild('addPromoModel') addPromoModel: TemplateRef<any>;
  @ViewChild('confirmationModal') confirmationModal: TemplateRef<any>;
  @ViewChild('successModel') successModel: TemplateRef<any>;
  @ViewChild('fileInput') fileInput;
  errorMessage: any;
  isMeridian = false;
  showSpinners = true;
  myTime: Date = new Date();
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  datepickerModel?: Date;
  uploadForm = new FormGroup({
    name: new FormControl('', Validators.required),
    link: new FormControl('', Validators.required),
    time: new FormControl(false),
    Action: new FormControl(false),
    actionTaken: new FormControl(),
    bundle: new FormControl(),
    dateFrom: new FormControl(''),
    dateTo: new FormControl(''),
    amount: new FormControl(''),
    image: new FormControl('', Validators.required)
  });

  editUserAccess = false;
  createUserAccess = false;
  deleteUserAccess = false;
  bannerList: any;
  actionValue: any;
  topupSelected: boolean = false;
  bundleSelected: boolean = false;
  adminUserStatus: any;
  submitted = false;
  showNewToggle = false;
  reverseToggleValue = false;
  successMessage: any;
  prevImage: any;
  imageEdit: any;
  actionList: any;
  toggleMessage: any;
  isToggleActive: any;
  bundleList: any;
  toggleDataId: any;
  newIdValue: any;
  today: Date;
  promoUrl: any
  constructor(private commonService: CommonService, private router: Router, private modalService: NgbModal) {
    this.today = new Date();
    this.maxDate.setDate((this.maxDate.getDate() - 7))
  }
  fromDate = this.bsValue;
  toDate = this.maxDate;
  public placeholder: string = "dd/mm/yyyy";

  ngOnInit() {
    let body = { "lookups": ["promotionActionType"] };
    document.getElementById('loader').style.display = 'block';
    this.commonService.getLookups(body).subscribe(res => {
      document.getElementById('loader').style.display = 'none';
      if (res.success == true) {
        this.actionList = res.result.promotionActionType;
      } else {
        this.errorMessage = res.message;
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
    });
    document.getElementById('loader')!.style.display = 'block';
    let userbody = { "lookups": ["promotionBundleIdentifier"] };
    this.commonService.getUserLookups(userbody).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.bundleList = res.result.promotionBundleIdentifier;
      } else {
        this.bundleList = null;
        this.errorMessage = res.message;
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
    }, error => {
      document.getElementById('loader').style.display = 'none';
      this.errorMessage = "There is a problem processing your request. Please try again after some time.";
      this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
    });
    let access = JSON.parse(localStorage.getItem('acl'));
    access.forEach((element) => {
      if (element.key == 'PROMOTIONS') {
        this.editUserAccess = element.access.edit;
        this.createUserAccess = element.access.create;
        this.deleteUserAccess = element.access.delete;
      }
    })
    this.uploadForm.controls.image.setValue('');
    this.promoUrl = environment.baseApiUrl;
  }

  closeModal() {
    this.modalService.dismissAll();
    this.submitted = false;
    this.uploadForm.reset();
    this.router.navigateByUrl('/admin/add-promotions');
  }

  spaceRestrict(event: any) {
    if (event.target.selectionStart == 0 && event.code == 'Space')
      event.preventDefault();
  }

  goBack() {
    this.router.navigateByUrl('/admin/promotions');
  }

  DataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',')
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i)

    return new Blob([ia], { type: mimeString })
  }

  openPromoModal() {
    this.uploadForm.controls.image.setValue('');
    this.modalService.open(this.addPromoModel, { backdrop: 'static', keyboard: false });
  }

  back() {
    this.modalService.dismissAll();
  }

  addPromoDetails() {
    this.submitted = true;
    if (!this.uploadForm.valid) {
      return;
    }
    this.modalService.dismissAll();
    this.uploadForm.controls.image.setValue(this.uploadForm.controls.image.value);
    this.modalService.open(this.confirmationModal, { backdrop: 'static', keyboard: false });
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
  forMinute: any;
  forSecond: any;
  exactTime(value) {
    if (value) {
      this.forMinute = value.getMinutes();
      this.forSecond = value.getSeconds();
      if (value.getMinutes() < 10) {

        this.forMinute = "0" + this.forMinute
      }
      var newvalue = this.addZero(value.getHours()) + ":" + this.forMinute + ":" + this.addZero(value.getSeconds());
      value = new Date();
      return newvalue;
    }
    return "";
  }
  addZero(i) {
    if (i < 10) { i = "0" + i }
    return i;
  }
  confirmUpload() {
    let promo: any = {
      "name": this.uploadForm.controls.name.value,
      "isScheduled": this.uploadForm.controls.time.value == null || this.uploadForm.controls.time.value == false ? false : true,
      "image": this.uploadForm.controls.image.value
    }
    if (this.uploadForm.controls.link.value != null) {
      promo.link = this.uploadForm.controls.link.value
    }
    if (this.uploadForm.controls.Action.value == true) {
      promo.actionType = this.uploadForm.controls.actionTaken.value.key;

      if (this.uploadForm.controls.actionTaken.value.key == 'TOPUP') {
        promo.amount = this.uploadForm.controls.amount.value;
      }
      if (this.uploadForm.controls.actionTaken.value.key == 'PREPAID_BUNDLE') {
        promo.bundleIdentifier = this.uploadForm.controls.bundle.value.key;
      }
    }

    if (this.uploadForm.controls.time.value) {
      if (this.uploadForm.controls.dateFrom.value != null && this.uploadForm.controls.dateFrom.value != ' ') {
        promo.startDateTime = this.changeDateFormat(this.uploadForm.controls.dateFrom.value) + ' ' + this.exactTime(this.uploadForm.controls.dateFrom.value)
      }
      if (this.uploadForm.controls.dateTo.value != null && this.uploadForm.controls.dateTo.value != ' ') {
        promo.endDateTime = this.changeDateFormat(this.uploadForm.controls.dateTo.value) + ' ' + this.exactTime(this.uploadForm.controls.dateTo.value)
      }
    }
    const form_data = new FormData();
    for (let key in promo) {
      form_data.append(key, promo[key]);
    }

    document.getElementById('loader')!.style.display = 'block';
    this.commonService.addPromotionBanners(form_data).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.modalService.dismissAll();
        this.successMessage = "Success";
        this.uploadForm.reset();
        let image = document.querySelector("#previewPromo") as HTMLImageElement;
        image.src = "assets/img/promotion/Upload.svg";
        this.submitted = false;
        this.modalService.open(this.successModel);
      } else {
        this.modalService.dismissAll();
        this.errorMessage = res.message;
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
        this.uploadForm.reset();
        let image = document.querySelector("#previewPromo") as HTMLImageElement;
        image.src = "assets/img/promotion/Upload.svg";
        this.submitted = false;
        this.actionValue = false;
        this.topupSelected = false;
        this.uploadForm.controls['Action'].reset();
        this.uploadForm.controls['actionTaken'].reset();
        this.uploadForm.controls['amount'].reset();
        this.fileInput.nativeElement.value = "";
        this.uploadForm.controls['link'].setValidators(Validators.required);
        this.uploadForm.controls['link'].updateValueAndValidity();
      }
    }, error => {
      this.actionValue = false;
      this.topupSelected = false;
      this.uploadForm.controls['Action'].reset();
      this.uploadForm.controls['actionTaken'].reset();
      this.uploadForm.controls['amount'].reset();
      this.uploadForm.controls['link'].setValidators(Validators.required);
      this.uploadForm.controls['link'].updateValueAndValidity();
      document.getElementById('loader').style.display = 'none';
      this.errorMessage = "There is a problem processing your request. Please try again after some time.";
      this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      this.fileInput.nativeElement.value = "";
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

  action(event) {
    this.bundleSelected = false;
    this.topupSelected = false;
    if (event.target.checked) {
      this.actionValue = true;
      this.uploadForm.controls.link.setValue(null);
      this.uploadForm.controls['actionTaken'].setValidators(Validators.required);
      this.uploadForm.controls['actionTaken'].updateValueAndValidity();
      this.uploadForm.controls['link'].setValidators(null);
      this.uploadForm.controls['link'].updateValueAndValidity();

    }
    else {
      this.uploadForm.controls['actionTaken'].reset();
      this.actionValue = false;
      this.uploadForm.controls['link'].setValidators(Validators.required);
      this.uploadForm.controls['link'].updateValueAndValidity();
      this.uploadForm.controls['amount'].clearValidators();
      this.uploadForm.controls['amount'].updateValueAndValidity();
      this.uploadForm.controls['bundle'].clearValidators();
      this.uploadForm.controls['bundle'].updateValueAndValidity();
      this.uploadForm.controls['actionTaken'].clearValidators();
      this.uploadForm.controls['actionTaken'].updateValueAndValidity();
    }
  }

  typeDropdown(event) {

    if (event != undefined && event.key == "TOPUP") {
      this.topupSelected = true;
      this.bundleSelected = false;

      this.uploadForm.controls['amount'].reset();
      this.uploadForm.controls['amount'].setValidators(Validators.required);
      this.uploadForm.controls['amount'].updateValueAndValidity();
      this.uploadForm.controls['bundle'].setValidators(null);
      this.uploadForm.controls['bundle'].updateValueAndValidity();
    }
    else if (event != undefined && event.key == "PREPAID_BUNDLE") {
      this.bundleSelected = true;
      this.topupSelected = false;
      this.uploadForm.controls['bundle'].reset();
      this.uploadForm.controls['amount'].setValidators(null);
      this.uploadForm.controls['amount'].updateValueAndValidity();
      this.uploadForm.controls['bundle'].setValidators(Validators.required);
      this.uploadForm.controls['bundle'].updateValueAndValidity();
    }

  }

  onUpload(event, type) {
    let file = event.target.files[0];
    if (/jpeg|jpg|png/.test(file.type)) {
      const oFReader = new FileReader();
      oFReader.readAsDataURL(file);
      oFReader.onload = (e: any) => {
        if (type == 'add') {
          let image = document.querySelector("#previewPromo") as HTMLImageElement;
          image.src = oFReader.result as string;
          this.prevImage = oFReader.result as string;
          this.uploadForm.controls.image.setValue(file);
        }
      };

    } else {
      this.modalService.dismissAll();
      this.errorMessage = "Please select a valid image";
      this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      let image = document.getElementById("previewPromo") as HTMLImageElement;
      image.src = 'assets/img/promotion/Upload.svg';
      this.prevImage = '';
      this.uploadForm.controls.image.setValue('');
    }

    if (file.size / 1024 > 500) {
      this.modalService.dismissAll();
      this.errorMessage = "Please select a valid image, this file is greater than 500 KB.";
      this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      let image = document.getElementById("previewPromo") as HTMLImageElement;
      image.src = 'assets/img/promotion/Upload.svg';
      this.prevImage = '';
      this.uploadForm.controls.image.setValue('');
    }

  }
  checkDecimal(value: string) {
    var regExpString = "^[0-9][0-9]*[.]?[0-9]{0,2}$";
    return String(value).match(new RegExp(regExpString));
  }
  checkTwoDecimalPlace(event) {
    if (event.target.value) {
      let currentValue: string = event.target.value;
      if (currentValue !== "" && this.checkDecimal(currentValue) == null) {
        event.target.value = event.target.value.slice(
          0,
          event.target.value.length - 1
        );
        event.preventDefault();
      }
    }
  }
  close() {
    this.modalService.dismissAll();
    this.uploadForm.controls.image.setValue('');
    this.router.navigateByUrl('/admin/promotions');

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
