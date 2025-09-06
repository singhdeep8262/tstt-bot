import { Component, OnInit, ViewChild, TemplateRef, ElementRef,HostListener } from '@angular/core';
import { Router } from '@angular/router';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/commonService';
import { AuthService } from 'src/app/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userAccess: any;
  @ViewChild('logoutModal') logoutModal: TemplateRef<any>;
  constructor(public router: Router, private commonService: CommonService, private authService:AuthService,private modalService: NgbModal) { }

  ngOnInit() {
    let access = JSON.parse(localStorage.getItem('acl'));
    this.userAccess = access;
  }

  getAccess(value) {
    let change = false;
    this.userAccess.forEach(element =>{
      if (value == element.key && element.access.list) {
        change =  true;
      }
    })    
    return change;

  }

  isLoggedIn() {
    return CommonService.isAuthenticated;
  }
  closeModal()
  {
   this.modalService.dismissAll();
  }
  goToPath(url: any) {
    this.router.navigateByUrl(url);
    document.getElementsByClassName("navbar-collapse")[0].classList.remove("show");
    document.getElementsByClassName("navbar-collapse")[0].classList.add("collapse");
    document.getElementsByClassName("navbar-collapse")[0].classList.add("hide");
  }
  logoutModalopen()
  {
  this.modalService.open(this.logoutModal, { windowClass: 'logout-modal' });
  }
  logout() {
    this.authService.logout();
    CommonService.isAuthenticated = false;
    this.goToPath('admin/login');
    this.modalService.dismissAll();
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.logoutUnauthenticated('').subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
    });
  }

  returnUrl(){
    return window.location.href.split("#").pop();
  }
}
