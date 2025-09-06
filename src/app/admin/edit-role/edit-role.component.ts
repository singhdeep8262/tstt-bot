import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/services/commonService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie';
@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.css']
})
export class EditRoleComponent implements OnInit {
  @ViewChild('responseModel') responseModel: TemplateRef<any>;
  @ViewChild('successModel') successModel: TemplateRef<any>;
  @ViewChild('deleteModel') deleteModel: TemplateRef<any>;
  @ViewChild('updateModel') updateModel: TemplateRef<any>;
  successMessage: any;
  errorMessage: any;
  submitted = false;
  constructor(private router: Router, private route: ActivatedRoute, private commonService: CommonService, private modalService: NgbModal, private cookie_service: CookieService) { }

  createRoleForm = new FormGroup({
    roleName: new FormControl('', Validators.required),
  });
  moduleList = [];
  getModulelist = [];
  deleteMessage: any;

  detailsForm = new FormGroup({

    moduleList: new FormArray([
      new FormGroup({
        create: new FormControl(false),
        edit: new FormControl(false),
        delete: new FormControl(false),
        list: new FormControl(false),
        view: new FormControl(false),

      }), new FormGroup({
        create: new FormControl(false),
        edit: new FormControl(false),
        delete: new FormControl(false),
        list: new FormControl(false),
        view: new FormControl(false),

      }),
    ]),
  });
  roleData: any;
  roleId: any;
  checkArray = [];
  moduleArray = [];
  ngOnInit() {
    this.getModules();
    this.route.queryParams.subscribe((params) => {
      let response = JSON.parse(params['data']);
      if (response) {
        this.roleId = response;
        document.getElementById('loader')!.style.display = 'block';
        this.commonService.getEditRole(response).subscribe(res => {
          document.getElementById('loader')!.style.display = 'none';
          if (res.success == true) {
            this.roleData = res.result;
            this.createRoleForm.get('roleName').setValue(this.roleData.name);
            this.moduleList.push(res.result.access);
            this.getModulelist.forEach((index) => {
              this.checkArray.push({
                "moduleId": index.id,
                "access": {
                  "create": (this.roleData.access[index.id] ? ((this.roleData.access[index.id].create) ? true : false) : false),
                  "edit": (this.roleData.access[index.id] ? ((this.roleData.access[index.id].edit) ? true : false) : false),
                  "delete": (this.roleData.access[index.id] ? ((this.roleData.access[index.id].delete) ? true : false) : false),
                  "list": (this.roleData.access[index.id] ? ((this.roleData.access[index.id].list) ? true : false) : false),
                  "view": (this.roleData.access[index.id] ? ((this.roleData.access[index.id].view) ? true : false) : false)
                }
              })
            })
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
  }
 
  getModules() {
    document.getElementById('loader')!.style.display = 'block';
    let body = { "lookups": ["modules"] };
    this.commonService.getUserLookups(body).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.getModulelist = res.result.modules;
      } else {
        this.modalService.dismissAll();
        this.getModulelist = [];
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


  getAccessValue(event, moduleName) {
    if (moduleName == 'create') {
      if (event == true) {
        return true;
      } else {
        return false;
      }
    }
  }

  goBack() {
    this.router.navigateByUrl('/admin/roles');
  }

  spaceRestrict(event: any) {
    if (event.target.selectionStart == 0 && event.code == 'Space')
      event.preventDefault();
  }

  getChange(feature, id) {

    switch (feature) {
      case 'create': {
        this.checkArray.forEach((value) => {
          if (value.moduleId == id) {
            value.access.create = !(value.access.create);
          }

        });
        break;
      }
      case 'edit': {
        this.checkArray.forEach((value) => {
          if (value.moduleId == id) {
            value.access.edit = !(value.access.edit);
          }

        });
        break;
      }

      case 'delete': {
        this.checkArray.forEach((value) => {
          if (value.moduleId == id) {
            value.access.delete = !(value.access.delete);
          }

        });
        break;
      }
      case 'list': {
        this.checkArray.forEach((value) => {
          if (value.moduleId == id) {
            value.access.list = !(value.access.list);
          }

        });
        break;
      }
      case 'view': {
        this.checkArray.forEach((value) => {
          if (value.moduleId == id) {
            value.access.view = !(value.access.view);
          }
        });
        break;
      }
    }
  }


  roleUpdation() {
    if (!this.createRoleForm.valid) {
      this.submitted = true;
      return;
    }
    let body = {
      "name": this.createRoleForm.controls.roleName.value,
      "acl": this.checkArray
    }

    document.getElementById('loader')!.style.display = 'block';
    this.commonService.editRole(body, this.roleId).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.modalService.dismissAll();
        this.successMessage = res.message;
        this.modalService.open(this.successModel, { backdrop: 'static', keyboard: false });
      } else {
        this.modalService.dismissAll();
        this.errorMessage = res.message;
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
    });

  }
  close() {
    this.modalService.dismissAll();
    this.router.navigateByUrl('/admin/roles');
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  deleteRole() {
    if (!this.createRoleForm.valid) {
      this.submitted = true;
      return;
    }
    this.deleteMessage = "Are you sure you want to delete this role ?"
    this.modalService.open(this.deleteModel, { windowClass: 'error-modal' });
  }

  confirmDelete() {
    if (!this.createRoleForm.valid) {
      this.submitted = true;
      return;
    }
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.DeleteRole(this.roleId).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.modalService.dismissAll();
        this.successMessage = res.message;
        this.modalService.open(this.successModel, { backdrop: 'static', keyboard: false });
        this.router.navigateByUrl('/admin/roles');
      }
      else {
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

  updateRole() {
    if (!this.createRoleForm.valid) {
      this.submitted = true;
      return;
    }
    this.modalService.open(this.updateModel);
  }


}
