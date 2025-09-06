import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CommonService } from "../../../services/commonService";
import { CookieService } from 'ngx-cookie';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.css']
})
export class ModulesComponent implements OnInit {
  @ViewChild('responseModel') responseModel: TemplateRef<any>;
  @ViewChild('deleteModel') deleteModel: TemplateRef<any>;
  @ViewChild('successModel') successModel: TemplateRef<any>;
  moduleList = [];
  modulesForm = new FormGroup({
    moduleName: new FormControl(''),
    url: new FormControl(''),
    moduleKey: new FormControl('')
  });
  errorMessage: any;
  deleteMessage: any;
  pageInfo: any;
  pageArray: any = [];
  totalPage = 1;
  currentPage = 1;
  deleteModuleId: any;
  successMessage: any;
  editModuleAccess = false;
  deleteModuleAccess = false;
  createModuleAccess = false;
  constructor(private commonService: CommonService, private router: Router, private cookie_service: CookieService, private modalService: NgbModal) { }

  ngOnInit() {
    let access = JSON.parse(localStorage.getItem('acl'));
    access.forEach((element) => {
      if (element.key == 'MODULE') {
        this.editModuleAccess = element.access.edit;
        this.deleteModuleAccess = element.access.delete;
        this.createModuleAccess = element.access.create;
      }
    })
    this.getModules(1);
  }
  private getArrayOfPage(pageCount: number, currentPage: number): number[] {
    let pageArray: number[] = [];

    if (pageCount < 4) {
      if (pageCount > 0) {
        for (var i = 1; i <= pageCount; i++) {
          pageArray.push(i);
        }
      }
    } else {
      let ratio = pageCount / currentPage;
      if (currentPage > 2 && currentPage < pageCount - 1) {
        pageArray.push(1);
        pageArray.push(0);
        pageArray.push(currentPage - 1);
        pageArray.push(currentPage);
        pageArray.push(currentPage + 1);
        pageArray.push(0);
        pageArray.push(this.totalPage);
      } else {
        if (currentPage <= 2) {
          pageArray.push(1);
          pageArray.push(2);
          pageArray.push(3);
          pageArray.push(0);
          pageArray.push(this.totalPage);
        } else if (currentPage >= pageCount - 1) {
          pageArray.push(1);
          pageArray.push(0);
          pageArray.push(pageCount - 2);
          pageArray.push(pageCount - 1);
          pageArray.push(pageCount);
        }
      }
    }

    return pageArray;
  }

  spaceRestrict(event: any) {
    if (event.target.selectionStart == 0 && event.code == 'Space')
      event.preventDefault();
  }

  goToPage(page) {
    if (page >= 1 && page <= this.totalPage) {
      this.getModules(page);
    }
  }
  getModules(page) {
    let body = {
      "name": this.modulesForm.controls.moduleName.value,
      "key": this.modulesForm.controls.moduleKey.value,
      "url": this.modulesForm.controls.url.value
    }
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.getModules(body, page).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.moduleList = res.result.data;
        if(page > res.result.pageInfo.totalPage) {
          this.getModules(1);
        }
        this.currentPage = res.result.pageInfo.curentPage;
        this.totalPage = res.result.pageInfo.totalPage;
        this.pageArray = this.getArrayOfPage(this.totalPage, this.currentPage);
      }
      else {
        this.moduleList = [];
        this.currentPage = 1;
        this.totalPage = 1;
        this.pageArray = this.getArrayOfPage(this.totalPage, this.currentPage);
        this.errorMessage = res.message;
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
    }, error => {
      document.getElementById('loader').style.display = 'none';
      this.errorMessage = "There is a problem processing your request. Please try again after some time.";
      this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
    });
  }

  gotoAddModule() {
    this.router.navigateByUrl('/admin/create-module');
  }
  closeModal() {
    this.modalService.dismissAll();
  }
  confirmDelete() {
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.DeleteModule(this.deleteModuleId).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.closeModal();
        this.successMessage = res.message;
        this.modalService.open(this.successModel, { backdrop: 'static', keyboard: false });
        this.router.navigateByUrl('/admin/modules');
        this.getModules(1);
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
  editModule(moduleId) {
    this.router.navigate(['/admin/edit-module'], { queryParams: { data: JSON.stringify(moduleId) }, skipLocationChange: true });
  }

  deleteModule(deleteId) {
    this.deleteModuleId = deleteId;
    this.deleteMessage = "Are you sure you want to delete this Module ?"
    this.modalService.open(this.deleteModel, { windowClass: 'error-modal' });
  }

}
