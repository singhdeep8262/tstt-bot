import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonService } from '../../../services/commonService';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {
  @ViewChild('responseModel') responseModel: TemplateRef<any>;
  @ViewChild('addPromoModel') addPromoModel: TemplateRef<any>;
  @ViewChild('editPromoModel') editPromoModel: TemplateRef<any>;
  @ViewChild('confirmationModal') confirmationModal: TemplateRef<any>;
  @ViewChild('editconfirmationModal') editconfirmationModal: TemplateRef<any>;
  @ViewChild('deleteconfirmationModal') deleteconfirmationModal: TemplateRef<any>;
  @ViewChild('successModel') successModel: TemplateRef<any>;
  errorMessage: any;
  pageArray: any = [];
  totalPage = 1;
  currentPage = 1;
  editForm = new FormGroup({
    name: new FormControl('', Validators.required),
    // subject: new FormControl('', Validators.required),
    // body: new FormControl('', Validators.required),
    image: new FormControl('', Validators.required)
  });

  editUserAccess = false;
  createUserAccess = false;
  deleteUserAccess = false;
  bannerList: any = [];
  adminUserStatus: any;
  submitted = false;
  showNewToggle = false;
  reverseToggleValue = false;
  successMessage: any;
  prevImage: any;
  getNameValue: any;
  nameValue: any;
  imageEdit: any;
  toggleMessage: any;
  isToggleActive: any;
  toggleDataId: any;
  newIdValue: any;
  openAccordion: boolean[] = [];

  constructor(private commonService: CommonService, private router: Router, private modalService: NgbModal) { }

  ngOnInit() {
     console.log(this.openAccordion)
    let access = JSON.parse(localStorage.getItem('acl'));
    access.forEach((element) => {
      if (element.key == 'LOCATIONS') {
        this.editUserAccess = element.access.edit;
        this.createUserAccess = element.access.create;
        this.deleteUserAccess = element.access.delete;
      }
    })
    this.search(1);

  }
  search(page) {

    document.getElementById('loader')!.style.display = 'block';
    this.commonService.getLocations(page).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.bannerList = res.result.data;
        this.currentPage = res.result.pageInfo.currentPage;
        this.totalPage = res.result.pageInfo.totalPage;
        this.pageArray = this.getArrayOfPage(this.totalPage, this.currentPage);
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

  goToPage(page) {
    if (page >= 1 && page <= this.totalPage) {
      this.search(page);
    }
  }

  closeModal() {
    this.modalService.dismissAll();
    this.submitted = false;
  }

  spaceRestrict(event: any) {
    if (event.target.selectionStart == 0 && event.code == 'Space')
      event.preventDefault();
  }

  deleteId: any;
  editId: any;
  deletebanner(id) {
    this.deleteId = id;
    this.modalService.open(this.deleteconfirmationModal, { windowClass: 'error-modal' });
  }

  imageUrl: any;

  editbanner(data, id) {
    this.editId = id;
    this.imageUrl = data.imageUrl;
    this.imageEdit = data.imageUrl;
    this.editForm.controls.name.setValue(data.name);
    // this.editForm.controls.body.setValue(data.body);
    // this.editForm.controls.subject.setValue(data.subject);
    this.editForm.controls.image.setValue(data.imageUrl);
    this.modalService.open(this.editPromoModel);
  }



  confirmDelete() {
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.deleteLocations(this.deleteId).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.modalService.dismissAll();
        this.successMessage = "Deleted Successfully";
        this.modalService.open(this.successModel);
        this.search(1);
      } else {
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

  close() {
    this.modalService.dismissAll();
  }

  confirmEdit() {
    this.showNewToggle = false;
    let promo = {
      "name": this.editForm.controls.name.value,
      // "body": this.editForm.controls.body.value,
      // "subject": this.editForm.controls.subject.value,
      "image": this.editForm.controls.image.value,
      "isActive": this.isToggleActive,
      "_method": "PUT"
    }
    const form_data = new FormData();
    for (let key in promo) {
      form_data.append(key, promo[key]);
    }
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.updatePromotionBanner(form_data, this.editId).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.modalService.dismissAll();
        this.successMessage = res.message;
        this.modalService.open(this.successModel);
        this.editForm.reset();
        this.submitted = false;
        this.search(1);
      } else {
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
  back() {
    this.modalService.dismissAll();
    this.modalService.open(this.addPromoModel);

  }

  openPromoModal() {
    this.router.navigateByUrl('/admin/add-locations');
  }

  backEdit() {
    this.modalService.dismissAll();
    this.modalService.open(this.editPromoModel);
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


  openEditScreen(value){
    this.router.navigate(['/admin/edit-locations'], { queryParams: { data: JSON.stringify(value) }, skipLocationChange: true });
  }

  // getRaceList(id, event) {
  //   let idNo = 'accordionLists' + id;
  //   let headNo = 'collapseOne' + id;
  //   if (document.getElementById(headNo).classList.value == "mt-3 collapse") {
  //     let element = document.getElementById(idNo);
  //     element.classList.add("isActive");
  //     this.closeOpenAccordion(idNo)
  //   } else {
     
  //     let element = document.getElementById(idNo);
  //     element.classList.remove("isActive");
  //     this.resetRaceData(id);
      
  //   }
  

  // }

  // closeOpenAccordion(idNo) {
  //   let totalAccordions = document.querySelectorAll('.mt-3.collapse')
  //   for (let i = 0; i < totalAccordions.length; i++) {
  //     let parentId = totalAccordions[i].parentNode.parentNode['id'];
  //     if (totalAccordions[i].classList.contains('show') && parentId != idNo) {
  //       let parentEle = document.getElementById(parentId)
  //       let curretEle = document.getElementById(totalAccordions[i]['id'])
  //       let prevEle = document.getElementById(totalAccordions[i].previousSibling['id']);
  //       document.getElementById(`${i}`).innerText = "";
  //       document.getElementById(`${i}`).style.padding = "0";
  //       prevEle.setAttribute('aria-expanded', 'false')
  //       curretEle.classList.remove("show");
  //       parentEle.classList.remove("isActive");
  //     }
  //   }
  // }

  // resetRaceData(id) {
  //   document.getElementById(`${id}`).innerHTML = '';
  //   document.getElementById(`${id}`).style.padding = "0";
  // }

 
}
