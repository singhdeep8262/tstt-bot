import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/services/commonService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  @ViewChild('successModel') successModel: TemplateRef<any>;
  @ViewChild('ConfirmationModal') ConfirmationModal: TemplateRef<any>;
  @ViewChild('responseModel') responseModel: TemplateRef<any>;
  constructor(private router: Router, private route: ActivatedRoute, private commonService: CommonService, private modalService: NgbModal) { }
  hideCurrentPassword: Boolean = true;
  hideNewPassword: Boolean = true;
  hideConfirmPassword: Boolean = true;
  submitted = false;
  errorMessage:string;
  successMessage:string;
  changePasswordForm = new FormGroup({
    password: new FormControl('', Validators.required),
    newPassword: new FormControl('', Validators.required),
    confirmNewPassword: new FormControl('', Validators.required),
  });
  ngOnInit(): void {
  }
  showCurrentPassword() {
    { { this.hideCurrentPassword ? 'visibility_off' : 'visibility' } }
    this.hideCurrentPassword = !this.hideCurrentPassword;
  }
  showNewPassword() {
    { { this.hideNewPassword ? 'visibility_off' : 'visibility' } }
    this.hideNewPassword = !this.hideNewPassword;
  }
  showConfirmPassword() {
    { { this.hideConfirmPassword ? 'visibility_off' : 'visibility' } }
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }
  // goBack() {
  //   this.router.navigateByUrl('/admin/customer-management');
  // }

  closeModal() {
    this.modalService.dismissAll();
  }
  openConfirmation()
  {
    if (!this.changePasswordForm.valid) {
      this.submitted = true;
      return;
    }
    if (this.changePasswordForm.controls.newPassword.value !== this.changePasswordForm.controls.confirmNewPassword.value) {
     return;
    }
    this.modalService.open(this.ConfirmationModal);
  }
  close() {
    this.modalService.dismissAll();
    // this.router.navigateByUrl('/admin/customer-management');
  }
  goBack() {
    let acl=[];
    acl= JSON.parse(localStorage.getItem('acl'));
    this.modalService.dismissAll();
    let keepGoing = true;
    acl.forEach(element =>{
      if (element.key == 'USER' && element.access.list && keepGoing) {
        this.router.navigateByUrl('/admin/users');
        keepGoing = false;
      }
      else if (element.key == 'ROLE' && element.access.list && keepGoing) {
        this.router.navigateByUrl('/admin/roles')
        keepGoing = false;
      }
      else if (element.key == 'CMS' && element.access.list && keepGoing) {
        this.router.navigateByUrl('/admin/customer-management')
        keepGoing = false;
      }
      else if (element.key == 'MODULE' && element.access.list && keepGoing) {
        this.router.navigateByUrl('/admin/modules')
        keepGoing = false;
      }
    })
  }
  updatePassword() {
    let body = {
      "currentPassword": this.changePasswordForm.controls.password.value,
      "newPassword": this.changePasswordForm.controls.confirmNewPassword.value
    }
    document.getElementById('loader').style.display = 'block';
        this.commonService.changePassword(body).subscribe(res => {
          document.getElementById('loader').style.display = 'none';
          if (res.success == true) {
            this.modalService.dismissAll();
            this.successMessage=res.message;
            this.modalService.open(this.successModel, { backdrop: 'static', keyboard: false });
          } else {
            this.modalService.dismissAll();
            this.submitted=false;
            this.errorMessage=res.message;
            this.changePasswordForm.reset();
            this.changePasswordForm.controls.password.setValue('');
            this.changePasswordForm.controls.newPassword.setValue('');
            this.changePasswordForm.controls.confirmNewPassword.setValue('');
            this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
          }
        });
    
  }
}
