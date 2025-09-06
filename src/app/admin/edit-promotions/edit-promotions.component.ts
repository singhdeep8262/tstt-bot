
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonService } from '../../../services/commonService';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { initOffset } from 'ngx-bootstrap/chronos/units/offset';
import { InputOutputPropertySet } from '@angular/compiler';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-edit-promotions',
  templateUrl: './edit-promotions.component.html',
  styleUrls: ['./edit-promotions.component.css']
})
export class EditPromotionsComponent implements OnInit {
  @ViewChild('responseModel') responseModel: TemplateRef<any>;
  @ViewChild('addPromoModel') addPromoModel: TemplateRef<any>;
  @ViewChild('editPromoModel') editPromoModel: TemplateRef<any>;
  @ViewChild('confirmationModal') confirmationModal: TemplateRef<any>;
  @ViewChild('editconfirmationModal') editconfirmationModal: TemplateRef<any>;
  @ViewChild('deleteconfirmationModal') deleteconfirmationModal: TemplateRef<any>;
  @ViewChild('toggleConfirmationModal') toggleConfirmationModal: TemplateRef<any>;
  @ViewChild('successModel') successModel: TemplateRef<any>;
  errorMessage: any;;
  isMeridian = false;
  showSpinners = true;
  myTime: Date = new Date();
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  datepickerModel?: Date;
  editForm = new FormGroup({
    name: new FormControl('', Validators.required),
    link: new FormControl('', Validators.required),
    time: new FormControl(false),
    dateFrom: new FormControl(),
    dateTo: new FormControl(),
    // subject: new FormControl('', Validators.required),
    // body: new FormControl('', Validators.required),
    image: new FormControl('', Validators.required),
    Action: new FormControl(),
    actionTaken: new FormControl(),
    bundle: new FormControl(),
    amount: new FormControl(),
  });
  editUserAccess = false;
  createUserAccess = false;
  deleteUserAccess = false;
  bannerList: any;
  adminUserStatus: any;
  submitted = false;
  actionValue: any;
  topupSelected: boolean = false;
  bundleSelected: boolean = false;
  actionList: any = [];
  bundleList: any = [];
  showNewToggle = false;
  reverseToggleValue = false;
  successMessage: any;
  prevImage: any;
  imageEdit: any;
  toggleMessage: any;
  isToggleActive: any;
  toggleDataId: any;
  newIdValue: any;
  today: Date;
  promoUrl: any
  editDataValue: any;
  lookupsDone = false;

  constructor(private commonService: CommonService, private router: Router, private route: ActivatedRoute, private modalService: NgbModal) {
    this.today = new Date();
    this.maxDate.setDate((this.maxDate.getDate() - 7))
  }
  fromDate = this.bsValue;
  toDate = this.maxDate;
  public placeholder: string = "dd/mm/yyyy";

  ngOnInit() {
    this.getLookupValues();


    document.getElementById('loader')!.style.display = 'block';
    let userbody = { "lookups": ["promotionBundleIdentifier"] };
    this.commonService.getUserLookups(userbody).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.bundleList = res.result.promotionBundleIdentifier;
      } else {
        this.bundleList = [];
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
    this.promoUrl = environment.baseApiUrl;

    this.route.queryParams.subscribe((params) => {
      let response = JSON.parse(params['data']);
      if (response) {
        this.editId = response[0].id;
        this.editDataValue = response[0].data;

        this.editbanner(this.editDataValue, this.editId);

      }
    })

  }

  getLookupValues() {

    let body = { "lookups": ["promotionActionType", "promotionBundleIdentifier"] };
    document.getElementById('loader').style.display = 'block';
    this.commonService.getLookups(body).subscribe(res => {
      document.getElementById('loader').style.display = 'none';
      if (res.success == true) {

        this.actionList = res.result.promotionActionType;
        this.lookupsDone = true;
      } else {
        this.errorMessage = res.message;
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
    });
  }

  closeModal() {
    this.modalService.dismissAll();
    this.submitted = false;
  }

  spaceRestrict(event: any) {
    if (event.target.selectionStart == 0 && event.code == 'Space')
      event.preventDefault();
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
        } else {
          let image = document.querySelector("#editPreviewPromo") as HTMLImageElement;
          image.src = oFReader.result as string;
          this.imageEdit = oFReader.result as string;
          this.editForm.controls.image.setValue(file);
        }
      };
    } else {
      this.modalService.dismissAll();
      this.errorMessage = "Please select a valid image";
      this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
    }

    if (file.size / 1024 > 500) {
      this.modalService.dismissAll();
      this.errorMessage = "Please select a valid image, this file is greater than 500 KB.";
      this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
    }

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


  reverseImage(imageUrl) {
    this.commonService.fetchDataImage(imageUrl).subscribe(blob => {
      const reader = new FileReader();
      const binaryString = reader.readAsDataURL(blob);
      reader.onload = (event: any) => {
        let file;
        file = this.DataURIToBlob(event.target.result);
        this.editForm.controls.image.setValue(file);
      };
    });

  }

  openPromoModal() {
    this.router.navigateByUrl('/admin/add-promotions');

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


  deleteId: any;
  editId: any;
  deletebanner(id) {
    this.deleteId = id;
    this.modalService.open(this.deleteconfirmationModal, { windowClass: 'error-modal' });
  }



  editbanner(data, id) {
    this.isToggleActive = data.isActive;
    this.editId = id;
    let bundleID = data.bundleIdentifier;
    this.imageEdit = this.promoUrl + data.imageUrl;
    this.editForm.controls.name.setValue(data.name);
    this.editForm.controls.link.setValue(data.link);
    if (data.actionType != "" && data.actionType != null) {
      this.actionValue = true;
      this.editForm.controls['link'].setValidators(null);
      this.editForm.controls['link'].updateValueAndValidity();
      this.editForm.controls.Action.setValue(this.actionValue);

      let intervalId = setInterval(() => {
        if (this.lookupsDone == true) {
          this.actionList.forEach((element) => {

            if (element.key == data.actionType) {

              this.editForm.controls.actionTaken.setValue(element);
              if (data.actionType == 'TOPUP') {
                this.topupSelected = true;
                this.editForm.controls.amount.setValue(data.amount);

              } else {
                this.bundleSelected = true
                this.bundleList.forEach((element) => {
                  if (bundleID == element.key) {
                    this.editForm.controls.bundle.setValue(element);
                    this.editForm.controls.bundle.setValidators(Validators.required);
                    this.editForm.controls.bundle.updateValueAndValidity();

                  }

                })

              }

            }
            clearInterval(intervalId);
          });

        }
      }, 1000);

    } else {
      this.topupSelected = false;
      this.bundleSelected = false;
      this.actionValue = false;
      this.editForm.controls.Action.setValue(this.actionValue);
      this.editForm.controls['link'].setValidators(Validators.required);
      this.editForm.controls['link'].updateValueAndValidity();
    }
    if (data.isScheduled != false) {
      this.editForm.get('time').setValue(true);
      this.editForm.controls.dateFrom.setValue(data.startDateTime)
      this.editForm.controls.dateTo.setValue(data.endDateTime)

      if (data.startDateTime == this.editForm.controls.dateFrom.value) {
        this.editForm.controls.dateFrom.setValue(new Date(data.startDateTime));
      }
      if (data.endDateTime == this.editForm.controls.dateTo.value) {
        this.editForm.controls.dateTo.setValue(new Date(data.endDateTime))
      }
    }
    else {
      this.editForm.get('time').setValue(false);
    }
    this.editForm.controls.image.setValue(this.promoUrl + data.imageUrl);
  }


  editPromoDetails() {
    this.submitted = true;
    if (!this.editForm.valid) {
      return
    }
    this.modalService.dismissAll();
    if (/^((http|https|ftp):\/\/)/.test(this.editForm.controls.image.value))
      this.reverseImage(this.editForm.controls.image.value);

    this.modalService.open(this.confirmationModal, { backdrop: 'static', keyboard: false });
  }


  close() {
    this.modalService.dismissAll();
    this.editForm.controls.image.setValue('');
    this.router.navigateByUrl('/admin/promotions');
  }

  promoEditvalidity(event) {
    if (event.target.checked) {
      this.editForm.controls['dateFrom'].setValidators([Validators.required]);
      this.editForm.controls['dateFrom'].updateValueAndValidity();
      this.editForm.controls['dateTo'].setValidators([Validators.required]);
      this.editForm.controls['dateTo'].updateValueAndValidity();
    }
    else {
      this.editForm.controls['dateFrom'].clearValidators();
      this.editForm.controls['dateFrom'].updateValueAndValidity();
      this.editForm.controls['dateTo'].clearValidators();
      this.editForm.controls['dateTo'].updateValueAndValidity();
    }
  }


  confirmEdit() {
    this.showNewToggle = false;
    if (this.editForm.get('time').value == true) {
      this.editForm.controls.dateFrom.setValue(this.changeDateFormat(this.editForm.controls.dateFrom.value) + ' ' + this.exactTime(this.editForm.controls.dateFrom.value));
      this.editForm.controls.dateTo.setValue(this.changeDateFormat(this.editForm.controls.dateTo.value) + ' ' + this.exactTime(this.editForm.controls.dateTo.value));

    }
    let promo: any = {
      "name": this.editForm.controls.name.value,
      "isScheduled": this.editForm.controls.time.value == null || this.editForm.controls.time.value == false ? false : true,
      "image": this.editForm.controls.image.value,
      "isActive": this.isToggleActive,
      "_method": "PUT"
    }
    if (this.editForm.controls.link.value != null) {
      promo.link = this.editForm.controls.link.value
    }
    if (this.editForm.controls.Action.value == true) {
      promo.actionType = this.editForm.controls.actionTaken.value.key;

      if (this.editForm.controls.actionTaken.value.key == 'TOPUP') {
        promo.amount = this.editForm.controls.amount.value;
      }
      if (this.editForm.controls.actionTaken.value.key == 'PREPAID_BUNDLE') {
        promo.bundleIdentifier = this.editForm.controls.bundle.value.key;
      }
    }

    if (this.editForm.controls.time.value) {
      if (this.editForm.controls.dateFrom.value != null && this.editForm.controls.dateFrom.value != ' ') {
        promo.startDateTime = this.editForm.controls.dateFrom.value
      }
      if (this.editForm.controls.dateTo.value != null && this.editForm.controls.dateTo.value != ' ') {
        promo.endDateTime = this.editForm.controls.dateTo.value
      }
    }
    const form_data = new FormData();
    for (let key in promo) {
      form_data.append(key, promo[key]);
    }
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.updatePromotionBanner(form_data, this.editId).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.modalService.dismissAll();
        let image = document.querySelector("#editPreviewPromo") as HTMLImageElement;
        image.src = "assets/img/promotion/Upload.svg";
        this.successMessage = res.message;
        this.modalService.open(this.successModel);
        this.editForm.reset();
        this.topupSelected = false;
        this.bundleSelected = false;
        this.actionValue = false;
        this.submitted = false;
      } else {
        this.modalService.dismissAll();
        this.errorMessage = res.message;
        this.topupSelected = false;
        this.bundleSelected = false;
        this.actionValue = false;
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
        this.editForm.controls['Action'].reset();
        this.editForm.controls['actionTaken'].reset();
        this.editForm.controls['link'].setValidators(Validators.required);
        this.editForm.controls['link'].updateValueAndValidity();
      }
    }, error => {
      this.editForm.controls['Action'].reset();
      this.editForm.controls['actionTaken'].reset();
      this.editForm.controls['link'].setValidators(Validators.required);
      this.editForm.controls['link'].updateValueAndValidity();
      document.getElementById('loader').style.display = 'none';
      this.errorMessage = "There is a problem processing your request. Please try again after some time.";
      this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
    });
  }

  back() {
    this.modalService.dismissAll();
  }

  action(event) {
    this.bundleSelected = false;
    this.topupSelected = false;
    if (event.target.checked) {
      this.actionValue = true;
      this.editForm.controls.link.setValue(null);
      this.editForm.controls['actionTaken'].setValidators(Validators.required);
      this.editForm.controls['actionTaken'].updateValueAndValidity();
      this.editForm.controls['link'].setValidators(null);
      this.editForm.controls['link'].updateValueAndValidity();

    }
    else {
      this.editForm.controls['actionTaken'].reset();
      this.actionValue = false;
      this.editForm.controls['link'].setValidators(Validators.required);
      this.editForm.controls['link'].updateValueAndValidity();
      this.editForm.controls['amount'].clearValidators();
      this.editForm.controls['amount'].updateValueAndValidity();
      this.editForm.controls['bundle'].clearValidators();
      this.editForm.controls['bundle'].updateValueAndValidity();
      this.editForm.controls['actionTaken'].clearValidators();
      this.editForm.controls['actionTaken'].updateValueAndValidity();
    }
  }

  typeDropdown(event) {

    if (event != undefined && event.key == "TOPUP") {
      this.topupSelected = true;
      this.bundleSelected = false;

      this.editForm.controls['amount'].reset();
      this.editForm.controls['amount'].setValidators(Validators.required);
      this.editForm.controls['amount'].updateValueAndValidity();
      this.editForm.controls['bundle'].setValidators(null);
      this.editForm.controls['bundle'].updateValueAndValidity();
    }
    else if (event != undefined && event.key == "PREPAID_BUNDLE") {
      this.bundleSelected = true;
      this.topupSelected = false;
      this.editForm.controls['bundle'].reset();
      this.editForm.controls['amount'].setValidators(null);
      this.editForm.controls['amount'].updateValueAndValidity();
      this.editForm.controls['bundle'].setValidators(Validators.required);
      this.editForm.controls['bundle'].updateValueAndValidity();
    }

  }


  previewImage(type) {
    if (type == 'add') {
      const oFReader = new FileReader();
      oFReader.onload = (e: any) => {
        let image = document.querySelector("#previewPromo") as HTMLImageElement;
        image.src = oFReader.result as string;
      };
    } else {
      const oFReader = new FileReader();
      oFReader.readAsDataURL(new Blob([this.editForm.controls.image.value]));
      oFReader.onload = (e: any) => {
        let image = document.querySelector("#editPreviewPromo") as HTMLImageElement;
        image.src = oFReader.result as string;
      }
    }
  }

  getToggleValue(event, value, idToggle) {
    this.toggleDataId = idToggle;
    this.editId = idToggle;
    this.editForm.controls.name.setValue(value.name);
    this.editForm.controls.image.setValue(this.promoUrl + value.imageUrl);
    if (/^((http|https|ftp):\/\/)/.test(this.editForm.controls.image.value))
      this.reverseImage(this.editForm.controls.image.value);
    if (event.target.checked) {
      this.isToggleActive = true;
      this.toggleMessage = "Are you sure you want to activate this promo offer?";
      this.modalService.open(this.toggleConfirmationModal, { backdrop: 'static', keyboard: false });
    } else if (!event.target.checked) {
      this.isToggleActive = false;
      this.toggleMessage = "Are you sure you want to deactivate this promo offer?";
      this.modalService.open(this.toggleConfirmationModal, { backdrop: 'static', keyboard: false });
    }
  }

  setToggleVal() {
    this.modalService.dismissAll();
    this.submitted = false;
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

  backEdit() {
    this.modalService.dismissAll();
    this.modalService.open(this.editPromoModel);
    this.previewImage('edit');
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
