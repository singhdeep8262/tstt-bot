import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/services/commonService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie';
import { isInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  @ViewChild('responseModel') responseModel: TemplateRef<any>;
  @ViewChild('successModel') successModel: TemplateRef<any>;
  @ViewChild('updateModel') updateModel: TemplateRef<any>;
  successMessage: any;
  errorMessage: any;
  constructor(private router: Router, private route: ActivatedRoute, private commonService: CommonService, private modalService: NgbModal, private cookie_service: CookieService) { }
  rolesArray = [];
  submitted = false;
  rolesSubmitted = false;
  userData: any;
  roleId: any;
  mobileCode: any;
  hidePin: Boolean = true;
  hideConfirmpin: Boolean = true;
  rolesValuearray = [];
  editUser = new FormGroup({
    username: new FormControl(''),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl(''),
    Email: new FormControl('', [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    mobile: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
  });
  ngOnInit() {
    this.getLookup();
    this.route.queryParams.subscribe((params) => {
      let response = JSON.parse(params['data']);
      if (response) {
        this.roleId = response;
        document.getElementById('loader')!.style.display = 'block';
        this.commonService.getEditUser(response).subscribe(res => {
          document.getElementById('loader')!.style.display = 'none';
          if (res.success == true) {
            this.userData = res.result;
            this.editUser.get('username').setValue(this.userData.username);
            this.editUser.get('firstName').setValue(this.userData.firstName);
            this.editUser.get('lastName').setValue(this.userData.lastName);
            this.editUser.get('Email').setValue(this.userData.email);
            this.editUser.get('mobile').setValue(this.userData.phone);
            res.result.roles.forEach(element => {
              this.rolesArray.push({
                id: element.id,
                key: element.key,
                value: element.name
              })

            })
          }
          else {
            this.modalService.dismissAll();
            this.errorMessage = res.message.errorMessage;
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
  }
  letterOnly(event) 
  {
              var charCode = event.keyCode;
  
              if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8)
  
                  return true;
              else
                  return false;
  }
  getLookup() {
    document.getElementById('loader')!.style.display = 'block';
    let body = { "lookups": ["roles"] };
    this.commonService.getUserLookups(body).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.rolesValuearray = res.result.roles;
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

  spaceRestrict(event: any) {
    if (event.target.selectionStart == 0 && event.code == 'Space')
      event.preventDefault();
  }

  isDisabled(roleValue: any) {
    let checkValue = false;
    this.rolesArray.forEach((element: any) => {
      if (roleValue == element.value) {
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

  deleteRoles(i: any, role: any) {
    this.rolesArray.splice(i, 1);
  }

  goBack() {
    this.router.navigateByUrl('/admin/users');
  }

  userUpdation() {
    if (!this.editUser.valid) {
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
      "firstName": this.editUser.controls.firstName.value,
      "lastName": this.editUser.controls.lastName.value,
      "newPassword": this.editUser.controls.password.value,
      "roleIds": role
    }
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.editUser(body, this.roleId).subscribe(res => {
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

  closeModal() {
    this.modalService.dismissAll();
  }
  close() {
    this.modalService.dismissAll();
    this.router.navigateByUrl('/admin/users');
  }

  updateUser() {
    if (!this.editUser.valid) {
      this.submitted = true;
      this.rolesSubmitted = true;
      return;
    }
    if (this.rolesArray.length == 0) {
      this.rolesSubmitted = true;
      return;
    }
    this.modalService.open(this.updateModel);
  }


}

