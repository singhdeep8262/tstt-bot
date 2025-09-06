import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonService } from '../../../services/commonService';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  @ViewChild('responseModel') responseModel: TemplateRef<any>;
  rolesList = [];
  userList = [];
  pageInfo: any;
  errorMessage: any;
  pageArray: any = [];
  totalPage = 1;
  currentPage = 1;
  userForm = new FormGroup({
    name: new FormControl(''),
    userId: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    roles: new FormControl('')
  });
  roles: any;
  rolesValue = [];
  editUserAccess = false;
  createUserAccess = false;
  adminUserStatus: any;
  constructor(private commonService: CommonService, private router: Router, private cookie_service: CookieService, private modalService: NgbModal) { }

  ngOnInit() {
    let access = JSON.parse(localStorage.getItem('acl'));
    access.forEach((element) => {
      if (element.key == 'USER') {
        this.editUserAccess = element.access.edit;
        this.createUserAccess = element.access.create;
      }
    })
    document.getElementById('loader')!.style.display = 'block';
    let body = { "lookups": ["adminUserStatus"] };
    this.commonService.getLookups(body).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.adminUserStatus = res.result.adminUserStatus;
      }
      else {
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
        this.rolesList = res.result.roles;
        this.rolesList.forEach(element => {
          this.rolesValue.push({
            'id': element.key,
            'itemName': element.value
          })
        })
        if (res.result.roles) {
          this.search(1);
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
  }
  rolesindex = []
  search(page) {
    let rolesArray = this.userForm.controls.roles.value ? this.userForm.controls.roles.value : [];
    let roleIdArray = [];
    if (typeof (rolesArray) != 'string') {
      rolesArray.forEach(element => {
        if (typeof (element) != "string") {
          roleIdArray.push(element.id);
        } else {
          roleIdArray.push(element)
        }
      });
    }

    let body = {
      "phone": this.userForm.controls.phone.value,
      "email": this.userForm.controls.email.value,
      "userId": this.userForm.controls.userId.value,
      "username": this.userForm.controls.name.value,
      "roleIds": roleIdArray
    }
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.getUsers(body, page).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.userList = res.result.data;
        if (page > res.result.pageInfo.totalPage) {
          this.search(1);
        }
        this.currentPage = res.result.pageInfo.curentPage;
        this.totalPage = res.result.pageInfo.totalPage;
        this.pageArray = this.getArrayOfPage(this.totalPage, this.currentPage);
      } else {
        this.errorMessage = res.message;
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
        this.userList = [];
        this.currentPage = 1;
        this.totalPage = 1;
        this.pageArray = this.getArrayOfPage(this.totalPage, this.currentPage);
      }
    }, error => {
      document.getElementById('loader').style.display = 'none';
      this.errorMessage = "There is a problem processing your request. Please try again after some time.";
      this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
    });
  }
  closeModal() {
    this.modalService.dismissAll();
    this.userForm.reset();
  }

  gotoCreateUser() {
    this.router.navigateByUrl('/admin/create-user');
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
      this.search(page);
    }
  }

  editUser(value) {
    this.router.navigate(['/admin/edit-user'], { queryParams: { data: JSON.stringify(value) }, skipLocationChange: true });
  }

  isScreenMobile() {
    let screenWidth = window.innerWidth;
    if (screenWidth >= 375 && screenWidth < 765) return true;
    else return false;
  }

  isScreenipad() {
    let screenWidth = window.innerWidth;
    if (screenWidth > 765 && screenWidth < 1024) return true;
    else return false;
  }

  getLookups(value) {
    let element = this.adminUserStatus.filter(element => element.key == value)[0];
    if (element) {
      return element.value;
    }

  }
}
