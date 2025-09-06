import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/services/commonService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie';
@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.css']
})
export class CreateRoleComponent implements OnInit {
  @ViewChild('responseModel') responseModel: TemplateRef<any>;
  @ViewChild('successModel') successModel: TemplateRef<any>;
  submitted = false;
  constructor(private router: Router, private commonService: CommonService, private modalService: NgbModal, private cookie_service: CookieService) { }
  successMessage: any;
  errorMessage: any;
  createRoleForm = new FormGroup({
    roleName: new FormControl('', Validators.required),
    // role: new FormControl('', Validators.required),
  });

  moduleList = [];
  checkArray = [];
  ngOnInit() {
    this.getModules();
  }

  goBack() {
    this.router.navigateByUrl('/admin/roles');
  }

  getModules() {
    document.getElementById('loader')!.style.display = 'block';
    let body = { "lookups": ["modules"] };
    this.commonService.getUserLookups(body).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.moduleList = res.result.modules;
        this.moduleList.forEach((index) => {
          this.checkArray.push({
            "moduleId": index.id,
            "access": {
              "create": false,
              "edit": false,
              "delete": false,
              "list": false,
              "view": false
            }

          })
        })
      } else {
        this.moduleList = [];
        this.errorMessage = res.message;
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
    }, error => {
      document.getElementById('loader').style.display = 'none';
      this.errorMessage = "There is a problem processing your request. Please try again after some time.";
      this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
    });
  }

  spaceRestrict(event: any) {
    if (event.target.selectionStart == 0 && event.code == 'Space')
      event.preventDefault();
  }

  getChange(event, random) {
    if (event.target.checked && random == 'create') {
      var index = event.target.value;
      var newVal = parseInt(index);
      var indx = this.checkArray.map(object => object.moduleId).indexOf(newVal);
      this.checkArray[indx].access.create = true;
    }
    else if (!event.target.checked && random == 'create') {
      var index2 = event.target.value;
      var newVal2 = parseInt(index2);
      var indx = this.checkArray.map(object => object.moduleId).indexOf(newVal2);
      this.checkArray[indx].access.create = false;
    }
    else if (event.target.checked && random == 'edit') {
      var index = event.target.value;
      var newVal = parseInt(index);
      var indx = this.checkArray.map(object => object.moduleId).indexOf(newVal);
      this.checkArray[indx].access.edit = true;
    } else if (!event.target.checked && random == 'edit') {
      var index2 = event.target.value;
      var newVal2 = parseInt(index2);
      var indx = this.checkArray.map(object => object.moduleId).indexOf(newVal2);
      this.checkArray[indx].access.edit = false;
    } else if (event.target.checked && random == 'delete') {
      var index = event.target.value;
      var newVal = parseInt(index);
      var indx = this.checkArray.map(object => object.moduleId).indexOf(newVal);
      this.checkArray[indx].access.delete = true;
    } else if (!event.target.checked && random == 'delete') {
      var index2 = event.target.value;
      var newVal2 = parseInt(index2);
      var indx = this.checkArray.map(object => object.moduleId).indexOf(newVal2);
      this.checkArray[indx].access.delete = false;
    } else if (event.target.checked && random == 'list') {
      var index = event.target.value;
      var newVal = parseInt(index);
      var indx = this.checkArray.map(object => object.moduleId).indexOf(newVal);
      this.checkArray[indx].access.list = true;
    } else if (!event.target.checked && random == 'list') {
      var index2 = event.target.value;
      var newVal2 = parseInt(index2);
      var indx = this.checkArray.map(object => object.moduleId).indexOf(newVal2);
      this.checkArray[indx].access.list = false;
    } else if (event.target.checked && random == 'view') {
      var index = event.target.value;
      var newVal = parseInt(index);
      var indx = this.checkArray.map(object => object.moduleId).indexOf(newVal);
      this.checkArray[indx].access.view = true;
    } else if (!event.target.checked && random == 'view') {
      var index2 = event.target.value;
      var newVal2 = parseInt(index2);
      var indx = this.checkArray.map(object => object.moduleId).indexOf(newVal2);
      this.checkArray[indx].access.view = false;
    }
  }

  roleCreation() {

    if (!this.createRoleForm.valid) {
      this.submitted = true;
      return;
    }
    let body = {
      "name": this.createRoleForm.controls.roleName.value,
      // "key": this.createRoleForm.controls.role.value,
      "acl": this.checkArray
    }

    document.getElementById('loader')!.style.display = 'block';
    this.commonService.createRoles(body).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.successMessage = "Role created successfully.";
        this.modalService.open(this.successModel, { backdrop: 'static', keyboard: false });
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
  close() {
    this.modalService.dismissAll();
    this.router.navigateByUrl('/admin/roles');
  }
  closeModal() {
    this.modalService.dismissAll();
  }
}
