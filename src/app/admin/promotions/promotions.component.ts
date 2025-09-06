import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonService } from '../../../services/commonService';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { initOffset } from 'ngx-bootstrap/chronos/units/offset';
import { InputOutputPropertySet } from '@angular/compiler';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.css']
})
export class PromotionsComponent implements OnInit {
  @ViewChild('responseModel') responseModel: TemplateRef<any>;
  @ViewChild('addPromoModel') addPromoModel: TemplateRef<any>;
  @ViewChild('editPromoModel') editPromoModel: TemplateRef<any>;
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
  isMeridian = false;
  showSpinners = true;
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
    // subject: new FormControl('', Validators.required),
    // body: new FormControl('', Validators.required),
    image: new FormControl('', Validators.required)
  });
  editForm = new FormGroup({
    name: new FormControl('', Validators.required),
    link: new FormControl(''),
    time: new FormControl(false),
    dateFrom: new FormControl(),
    dateTo: new FormControl(),
    // subject: new FormControl('', Validators.required),
    // body: new FormControl('', Validators.required),
    image: new FormControl('', Validators.required)
  });
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
  imageEdit: any;
  toggleMessage: any;
  isToggleActive: any;
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
    let access = JSON.parse(localStorage.getItem('acl'));
    access.forEach((element) => {
      if (element.key == 'PROMOTIONS') {
        this.editUserAccess = element.access.edit;
        this.createUserAccess = element.access.create;
        this.deleteUserAccess = element.access.delete;
      }
    })
    this.search(1);
    this.promoUrl = environment.baseApiUrl;
  }

  search(page) {

    document.getElementById('loader')!.style.display = 'block';
    this.commonService.getPromotionBanners(page).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.bannerList = res.result.data;
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
          this.uploadForm.controls.image.setValue(file);
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
    if(this.uploadForm.controls.link.value != null ){
     promo.link=this.uploadForm.controls.link.value
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
        this.submitted = false;
        this.search(1);
        this.modalService.open(this.successModel);
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

  deleteId: any;
  editId: any;
  deletebanner(id) {
    this.deleteId = id;
    this.modalService.open(this.deleteconfirmationModal, { windowClass: 'error-modal' });
  }



  editbanner(data, id) {
   
    this.editForm.controls.image.setValue(this.promoUrl + data.imageUrl);
    this.editArray.push({
      "data": data,
      "id": id
    })
    this.router.navigate(['/admin/edit-promotions'], { queryParams: { data: JSON.stringify(this.editArray) }, skipLocationChange: true });
  }


  editPromoDetails() {

    this.submitted = true;
    if (!this.editForm.valid) {
      return
    }
    this.modalService.dismissAll();
    if (/^((http|https|ftp):\/\/)/.test(this.editForm.controls.image.value))
      this.reverseImage(this.editForm.controls.image.value);

    this.modalService.open(this.editconfirmationModal, { backdrop: 'static', keyboard: false });
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


  confirmDelete() {
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.deletePromotionBanner(this.deleteId).subscribe(res => {
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
    this.editForm.controls.dateFrom.setValue(this.changeDateFormat(this.editForm.controls.dateFrom.value) + ' ' + this.exactTime(this.editForm.controls.dateFrom.value));
    this.editForm.controls.dateTo.setValue(this.changeDateFormat(this.editForm.controls.dateTo.value) + ' ' + this.exactTime(this.editForm.controls.dateTo.value));
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
        this.successMessage = res.message;
        this.modalService.open(this.successModel);
        this.editForm.reset();
        this.submitted = false;
        this.search(1);
      } else {
        this.modalService.dismissAll();
        this.errorMessage = res.message;
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
        this.search(1);
      }
    }, error => {
      document.getElementById('loader').style.display = 'none';
      this.errorMessage = "There is a problem processing your request. Please try again after some time.";
      this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
    });
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
  back() {
    this.modalService.dismissAll();
    this.modalService.open(this.addPromoModel);
    this.previewImage('add');
  }

  previewImage(type) {
    if (type == 'add') {
      const oFReader = new FileReader();
      oFReader.readAsDataURL(new Blob([this.uploadForm.controls.image.value]));
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
