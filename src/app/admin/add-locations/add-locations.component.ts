import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonService } from '../../../services/commonService';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-locations',
  templateUrl: './add-locations.component.html',
  styleUrls: ['./add-locations.component.css']
})
export class AddLocationsComponent implements OnInit {
  @ViewChild('responseModel') responseModel: TemplateRef<any>;
  @ViewChild('confirmationModal') confirmationModal: TemplateRef<any>;
  @ViewChild('successModel') successModel: TemplateRef<any>;

  isMeridian = false;
  showSpinners = true;
  myTime: Date = new Date();

  constructor(private commonService: CommonService, private router: Router, private modalService: NgbModal, private fb: FormBuilder) { }
  newContactArray = new FormArray([]);
  emailArray = new FormArray([]);
  uploadForm = new FormGroup({
    title: new FormControl('', Validators.required),
    street: new FormControl('', Validators.required),
    lat: new FormControl('', Validators.required),
    lng: new FormControl('', Validators.required),
    // phone: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    region: new FormControl('', Validators.required),
    cpl: new FormControl('', Validators.required),
    // daysStr: new FormControl('', Validators.required),
    // email: new FormControl('', Validators.required),
    MON: new FormControl(false),
    TUE: new FormControl(false),
    WED: new FormControl(false),
    THU: new FormControl(false),
    FRI: new FormControl(false),
    SAT: new FormControl(false),
    SUN: new FormControl(false),
    monOpen: new FormControl(''),
    monClose: new FormControl(''),
    tueOpen: new FormControl(''),
    tueClose: new FormControl(''),
    wedOpen: new FormControl(''),
    wedClose: new FormControl(''),
    thuOpen: new FormControl(''),
    thuClose: new FormControl(''),
    friOpen: new FormControl(''),
    friClose: new FormControl(''),
    satOpen: new FormControl(''),
    satClose: new FormControl(''),
    sunOpen: new FormControl(''),
    sunClose: new FormControl(''),
  });

  resDateArray = new Map();
  forMinute: any;
  form: FormGroup;
  submitted = false;
  successMessage: any;
  rolesList: [];
  errorMessage: any;
  personData: any = [];
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
  ownersList = [];
  ownersDropdownList = [];
  finalTimeArray = [];
  ngOnInit() {
    for (let i = 0; i < this.newContactArray.length; i++) {
      this.newContactArray.removeAt(i);
    }
    if (this.newContactArray.length < 1) {
      this.addNewContact();
    }

    for (let i = 0; i < this.emailArray.length; i++) {
      this.emailArray.removeAt(i);
    }
    if (this.emailArray.length < 1) {
      this.addEmail();
    }
  }


  letterOnly(event) 
  {
              var charCode = event.keyCode;
  
              if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8)
  
                  return true;
              else
                  return false;
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
    if (i < 10) {i = "0" + i}
    return i;
  }



  addPromoDetails() {
    this.submitted = true;
    if (!this.uploadForm.valid) {
      return;
    }
    if (!this.newContactArray.valid) {
      return;
    }
    if (!this.emailArray.valid) {
      return;
    }
    if (this.uploadForm.controls.MON.value==false && this.uploadForm.controls.TUE.value==false && this.uploadForm.controls.WED.value==false && this.uploadForm.controls.THU.value==false && this.uploadForm.controls.FRI.value==false && this.uploadForm.controls.SAT.value==false  && this.uploadForm.controls.SUN.value==false) {
     this.errorMessage='Please Select Opening and Closing Hours';
     this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      return;
    }
    if (this.uploadForm.controls.MON.value ) {
    if(this.uploadForm.controls.monOpen.value == '' || this.uploadForm.controls.monClose.value == '' )
    {
      if(this.uploadForm.controls.monOpen.value == '' && this.uploadForm.controls.monClose.value == '' )
      {
        this.errorMessage='Please select Opening And Closing Hours of Monday';
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
        return;
      }
      if(this.uploadForm.controls.monOpen.value == '')
      {
        this.errorMessage='Please select Opening Hours of Monday';
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
      else {
        this.errorMessage='Please select Closing Hours of Monday';
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
     
      return;
    }
  }
  if (this.uploadForm.controls.TUE.value ) {
    if(this.uploadForm.controls.tueOpen.value == '' || this.uploadForm.controls.tueClose.value == '' )
    {
      if(this.uploadForm.controls.tueOpen.value == '' && this.uploadForm.controls.tueClose.value == '' )
      {
        this.errorMessage='Please select Opening And Closing Hours of Tuesday';
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
        return;
      }
      if(this.uploadForm.controls.tueOpen.value == '')
      {
        this.errorMessage='Please select Opening Hours of Tuesday';
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
      else {
        this.errorMessage='Please select Closing Hours of Tuesday';
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
      return;
    }
  }
  if (this.uploadForm.controls.WED.value ) {
    if(this.uploadForm.controls.wedOpen.value == '' || this.uploadForm.controls.wedClose.value == '' )
    {
      if(this.uploadForm.controls.wedOpen.value == '' && this.uploadForm.controls.wedClose.value == '' )
      {
        this.errorMessage='Please select Opening And Closing Hours of Wednesday';
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
        return;
      }
      if(this.uploadForm.controls.wedOpen.value == '')
      {
        this.errorMessage='Please select Opening Hours of Wednesday';
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
      else {
        this.errorMessage='Please select Closing Hours of Wednesday';
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
      return;
    }
  }
  if (this.uploadForm.controls.THU.value ) {
    if(this.uploadForm.controls.thuOpen.value == '' || this.uploadForm.controls.thuClose.value == '' )
    {
      if(this.uploadForm.controls.thuOpen.value == '' && this.uploadForm.controls.thuClose.value == '' )
      {
        this.errorMessage='Please select Opening And Closing Hours of thursday';
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
        return;
      }
      if(this.uploadForm.controls.thuOpen.value == '')
      {
        this.errorMessage='Please select Opening Hours of thursday';
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
      else {
        this.errorMessage='Please select Closing Hours of thursday';
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
      return;
    }
  }
  if (this.uploadForm.controls.FRI.value ) {
    if(this.uploadForm.controls.friOpen.value == '' || this.uploadForm.controls.friClose.value == '' )
    {
      if(this.uploadForm.controls.friOpen.value == '' && this.uploadForm.controls.friClose.value == '' )
      {
        this.errorMessage='Please select Opening And Closing Hours of Friday';
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
        return;
      }
      if(this.uploadForm.controls.friOpen.value == '')
      {
        this.errorMessage='Please select Opening Hours of Friday';
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
      else {
        this.errorMessage='Please select Closing Hours of Friday';
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
      return;
    }
  }
  if (this.uploadForm.controls.SAT.value ) {
    if(this.uploadForm.controls.satOpen.value == '' || this.uploadForm.controls.satClose.value == '' )
    {
      if(this.uploadForm.controls.satOpen.value == '' && this.uploadForm.controls.satClose.value == '' )
      {
        this.errorMessage='Please select Opening And Closing Hours of Saturday';
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
        return;
      }
      if(this.uploadForm.controls.satOpen.value == '')
      {
        this.errorMessage='Please select Opening Hours of Saturday';
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
      else {
        this.errorMessage='Please select Closing Hours of Saturday';
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
      return;
    }
  }
  if (this.uploadForm.controls.SUN.value ) {
    if(this.uploadForm.controls.sunOpen.value == '' || this.uploadForm.controls.sunClose.value == '' )
    {
      if(this.uploadForm.controls.sunOpen.value == '' && this.uploadForm.controls.sunClose.value == '' )
      {
        this.errorMessage='Please select Opening And Closing Hours of Sunday';
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
        return;
      }
      if(this.uploadForm.controls.sunOpen.value == '')
      {
        this.errorMessage='Please select Opening Hours of Sunday';
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
      else {
        this.errorMessage='Please select Closing Hours of Sunday';
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
      return;
    }
  }

    this.modalService.open(this.confirmationModal, { backdrop: 'static', keyboard: false });
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


  addEmail() {

    if (this.emailArray.length < 5) {
      const emailForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.pattern("^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      })
      this.emailArray.push(emailForm);
      this.emailArray.markAsUntouched();
      this.emailArray.updateValueAndValidity();
    }
    else { return }
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

  confirmUpload() {
    this.uploadForm.controls.monOpen.setValue(this.exactTime(this.uploadForm.controls.monOpen.value));
    this.uploadForm.controls.monClose.setValue(this.exactTime(this.uploadForm.controls.monClose.value));
    this.uploadForm.controls.tueOpen.setValue(this.exactTime(this.uploadForm.controls.tueOpen.value));
    this.uploadForm.controls.tueClose.setValue(this.exactTime(this.uploadForm.controls.tueClose.value));
    this.uploadForm.controls.wedOpen.setValue(this.exactTime(this.uploadForm.controls.wedOpen.value));
    this.uploadForm.controls.wedClose.setValue(this.exactTime(this.uploadForm.controls.wedClose.value));
    this.uploadForm.controls.thuOpen.setValue(this.exactTime(this.uploadForm.controls.thuOpen.value));
    this.uploadForm.controls.thuClose.setValue(this.exactTime(this.uploadForm.controls.thuClose.value));
    this.uploadForm.controls.friOpen.setValue(this.exactTime(this.uploadForm.controls.friOpen.value));
    this.uploadForm.controls.friClose.setValue(this.exactTime(this.uploadForm.controls.friClose.value));
    this.uploadForm.controls.satOpen.setValue(this.exactTime(this.uploadForm.controls.satOpen.value));
    this.uploadForm.controls.satClose.setValue(this.exactTime(this.uploadForm.controls.satClose.value));
    this.uploadForm.controls.sunOpen.setValue(this.exactTime(this.uploadForm.controls.sunOpen.value));
    this.uploadForm.controls.sunClose.setValue(this.exactTime(this.uploadForm.controls.sunClose.value));

    if (this.uploadForm.controls.MON.value == true) {
      this.resDateArray.set("MON", {
        "openingHours": this.uploadForm.controls.monOpen.value,
        "closingHours": this.uploadForm.controls.monClose.value
      })
    }
    else {
      this.resDateArray.set("MON", false);
    }
    if (this.uploadForm.controls.TUE.value == true) {
      this.resDateArray.set("TUE", {
        "openingHours": this.uploadForm.controls.tueOpen.value,
        "closingHours": this.uploadForm.controls.tueClose.value
      })
    } else {
      this.resDateArray.set("TUE", false)
    }
    if (this.uploadForm.controls.WED.value == true) {
      this.resDateArray.set("WED", {
        "openingHours": this.uploadForm.controls.wedOpen.value,
        "closingHours": this.uploadForm.controls.wedClose.value
      })
    } else {
      this.resDateArray.set("WED", false)
    } if (this.uploadForm.controls.THU.value == true) {
      this.resDateArray.set("THU", {
        "openingHours": this.uploadForm.controls.thuOpen.value,
        "closingHours": this.uploadForm.controls.thuClose.value
      })
    } else {
      this.resDateArray.set("THU", false)
    } if (this.uploadForm.controls.FRI.value == true) {
      this.resDateArray.set("FRI", {
        "openingHours": this.uploadForm.controls.friOpen.value,
        "closingHours": this.uploadForm.controls.friClose.value
      })
    } else {
      this.resDateArray.set("FRI", false)
    } if (this.uploadForm.controls.SAT.value == true) {
      this.resDateArray.set("SAT", {
        "openingHours": this.uploadForm.controls.satOpen.value,
        "closingHours": this.uploadForm.controls.satClose.value
      })
    } else {
      this.resDateArray.set("SAT", false)
    }
    if (this.uploadForm.controls.SUN.value == true) {
      this.resDateArray.set("SUN", {
        "openingHours": this.uploadForm.controls.sunOpen.value,
        "closingHours": this.uploadForm.controls.sunClose.value
      })
    } else {
      this.resDateArray.set("SUN", false)
    }
    let tempArray = []
    this.newContactArray.value.forEach(element => {
      tempArray.push(element.phone)
    });

    let emailTempArray = []
    this.emailArray.value.forEach(element => {
      emailTempArray.push(element.email)
    });
    let arr = {
      "MON": this.resDateArray.get("MON"),
      "TUE": this.resDateArray.get("TUE"),
      "WED": this.resDateArray.get("WED"),
      "THU": this.resDateArray.get("THU"),
      "FRI": this.resDateArray.get("FRI"),
      "SAT": this.resDateArray.get("SAT"),
      "SUN": this.resDateArray.get("SUN"),
    }
    let body = {
      "title": this.uploadForm.controls.title.value,
      "street": this.uploadForm.controls.street.value,
      "lat": this.uploadForm.controls.lat.value,
      "lng": this.uploadForm.controls.lng.value,
      "phone": tempArray,
      "email": emailTempArray,
      "city": this.uploadForm.controls.city.value,
      "region": this.uploadForm.controls.region.value,
      "cpl": this.uploadForm.controls.cpl.value,
      "openHours": arr
    }

    document.getElementById('loader')!.style.display = 'block';
    this.commonService.addLocations(body).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.modalService.dismissAll();
        this.successMessage = res.message;
        this.uploadForm.reset();
        this.submitted = false;
        this.modalService.open(this.successModel);
      } else {
        this.modalService.dismissAll();
        this.uploadForm.controls.monOpen.reset()
        this.uploadForm.controls.monClose.reset();
        this.uploadForm.controls.tueOpen.reset()
        this.uploadForm.controls.tueClose.reset();
        this.uploadForm.controls.wedOpen.reset()
        this.uploadForm.controls.wedClose.reset();
        this.uploadForm.controls.thuOpen.reset()
        this.uploadForm.controls.thuClose.reset();
        this.uploadForm.controls.friOpen.reset()
        this.uploadForm.controls.friClose.reset();
        this.uploadForm.controls.satOpen.reset()
        this.uploadForm.controls.satClose.reset();
        this.errorMessage = res.message;
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
    }, error => {
      document.getElementById('loader').style.display = 'none';
      this.errorMessage = "There is a problem processing your request. Please try again after some time.";
      this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
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

  goBack() {
    this.router.navigateByUrl('/admin/locations');
  }

  close() {
    this.modalService.dismissAll();
    this.router.navigateByUrl('/admin/locations');
  }
  back() {
    this.modalService.dismissAll();
  }
}
