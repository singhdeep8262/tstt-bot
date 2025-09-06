import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonService } from '../../../services/commonService';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-locations',
  templateUrl: './edit-locations.component.html',
  styleUrls: ['./edit-locations.component.css']
})
export class EditLocationsComponent implements OnInit {
  @ViewChild('responseModel') responseModel: TemplateRef<any>;
  @ViewChild('confirmationModal') confirmationModal: TemplateRef<any>;
  @ViewChild('successModel') successModel: TemplateRef<any>;
  isMeridian = false;
  showSpinners = true;
  myTime: Date = new Date();
  newContactArray = new FormArray([]);
  emailArray = new FormArray([]);
  constructor(private router: Router, private route: ActivatedRoute, private commonService: CommonService, private modalService: NgbModal) { }

  uploadForm = new FormGroup({

    title: new FormControl('', Validators.required),
    street: new FormControl('', Validators.required),
    lat: new FormControl('', Validators.required),
    lng: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    region: new FormControl('', Validators.required),
    cpl: new FormControl('', Validators.required),
    MON: new FormControl(false),
    TUE: new FormControl(false),
    WED: new FormControl(false),
    THU: new FormControl(false),
    FRI: new FormControl(false),
    SAT: new FormControl(false),
    SUN: new FormControl(false),
    monOpen: new FormControl(),
    monClose: new FormControl(),
    tueOpen: new FormControl(),
    tueClose: new FormControl(),
    wedOpen: new FormControl(),
    wedClose: new FormControl(),
    thuOpen: new FormControl(),
    thuClose: new FormControl(),
    friOpen: new FormControl(),
    friClose: new FormControl(),
    satOpen: new FormControl(),
    satClose: new FormControl(),
    sunOpen: new FormControl(),
    sunClose: new FormControl(),
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
  editTimeMON = true;
  editTimeTUE = true;
  editTimeWED = true;
  editTimeTHU = true;
  editTimeFRI = true;
  editTimeSAT = true;
  editTimeSUN = true;
  submitted = false;
  successMessage: any;
  errorMessage: any;
  editId: any;
  bannerList: any;
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      let response = JSON.parse(params['data']);
      if (response) {
        this.editId = response;
        document.getElementById('loader')!.style.display = 'block';
        this.commonService.getEditLocations(response).subscribe(res => {
          document.getElementById('loader')!.style.display = 'none';
          if (res.success == true) {
            this.bannerList = res.result.data;
            this.uploadForm.get('title').setValue(this.bannerList.title);
            this.uploadForm.get('street').setValue(this.bannerList.street);
            this.uploadForm.get('lat').setValue(this.bannerList.lat);
            this.uploadForm.get('lng').setValue(this.bannerList.lng);
            this.uploadForm.get('city').setValue(this.bannerList.city);
            this.uploadForm.get('region').setValue(this.bannerList.region);
            this.uploadForm.get('cpl').setValue(this.bannerList.cpl);
            if (this.bannerList.openHours.MON != false) {
              this.uploadForm.get('MON').setValue(true);
            }
            if (this.bannerList.openHours.TUE != false) {
              this.uploadForm.get('TUE').setValue(true);
            }
            if (this.bannerList.openHours.WED != false) {
              this.uploadForm.get('WED').setValue(true);
            }
            if (this.bannerList.openHours.THU != false) {
              this.uploadForm.get('THU').setValue(true);
            }
            if (this.bannerList.openHours.FRI != false) {
              this.uploadForm.get('FRI').setValue(true);
            }
            if (this.bannerList.openHours.SAT != false) {
              this.uploadForm.get('SAT').setValue(true);
            }
            if (this.bannerList.openHours.SUN != false) {
              this.uploadForm.get('SUN').setValue(true);
            }
            Object.keys(this.bannerList.openHours).forEach(key => {
              let openhours= new Date(`2015-03-25T${this.bannerList.openHours[key].openingHours}`);
              let closehours= new Date(`2015-03-25T${this.bannerList.openHours[key].closingHours}`);

              if(this.bannerList.openHours[key] != false && key=='MON' && this.bannerList.openHours != 'undefined' && this.bannerList.closeHours != 'undefined')
              {
                  this.uploadForm.get('monOpen').setValue(openhours);
                  this.uploadForm.get('monClose').setValue(closehours);
              }
              if(this.bannerList.openHours[key] != false && key=='TUE' && this.bannerList.openHours != 'undefined' && this.bannerList.closeHours != 'undefined')
              {
                this.uploadForm.get('tueOpen').setValue(openhours);
                this.uploadForm.get('tueClose').setValue(closehours);
              }
              if(this.bannerList.openHours[key] != false && key=='WED' && this.bannerList.openHours != 'undefined' && this.bannerList.closeHours != 'undefined')
              {
                this.uploadForm.get('wedOpen').setValue(openhours);
                this.uploadForm.get('wedClose').setValue(closehours);
              }
              if(this.bannerList.openHours[key] != false && key=='THU' && this.bannerList.openHours != 'undefined' && this.bannerList.closeHours != 'undefined')
              {
                this.uploadForm.get('thuOpen').setValue(openhours);
                this.uploadForm.get('thuClose').setValue(closehours);
              }
              if(this.bannerList.openHours[key] != false && key=='FRI' && this.bannerList.openHours != 'undefined' && this.bannerList.closeHours != 'undefined')
              {
                this.uploadForm.get('friOpen').setValue(openhours);
                this.uploadForm.get('friClose').setValue(closehours);
              }
              if(this.bannerList.openHours[key] != false && key=='SAT' && this.bannerList.openHours != 'undefined' && this.bannerList.closeHours != 'undefined')
              {
                this.uploadForm.get('satOpen').setValue(openhours);
                this.uploadForm.get('satClose').setValue(closehours);
              }
              if(this.bannerList.openHours[key] != false && key=='SUN' && this.bannerList.openHours != 'undefined' && this.bannerList.closeHours != 'undefined')
              {
                this.uploadForm.get('sunOpen').setValue(openhours);
                this.uploadForm.get('sunClose').setValue(closehours);
              }

            });
            this.bannerList.phone.forEach(data => {
              let contactForm = new FormGroup({
                phone: new FormControl(data, [Validators.required, Validators.minLength(10), Validators.maxLength(12)]),
              })
              this.newContactArray.push(contactForm)
            });
            this.bannerList.email.forEach(data => {
              let emailForm = new FormGroup({
                email: new FormControl(data, [Validators.required, Validators.minLength(10), Validators.maxLength(30)]),
              })
              this.emailArray.push(emailForm)
            });
          }
          else {
            this.modalService.dismissAll();
            this.errorMessage = res.message;
            this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
          }
        }, error => {
          this.modalService.dismissAll();
          document.getElementById('loader').style.display = 'none';
          this.errorMessage = "There is a problem processing your request. Please try again after some time.";
          this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
        });
      }
    });


    for (let i = 0; i < this.newContactArray.length; i++) {
      this.newContactArray.removeAt(i);
    }

    for (let i = 0; i < this.emailArray.length; i++) {
      this.emailArray.removeAt(i);
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
  editDays(value) {
    if (value == 'MON') {
      if (this.uploadForm.controls.MON.value == false) {
        this.uploadForm.get('MON').setValue(true);
        this.editTimeMON = !this.editTimeMON;

      }

      else if (this.uploadForm.controls.MON.value == true && this.editTimeMON == true) {
        this.uploadForm.get('MON').setValue(true);
        this.editTimeMON = !this.editTimeMON;

      }

      else if (this.uploadForm.controls.MON.value == true && this.editTimeMON == false && this.bannerList.openHours.MON != false) {

        this.uploadForm.get('MON').setValue(true);
        this.editTimeMON = !this.editTimeMON;

      }


      else if (this.uploadForm.controls.MON.value == true && this.editTimeMON == false && this.bannerList.openHours.MON == false) {
        this.uploadForm.get('MON').setValue(false);
        this.editTimeMON = !this.editTimeMON;

      }
    }

    if (value == 'TUE') {
      if (this.uploadForm.controls.TUE.value == false) {
        this.uploadForm.get('TUE').setValue(true);
        this.editTimeTUE = !this.editTimeTUE;

      }
      else if (this.uploadForm.controls.TUE.value == true && this.editTimeTUE == true) {
        this.uploadForm.get('TUE').setValue(true);
        this.editTimeTUE = !this.editTimeTUE;

      }

      else if (this.uploadForm.controls.TUE.value == true && this.editTimeTUE == false && this.bannerList.openHours.TUE != false) {

        this.uploadForm.get('TUE').setValue(true);
        this.editTimeTUE = !this.editTimeTUE;

      }


      else if (this.uploadForm.controls.TUE.value == true && this.editTimeTUE == false && this.bannerList.openHours.TUE == false) {
        this.uploadForm.get('TUE').setValue(false);
        this.editTimeTUE = !this.editTimeTUE;

      }
    }

    if (value == 'WED') {

      if (this.uploadForm.controls.WED.value == false) {
        this.uploadForm.get('WED').setValue(true);
        this.editTimeWED = !this.editTimeWED;

      }

      else if (this.uploadForm.controls.WED.value == true && this.editTimeWED == true) {
        this.uploadForm.get('WED').setValue(true);
        this.editTimeWED = !this.editTimeWED;

      }

      else if (this.uploadForm.controls.WED.value == true && this.editTimeWED == false && this.bannerList.openHours.WED != false) {

        this.uploadForm.get('WED').setValue(true);
        this.editTimeWED = !this.editTimeWED;

      }

      else if (this.uploadForm.controls.WED.value == true && this.editTimeWED == false && this.bannerList.openHours.WED == false) {

        this.uploadForm.get('WED').setValue(false);
        this.editTimeWED = !this.editTimeWED;

      }
    }

    if (value == 'THU') {
      if (this.uploadForm.controls.THU.value == false) {
        this.uploadForm.get('THU').setValue(true);
        this.editTimeTHU = !this.editTimeTHU;

      }

      else if (this.uploadForm.controls.THU.value == true && this.editTimeTHU == true) {
        this.uploadForm.get('THU').setValue(true);
        this.editTimeTHU = !this.editTimeTHU;

      }

      else if (this.uploadForm.controls.THU.value == true && this.editTimeTHU == false && this.bannerList.openHours.THU != false) {

        this.uploadForm.get('THU').setValue(true);
        this.editTimeTHU = !this.editTimeTHU;

      }


      else if (this.uploadForm.controls.THU.value == true && this.editTimeTHU == false && this.bannerList.openHours.THU == false) {
        this.uploadForm.get('THU').setValue(false);
        this.editTimeTHU = !this.editTimeTHU;

      }
    }

    if (value == 'FRI') {
      if (this.uploadForm.controls.FRI.value == false) {
        this.uploadForm.get('FRI').setValue(true);
        this.editTimeFRI = !this.editTimeFRI;
      }

      else if (this.uploadForm.controls.FRI.value == true && this.editTimeFRI == true) {
        this.uploadForm.get('FRI').setValue(true);
        this.editTimeFRI = !this.editTimeFRI;

      }

      else if (this.uploadForm.controls.FRI.value == true && this.editTimeFRI == false && this.bannerList.openHours.FRI != false) {

        this.uploadForm.get('FRI').setValue(true);
        this.editTimeFRI = !this.editTimeFRI;

      }


      else if (this.uploadForm.controls.FRI.value == true && this.editTimeFRI == false && this.bannerList.openHours.FRI == false) {
        this.uploadForm.get('FRI').setValue(false);
        this.editTimeFRI = !this.editTimeFRI;

      }
    }

    if (value == 'SAT') {
      if (this.uploadForm.controls.SAT.value == false) {
        this.uploadForm.get('SAT').setValue(true);
        this.editTimeSAT = !this.editTimeSAT;
      }

      else if (this.uploadForm.controls.SAT.value == true && this.editTimeSAT == true) {
        this.uploadForm.get('SAT').setValue(true);
        this.editTimeSAT = !this.editTimeSAT;

      }

      else if (this.uploadForm.controls.SAT.value == true && this.editTimeSAT == false && this.bannerList.openHours.SAT != false) {

        this.uploadForm.get('SAT').setValue(true);
        this.editTimeSAT = !this.editTimeSAT;

      }


      else if (this.uploadForm.controls.SAT.value == true && this.editTimeSAT == false && this.bannerList.openHours.SAT == false) {
        this.uploadForm.get('SAT').setValue(false);
        this.editTimeSAT = !this.editTimeSAT;

      }
    }

    if (value == 'SUN') {
      if (this.uploadForm.controls.SUN.value == false) {
        this.uploadForm.get('SUN').setValue(true);
        this.editTimeSUN = !this.editTimeSUN;
      }

      else if (this.uploadForm.controls.SUN.value == true && this.editTimeSUN == true) {
        this.uploadForm.get('SUN').setValue(true);
        this.editTimeSUN = !this.editTimeSUN;

      }

      else if (this.uploadForm.controls.SUN.value == true && this.editTimeSUN == false && this.bannerList.openHours.SUN != false) {

        this.uploadForm.get('SUN').setValue(true);
        this.editTimeSUN = !this.editTimeSUN;

      }


      else if (this.uploadForm.controls.SUN.value == true && this.editTimeSUN == false && this.bannerList.openHours.SUN == false) {
        this.uploadForm.get('SUN').setValue(false);
        this.editTimeSUN = !this.editTimeSUN;

      }
    }
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
  editLocations() {
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
    if (this.uploadForm.controls.MON.value ) {
      if(this.uploadForm.controls.monOpen.value == null || this.uploadForm.controls.monClose.value == null )
      {
        if(this.uploadForm.controls.monOpen.value == null && this.uploadForm.controls.monClose.value == null )
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
      if(this.uploadForm.controls.tueOpen.value == null || this.uploadForm.controls.tueClose.value == null )
      {
        if(this.uploadForm.controls.tueOpen.value == null && this.uploadForm.controls.tueClose.value == null )
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
      if(this.uploadForm.controls.wedOpen.value == null || this.uploadForm.controls.wedClose.value == null )
      {
        if(this.uploadForm.controls.wedOpen.value == null && this.uploadForm.controls.wedClose.value == null )
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
      if(this.uploadForm.controls.thuOpen.value == null || this.uploadForm.controls.thuClose.value == null )
      {
        if(this.uploadForm.controls.thuOpen.value == null && this.uploadForm.controls.thuClose.value == null )
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
      if(this.uploadForm.controls.friOpen.value == null || this.uploadForm.controls.friClose.value == null )
      {
        if(this.uploadForm.controls.friOpen.value == null && this.uploadForm.controls.friClose.value == null )
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
    if (this.uploadForm.controls.SAT.value) {
      if(this.uploadForm.controls.satOpen.value == null || this.uploadForm.controls.satClose.value == null )
      {
        if(this.uploadForm.controls.satOpen.value == null && this.uploadForm.controls.satClose.value == null )
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
    if (this.uploadForm.controls.SUN.value) {
      if(this.uploadForm.controls.sunOpen.value == null || this.uploadForm.controls.sunClose.value == null )
      {
        if(this.uploadForm.controls.sunOpen.value == null && this.uploadForm.controls.sunClose.value == null )
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


  confirmEditLocations() {
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
      "city": this.uploadForm.controls.city.value,
      "email": emailTempArray,
      "cpl": this.uploadForm.controls.cpl.value,
      "region": this.uploadForm.controls.region.value,
      "openHours": arr
    }

    document.getElementById('loader')!.style.display = 'block';
    this.commonService.editLocations(body, this.editId).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.modalService.dismissAll();
        this.successMessage = "Success";
        this.uploadForm.reset();
        this.submitted = false;
        this.modalService.open(this.successModel);
        this.router.navigateByUrl('/admin/locations');
      } else {
        this.modalService.dismissAll();
        this.errorMessage = res.message;
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
    }, error => {
      document.getElementById('loader').style.display = 'none';
      this.uploadForm.reset();
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
  back() {
    this.modalService.dismissAll();
  }

  close() {
    this.modalService.dismissAll();
  }

}
