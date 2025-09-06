import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie';
import { CommonService } from 'src/services/commonService';

@Component({
  selector: 'app-create-module',
  templateUrl: './create-module.component.html',
  styleUrls: ['./create-module.component.css']
})
export class CreateModuleComponent implements OnInit {

  @ViewChild('responseModel') responseModel: TemplateRef<any>;
  @ViewChild('successModel') successModel: TemplateRef<any>;
  submitted = false;
  constructor(private router: Router, private commonService: CommonService, private modalService: NgbModal, private cookie_service: CookieService) { }
  successMessage: any;
  errorMessage: any;
  create: boolean = false;
  edit: boolean = false;
  delete: boolean = false;
  list: boolean = false;
  view: boolean = false;
  createModuleform = new FormGroup({
    moduleName: new FormControl('', Validators.required),
    Url: new FormControl('', Validators.required),
    moduleKey: new FormControl('', Validators.required),
  });


  ngOnInit() {
    this.userArray.set('editCustomer', true);
  }

  goBack() {
    this.router.navigateByUrl('/admin/modules');
  }


  userArray: any = new Map();
  createCheck(event, item) {
    if (item == 'create') {
      this.create = !this.create;
    }
    else if (item == 'edit') {
      this.edit = !this.edit;
    }
    else if (item == 'delete') {
      this.delete = !this.delete;
    }
    else if (item == 'list') {
      this.list = !this.list;
    }
    else if (item == 'view') {
      this.view = !this.view;
    }

  }

  moduleCreation() {
    if (!this.createModuleform.valid) {
      this.submitted = true;
      return;
    }

    let body = {
      "name": this.createModuleform.controls.moduleName.value,
      "key": this.createModuleform.controls.moduleKey.value,
      "url": this.createModuleform.controls.Url.value,
      "create": this.create,
      "edit": this.edit,
      "delete": this.delete,
      "list": this.list,
      "view": this.view
    }

    document.getElementById('loader')!.style.display = 'block';
    this.commonService.createModules(body).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.successMessage = "Module created successfully.";
        this.modalService.open(this.successModel, { backdrop: 'static', keyboard: false });
      }  else {
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
    this.router.navigateByUrl('/admin/modules');
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  spaceRestrict(event: any) {
    if (event.target.selectionStart == 0 && event.code == 'Space')
      event.preventDefault();
  }
}
