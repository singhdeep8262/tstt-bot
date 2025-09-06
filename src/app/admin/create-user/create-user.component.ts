import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/services/commonService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  @ViewChild('responseModel') responseModel: TemplateRef<any>;
  @ViewChild('successModel') successModel: TemplateRef<any>;
  constructor(private router: Router, private commonService: CommonService, private modalService: NgbModal) { }
  rolesArray = [];
  hidePin: Boolean = true;
  hideConfirmpin: Boolean = true;
  submitted = false;
  rolesSubmitted = false;
  rolesValuearray = [];
  successMessage: any;
  errorMessage: any;
  createUser = new FormGroup({
    username: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required,),
    lastName: new FormControl(''),
    Email: new FormControl('', [Validators.required, Validators.pattern("^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    password: new FormControl('', Validators.required),
    mobileDropdown: new FormControl(''),
    mobile: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
  });
  mobileCode: any;
  ngOnInit() {
    this.getLookup();
  }

  getLookup() {
    document.getElementById('loader')!.style.display = 'block';
    let body = { "lookups": ["mobileCode"] };
    this.commonService.getLookups(body).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        // this.rolesValuearray = res.result.roles;
        this.mobileCode = res.result.mobileCode;
        if (this.mobileCode) {
          this.createUser.controls.mobileDropdown.setValue(this.mobileCode[0].key);
        }
      } else {
        this.errorMessage = res.message;
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
    }, error => {
      document.getElementById('loader').style.display = 'none';
      this.errorMessage = "There is a problem processing your request. Please try again after some time.";
      this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
    });

    document.getElementById('loader')!.style.display = 'block';
    let userBody = { "lookups": ["roles"] };
    this.commonService.getUserLookups(userBody).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        // this.rolesValuearray = res.result.roles;
        res.result.roles.forEach(element => {
          this.rolesValuearray.push({
            id: element.id,
            key: element.key,
            name: element.value
          })
        })
      } else {
        this.rolesValuearray = [];
        this.errorMessage = res.message;
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
    }, error => {
      document.getElementById('loader').style.display = 'none';
      this.errorMessage = "There is a problem processing your request. Please try again after some time.";
      this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
    });
  }

  rolesArraypush(data) {
    this.rolesArray.push(data);
  }

  isDisabled(roleValue: any) {
    let checkValue = false;
    this.rolesArray.forEach((element: any) => {
      if (roleValue == element.name) {
        checkValue = true;
      }
    });
    return checkValue
  }

  showPin() {
    { { this.hidePin ? 'visibility_off' : 'visibility' } }
    this.hidePin = !this.hidePin;
  }

  showConfirmpin() {
    { { this.hideConfirmpin ? 'visibility_off' : 'visibility' } }
    this.hideConfirmpin = !this.hideConfirmpin;
  }

  spaceRestrict(event: any) {
    if (event.target.selectionStart == 0 && event.code == 'Space')
      event.preventDefault();
  }

  deleteRoles(i: any, role: any) {
    this.rolesArray.splice(i, 1);
  }
  letterOnly(event) 
  {
              var charCode = event.keyCode;
  
              if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8)
  
                  return true;
              else
                  return false;
  }
  goBack() {
    this.router.navigateByUrl('/admin/users');
  }

  close() {
    this.modalService.dismissAll();
    this.router.navigateByUrl('/admin/users');
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  userCreation() {
    if (!this.createUser.valid) {
      this.submitted = true;
      this.rolesSubmitted = true;
      return;
    }

    let role = []
    if (this.rolesArray.length == 0) {
      this.rolesSubmitted = true;
      return;
    }
    this.rolesArray.forEach(element => {
      role.push(element.id);
    });

    let body = {
      "username": this.createUser.controls.username.value,
      "password": this.createUser.controls.password.value,
      "firstName": this.createUser.controls.firstName.value,
      "lastName": this.createUser.controls.lastName.value,
      "phone": (this.createUser.controls.mobileDropdown.value + this.createUser.controls.mobile.value),
      "email": this.createUser.controls.Email.value,
      "roleIds": role
    }
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.createUser(body).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.modalService.dismissAll();
        this.successMessage = "User successfully created";
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
}
