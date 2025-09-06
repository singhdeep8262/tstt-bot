import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "../../../services/commonService";
import { CookieService } from 'ngx-cookie';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  @ViewChild('responseModel') responseModel: TemplateRef<any>;
  @ViewChild('deleteModel') deleteModel: TemplateRef<any>;
  @ViewChild('successModel') successModel: TemplateRef<any>;
  @ViewChild('updateModel') updateModel: TemplateRef<any>;
  @ViewChild('confirmHeirarchyModel') confirmHeirarchyModel: TemplateRef<any>;
  rolesList = [];
  pageInfo: any;
  errorMessage: any;
  pageArray: any = [];
  totalPage = 1;
  currentPage = 1;
  rolesForm = new FormGroup({
    roleName: new FormControl(''),
    roleKey: new FormControl('')
  });
  deleteMessage: any;
  successMessage: any;
  deleteRoleId: any;
  editRoleAccess = false;
  showHideHeirarchy = true;
  deleteRoleAccess = false;
  createRoleAccess = false;
  editHeirarchy = false;
  newHeirarchyName: any = [];
  newHeirarchyId: any = [];
  constructor(private commonService: CommonService, private router: Router, private cookie_service: CookieService, private modalService: NgbModal) { }

  ngOnInit() {
    let access = JSON.parse(localStorage.getItem('acl'));
    access.forEach((element) => {
      if (element.key == 'ROLE') {
        this.editRoleAccess = element.access.edit;
        this.deleteRoleAccess = element.access.delete;
        this.createRoleAccess = element.access.create;
      }
      if (element.key == 'ROLE_HIERARCHY') {
        this.editHeirarchy = element.access.edit;
      }
    })
    this.getRoles(1);
  }
  letterOnly(event) 
  {
              var charCode = event.keyCode;
  
              if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8)
  
                  return true;
              else
                  return false;
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

  goToPage(page) {
    if (page >= 1 && page <= this.totalPage) {
      this.getRoles(page);
    }
  }

  spaceRestrict(event: any) {
    if (event.target.selectionStart == 0 && event.code == 'Space')
      event.preventDefault();
  }

  getRoles(page) {
    let body = {
      "name": this.rolesForm.controls.roleName.value,
      "key": this.rolesForm.controls.roleKey.value,
    }
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.getRoles(body, page).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.rolesList = res.result.data;
        if (page > res.result.pageInfo.totalPage) {
          this.getRoles(1);
        }
        this.currentPage = res.result.pageInfo.curentPage;
        this.totalPage = res.result.pageInfo.totalPage;
        this.pageArray = this.getArrayOfPage(this.totalPage, this.currentPage);
      } else {
        this.rolesList = [];
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

  gotoAddRole() {
    this.router.navigateByUrl('/admin/create-role');
  }

  editRole(value) {
    this.router.navigate(['/admin/edit-role'], { queryParams: { data: JSON.stringify(value) }, skipLocationChange: true });
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  deleteRole(getRoleId) {
    this.deleteRoleId = getRoleId;
    this.deleteMessage = "Are you sure you want to delete this role ?"
    this.modalService.open(this.deleteModel, { windowClass: 'error-modal' });
  }

  editData(data) {
    this.showHideHeirarchy = true;
    data.forEach((item) => {
      this.newHeirarchyName.push({ name: item.name, key: item.key });
      this.newHeirarchyId.push(item.hierarchy);
    })
    this.modalService.dismissAll();
    this.modalService.open(this.confirmHeirarchyModel, { backdrop: 'static', keyboard: false, windowClass: 'confirm-modal' });
  }

  cancelHeirarchy() {
    this.showHideHeirarchy = true;
    this.newHeirarchyName.splice(0, this.newHeirarchyName.length);
    this.newHeirarchyId.splice(0, this.newHeirarchyId.length);
    this.modalService.dismissAll();
  }

  confirmDelete() {
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.DeleteRole(this.deleteRoleId).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.closeModal();
        this.successMessage = res.message;
        this.modalService.open(this.successModel, { backdrop: 'static', keyboard: false });
        this.getRoles(1);
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
  editHierarchyList = [];
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.editHierarchyList, event.previousIndex, event.currentIndex);
  }

  editHierarchy() {
    this.showHideHeirarchy = false;
    this.editHierarchyList = [];
    if (this.rolesList.length > 0) {
      this.rolesList.forEach(ele => {
        this.editHierarchyList.push({
          name: ele.name,
          key: ele.key,
          hierarchy: ele.id
        });
      })
    }
  }

  confirmHeirarchy() {
    let body = {
      "roleHierarchy": this.newHeirarchyId
    };
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.confirmNewHeirarchy(body).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.successMessage = res.message;
        this.modalService.dismissAll();
        this.modalService.open(this.successModel, { backdrop: 'static', keyboard: false });
        this.newHeirarchyName.splice(0, this.newHeirarchyName.length);
        this.newHeirarchyId.splice(0, this.newHeirarchyId.length);
        this.getRoles(1);
      } else {
        this.modalService.dismissAll();
        this.newHeirarchyName.splice(0, this.newHeirarchyName.length);
        this.newHeirarchyId.splice(0, this.newHeirarchyId.length);
        this.errorMessage = res.message;
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
    }, error => {
      document.getElementById('loader').style.display = 'none';
      this.modalService.dismissAll();
      this.newHeirarchyName.splice(0, this.newHeirarchyName.length);
      this.newHeirarchyId.splice(0, this.newHeirarchyId.length);
      this.errorMessage = "There is a problem processing your request. Please try again after some time.";
      this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
    });
  }

}
