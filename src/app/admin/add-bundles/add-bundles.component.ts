import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonService } from '../../../services/commonService';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-bundles',
  templateUrl: './add-bundles.component.html',
  styleUrls: ['./add-bundles.component.css']
})
export class AddBundlesComponent implements OnInit {
  @ViewChild('responseModel') responseModel: TemplateRef<any>;
  @ViewChild('confirmationModal') confirmationModal: TemplateRef<any>;
  @ViewChild('successModel') successModel: TemplateRef<any>;
  @ViewChild('updateModel') updateModel: TemplateRef<any>;

  isMeridian = false;
  showSpinners = true;
  myTime: Date = new Date();
  newContactArray = new FormArray([]);
  emailArray = new FormArray([]);
  customerAccountType = [];
  enableBundleAddOnFlow = false;
  constructor(private router: Router, private route: ActivatedRoute, private commonService: CommonService, private modalService: NgbModal) { }

  uploadForm = new FormGroup({
    accountType: new FormControl('', Validators.required),
    amount: new FormControl('', Validators.required),
    anywhereMinutes: new FormControl('', Validators.required),
    bundleIdentifier: new FormControl('', Validators.required),
    bundleType: new FormControl('', Validators.required),
    dataBalance: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    roamingDataBalance: new FormControl(''),
    smsBalance: new FormControl('', Validators.required),
    totalAmount: new FormControl('', Validators.required),
    vat: new FormControl('', Validators.required),
    voiceBalance: new FormControl('', Validators.required),
    isActive: new FormControl(false),
    isUnlimited: new FormControl(false),
    isAddOn: new FormControl(false),
    confirmationDescription: new FormControl('', Validators.required),
    rolloveranywhereMinutes: new FormControl('Unused Anywhere minutes will Rollover- valid 30 days'),
    roleoverdata: new FormControl('Unused Any use Data will Rollover up to 75GB'),
    freebdata: new FormControl('FREE Scorch Radio, Youtube, Netflix'),
    freeDataOnWeekend: new FormControl(''),
    roamingDestinations: new FormControl(''),
    bundleDescription: new FormControl(''),
  });

  resDateArray = new Map();
  forMinute: any;
  dropdownSettings = {
    singleSelection: false,
    text: "Select",
    value: null,
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    classes: "form-control multiselect-form-control minimal",
    enableSearchFilter: true,
    searchAutofocus: true,
    searchPlaceholderText: "Search",
    badgeShowLimit: 1
  }
  submitted = false;
  successMessage: any;
  errorMessage: any;
  editId: any;
  bannerList: any;
  bundleTypeArray: any = [];
  ngOnInit() {


    let body = { "lookups": ["bundleType", "consumerAccountType", "enableBundleAddOnFlow"] };
    document.getElementById('loader').style.display = 'block';
    this.commonService.getLookups(body).subscribe(res => {
      document.getElementById('loader').style.display = 'none';
      if (res.success == true) {
        this.bundleTypeArray = res.result.bundleType;
        this.customerAccountType = res.result.consumerAccountType;
        this.enableBundleAddOnFlow = res.result.enableBundleAddOnFlow;
      } else {
        this.bundleTypeArray = [];
        this.customerAccountType = [];
      }
    });




    for (let i = 0; i < this.newContactArray.length; i++) {
      this.newContactArray.removeAt(i);
    }

    for (let i = 0; i < this.emailArray.length; i++) {
      this.emailArray.removeAt(i);
    }
  }
  letterOnly(event) {
    var charCode = event.keyCode;

    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8)

      return true;
    else
      return false;
  }

  locationindex = [];
  onDeSelect(item: any) {
    this.locationindex.forEach(element => {
      const index = this.locationindex.indexOf(item.id);
      if (index > -1) {
        this.locationindex.splice(index, 1);
      }
    })
  }

  confirmEditBundles() {
    this.submitted = true;
    if (!this.uploadForm.valid) {
      return;
    }
    this.modalService.open(this.confirmationModal, { backdrop: 'static', keyboard: false });
  }

  addNewContact() {

    if (this.newContactArray.length < 5) {
      const newContactForm = new FormGroup({
        phone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(12)]),
      })
      this.newContactArray.push(newContactForm)
      this.newContactArray.markAsUntouched();
      this.newContactArray.updateValueAndValidity()
    }
    else { return }
  }

  removeNewContact(index) {
    this.newContactArray.removeAt(index);
  }

  removeEmail(index) {
    this.emailArray.removeAt(index);
  }



  exactTime(value) {
    if (value) {
      this.forMinute = value.getMinutes();
      if (value.getMinutes() < 10) {

        this.forMinute = "0" + this.forMinute
      }
      var newvalue = this.addZero(value.getHours()) + ":" + this.forMinute;
      value = new Date();
      return newvalue;
    }
    return "";
  }

  addZero(i) {
    if (i < 10) { i = "0" + i }
    return i;
  }
  editBundles() {
    this.submitted = true;
    if (!this.uploadForm.valid) {
      return;
    }

    let body = {
      "accountType": this.uploadForm.controls.accountType.value,
      "amount": this.uploadForm.controls.amount.value,
      "anywhereMinutes": this.uploadForm.controls.anywhereMinutes.value,
      "bundleIdentifier": this.uploadForm.controls.bundleIdentifier.value,
      "bundleType": this.uploadForm.controls.bundleType.value,
      "dataBalance": this.uploadForm.controls.dataBalance.value,
      "name": this.uploadForm.controls.name.value,
      "roamingDataBalance": this.uploadForm.controls.roamingDataBalance.value,
      "smsBalance": this.uploadForm.controls.smsBalance.value,
      "totalAmount": this.uploadForm.controls.totalAmount.value,
      "vat": this.uploadForm.controls.vat.value,
      "voiceBalance": this.uploadForm.controls.voiceBalance.value,
      'isActive': this.uploadForm.controls.isActive.value,
      "isUnlimited": this.uploadForm.controls.isUnlimited.value,
      "isAddOn": this.uploadForm.controls.isAddOn.value,
      "confirmationDescription": this.uploadForm.controls.confirmationDescription.value,
      "bundleDescription": this.uploadForm.controls.bundleDescription.value,
      "data": {
        "rollOverAnywhereMins": this.uploadForm.controls.rolloveranywhereMinutes.value,
        "rollOverData": this.uploadForm.controls.roleoverdata.value,
        "freebData": this.uploadForm.controls.freebdata.value,
        "freeDataOnWeekend": this.uploadForm.controls.freeDataOnWeekend.value,
        "roamingDestinations": this.uploadForm.controls.roamingDestinations.value,
      }
    }

    document.getElementById('loader')!.style.display = 'block';
    this.commonService.addBundle(body).subscribe(res => {
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

  getToggleValue(item) {
    this.uploadForm.get(item.target.defaultValue).setValue(item.target.checked);
  }

  closeModal() {
    this.modalService.dismissAll();
    this.submitted = false;


  }

  spaceRestrict(event: any) {
    if (event.target.selectionStart == 0 && event.code == 'Space')
      event.preventDefault();
  }

  goBack() {
    this.router.navigateByUrl('/admin/bundles');
  }
  back() {
    this.modalService.dismissAll();
  }

  close() {
    this.modalService.dismissAll();
    this.router.navigateByUrl('/admin/bundles');

  }

}
