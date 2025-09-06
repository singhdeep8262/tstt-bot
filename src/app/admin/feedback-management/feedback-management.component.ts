import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { CommonService } from "../../../services/commonService";
import { CookieService } from 'ngx-cookie';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Body } from '@angular/http/src/body';
@Component({
  selector: 'app-feedback-management',
  templateUrl: './feedback-management.component.html',
  styleUrls: ['./feedback-management.component.css']
})
export class FeedbackManagementComponent implements OnInit {
  @ViewChild('responseModel') responseModel: TemplateRef<any>;
  @ViewChild('deleteModal') deleteModal: TemplateRef<any>;
  @ViewChild('successModel') successModel: TemplateRef<any>;
  @ViewChild('updateModel') updateModel: TemplateRef<any>;
  @ViewChild('addFaqModel') addFaqModel: TemplateRef<any>;
  @ViewChild('addEditSurveyModal') addEditSurveyModal: TemplateRef<any>;
  pageInfo: any;
  errorMessage: any;
  pageArray: any = [];

  totalPage = 1;
  currentPage = 1;
  deleteMessage: any;
  successMessage: any;
  feedbackForm = new FormGroup({
    formLabel: new FormControl('')
  });
  addFeedbackForm = new FormGroup({
    question: new FormControl('', Validators.required),
    isActive: new FormControl(true, Validators.required)
  });
  type = new FormControl('starRating', Validators.required)
  scale = new FormControl('', Validators.required)
  feedbackData: any;
  isEditMode: boolean = false;
  showAll: { [key: string]: boolean } = {};
  deleteId: any;
  editedId: any;
  starRatingValue: any;
  npsSurveyType: any;
  currentItem: any;
  starRating: boolean = false;
  constructor(private commonService: CommonService, private router: Router, private cookie_service: CookieService, private modalService: NgbModal) { }
  ngOnInit(): void {
    this.search(1);

    let lookupBody = { "lookups": ["npsSurveyStarRating", "npsSurveyType"] };

    this.commonService.getLookups(lookupBody).subscribe(res => {
      document.getElementById('loader').style.display = 'none';
      if (res.success == true) {
        this.starRatingValue = res.result.npsSurveyStarRating;
        this.npsSurveyType = res.result.npsSurveyType;
        this.type.setValue('starRating');
      }
    })
  }
  search(page) {
    let body = {
      'formLabel': this.feedbackForm.controls.formLabel.value,
    }
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.getFeedback(body, page).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success) {
        this.feedbackData = res.result.data;
        this.totalPage = res.result.pageInfo.totalPage;
        this.currentPage = res.result.pageInfo.currentPage;
        if (page > this.totalPage) {
          this.search(1);
        }
        this.pageArray = this.getArrayOfPage(this.totalPage, this.currentPage);
      } else {
        this.errorMessage = res.message;
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
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

  showAllQuestions(categoryLabel: string) {
    this.showAll[categoryLabel] = !this.showAll[categoryLabel];

  }
  // confirmFeedback() {
  //   this.addFeedbackForm.markAllAsTouched();
  //   this.type.markAsTouched();
  //   this.scale.markAsTouched();
  //   if (this.type.value === 'Single_Text') {
  //     if (this.addFeedbackForm.invalid) {
  //       return;
  //     }
  //   } else {
  //     if (this.addFeedbackForm.invalid && this.type.invalid && this.scale.invalid) {
  //       return;
  //     }
  //   }
  //   let body = {
  //     "question": this.addFeedbackForm.controls.question.value,
  //     "type": this.type.value,
  //     ...(this.type.value === 'Star_Rating' && { starRatingScale: this.scale.value })
  //   }
  //   document.getElementById('loader')!.style.display = 'block';
  //   this.commonService.addFeedback(body).subscribe(res => {
  //     document.getElementById('loader')!.style.display = 'none';
  //     if (res.success == true) {
  //       this.modalService.dismissAll();
  //       this.successMessage = res.message;
  //       this.type.setValue("Single_Text")
  //       this.addFeedbackForm.reset();
  //       this.modalService.open(this.successModel);
  //       this.search(1);
  //     } else {
  //       this.modalService.dismissAll();
  //       this.errorMessage = res.message;
  //       this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
  //     }
  //   }, error => {
  //     document.getElementById('loader').style.display = 'none';
  //     this.errorMessage = "There is a problem processing your request. Please try again after some time.";
  //     this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
  //   });
  // }
  addNewQuestion(item) {
    this.isEditMode = false;
    this.currentItem = item
    this.editedId = item.formId
    this.modalService.open(this.addEditSurveyModal, { windowClass: 'faq-modal', backdrop: 'static', keyboard: false });
  }
  openEditConfirmational(item, formId) {
    this.isEditMode = true;
    this.editedId = formId;
    if (item.type == 'starRating') {
      this.starRating = true;
    } else {
      this.starRating = false
    }
    const found = this.npsSurveyType.find(t => t.key === item.type);
    let value = found ? found.value : '';
    this.type.setValue(value);
    this.currentItem = item
    this.scale.patchValue(item.starRatingScale)
    this.addFeedbackForm.patchValue({
      question: item.question,
      isActive: item.isActive === 'Y' || item.isActive === true,
    });
    this.modalService.dismissAll();
    this.modalService.open(this.addEditSurveyModal, { windowClass: 'faq-modal', backdrop: 'static', keyboard: false });

  }
  editFeedback() {
    let item = this.currentItem
    const questionType = this.type.value;
    this.addFeedbackForm.controls.question.markAsTouched();
    if (questionType === 'starRating') {
      this.scale.markAsTouched();

      if (this.addFeedbackForm.controls.question.invalid || this.scale.invalid) {
        return;
      }
    } else {
      if (this.addFeedbackForm.controls.question.invalid) {
        return; 
      }
    }
    let body;
    if (this.isEditMode == false) {
      body = {
        "addQuestions": [
          {
            "question": this.addFeedbackForm.controls.question.value,
            "isActive": true,
            "type": this.type.value,
            ...(item?.questions ? { sequence: item.questions.length + 1 } : {}),
            ...(this.type.value === 'starRating' && { starRatingScale: this.scale.value })

          }
        ]
      };

    } else {
      body = {
        "editQuestions": [{
          "question": this.addFeedbackForm.controls.question.value,
          "isActive": this.addFeedbackForm.controls.isActive.value,
          "id": item.questionId,
        }]
      }

    }
    this.modalService.dismissAll();
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.updateSurvey(this.editedId, body).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.isEditMode = false;
        this.modalService.dismissAll();
        this.successMessage = res.message;
        this.modalService.open(this.successModel);
        this.addFeedbackForm.reset();
        this.scale.reset();
        this.currentItem = {}
        this.type.setValue('starRating')
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
  deleteQuestion(item) {
    this.deleteId = item.formId;
    this.modalService.dismissAll();
    this.deleteMessage = "Are you sure you want to delete ?"
    this.modalService.open(this.deleteModal, { windowClass: 'error-modal' });
  }

  confirmDelete() {
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.deleteFeedback(this.deleteId).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.modalService.dismissAll();
        this.successMessage = res.message;
        this.modalService.open(this.successModel, { backdrop: 'static', keyboard: false });
        this.search(1);
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
      this.search(page);
    }
  }

  spaceRestrict(event: any) {
    if (event.target.selectionStart == 0 && event.code == 'Space')
      event.preventDefault();
  }
  addFeedback() {
    // this.modalService.open(this.addFeedbackModal, { windowClass: 'faq-modal', backdrop: 'static' });
    this.router.navigateByUrl('admin/add-survey');
  }

  addQuestion(id?: number) {
    if (id) {
      this.router.navigate(['admin/add-survey'], { queryParams: { id: id } });

    } else {
      this.router.navigateByUrl('admin/add-survey');
    }
  }

  changeStatus(id: number) {
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.changeStatus(id).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.modalService.dismissAll();
        this.successMessage = res.message;
        this.modalService.open(this.successModel, { backdrop: 'static', keyboard: false });
        this.search(1);
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

  closeModal() {
    this.modalService.dismissAll();
    this.addFeedbackForm.reset();
    this.scale.reset();
    this.type.setValue("starRating")
    this.isEditMode = false;
  }

}
