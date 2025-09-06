import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/services/commonService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-edit-module',
  templateUrl: './edit-module.component.html',
  styleUrls: ['./edit-module.component.css']
})
export class EditModuleComponent implements OnInit {
  @ViewChild('responseModel') responseModel: TemplateRef<any>;
  @ViewChild('successModel') successModel: TemplateRef<any>;
  @ViewChild('deleteModel') deleteModel: TemplateRef<any>;
  @ViewChild('updateModel') updateModel: TemplateRef<any>;
  successMessage: any;
  errorMessage: any;
  submitted = false;
  constructor(private router: Router, private route: ActivatedRoute, private commonService: CommonService, private modalService: NgbModal, private cookie_service: CookieService) { }

  editModuleForm = new FormGroup({
    moduleName: new FormControl('', Validators.required),
    moduleUrl: new FormControl('', Validators.required),
    moduleKey: new FormControl('', Validators.required)
  });
  moduleList = [];

  moduleListForm = new FormGroup({
        create: new FormControl(false),
        edit: new FormControl(false),
        delete: new FormControl(false),
        list: new FormControl(false),
        view: new FormControl(false),
  });
  moduleData: any;
  moduleId: any;
  deleteMessage: any;
  checkArray = [];
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      let response = JSON.parse(params['data']);
      if (response) {
        this.moduleId = response;
        document.getElementById('loader')!.style.display = 'block';
        this.commonService.getEditModule(response).subscribe(res => {
          document.getElementById('loader')!.style.display = 'none';
          if (res.success == true) {
            this.moduleData = res.result;
            this.editModuleForm.get('moduleName').setValue(this.moduleData.name);
            this.editModuleForm.get('moduleUrl').setValue(this.moduleData.url);
            this.editModuleForm.get('moduleKey').setValue(this.moduleData.key);
            this.moduleList = res.result.modules;
            this.moduleListForm.controls.create.setValue(res.result.create);
            this.moduleListForm.controls.edit.setValue(res.result.edit);
            this.moduleListForm.controls.list.setValue(res.result.list);
            this.moduleListForm.controls.view.setValue(res.result.view);
            this.moduleListForm.controls.delete.setValue(res.result.delete);
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

  spaceRestrict(event: any) {
    if (event.target.selectionStart == 0 && event.code == 'Space')
      event.preventDefault();
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
    this.router.navigateByUrl('/admin/modules');
  }

  moduleUpdation() {
    if(!this.editModuleForm.valid) {
      this.submitted = true;
      return;
    }

    let body = {
      "name": this.editModuleForm.controls.moduleName.value,
      "url": this.editModuleForm.controls.moduleUrl.value,
      "key": this.editModuleForm.controls.moduleKey.value,
      "delete": this.moduleListForm.controls.delete.value == true ? true : false,
      "view": this.moduleListForm.controls.view.value == true ? true : false,
      "create": this.moduleListForm.controls.create.value == true ? true : false,
      "list": this.moduleListForm.controls.list.value == true ? true : false,
      "edit": this.moduleListForm.controls.edit.value == true ? true : false
    }

    document.getElementById('loader')!.style.display = 'block';
    this.commonService.editModule(body, this.moduleId).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.modalService.dismissAll();
        this.successMessage = res.message
        this.modalService.open(this.successModel, { backdrop: 'static', keyboard: false });
      } else {
        this.modalService.dismissAll();
        this.errorMessage = res.message;
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
    });

  }

  closeModal() {
    this.modalService.dismissAll();
  }

  close(){
    this.modalService.dismissAll();
    this.router.navigateByUrl('/admin/modules');
  }

  deleteModule() {
    if(!this.editModuleForm.valid) {
      this.submitted = true;
      return;
    }
    this.deleteMessage = "Are you sure you want to delete this module ?"
    this.modalService.open(this.deleteModel, { windowClass: 'error-modal' });
  }

  updateModule() {
    if(!this.editModuleForm.valid) {
      this.submitted = true;
      return;
    }
    this.modalService.open(this.updateModel);
  }


  confirmDelete() {
    if(!this.editModuleForm.valid) {
      this.submitted = true;
      return;
    }
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.DeleteModule(this.moduleId).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.modalService.dismissAll();
        this.successMessage = res.message;
        this.modalService.open(this.successModel, { backdrop: 'static', keyboard: false });
        this.router.navigateByUrl('/admin/modules');
      } else {
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

}

