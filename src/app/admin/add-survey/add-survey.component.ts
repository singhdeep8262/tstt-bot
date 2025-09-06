import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/services/commonService';

@Component({
  selector: 'app-add-survey',
  templateUrl: './add-survey.component.html',
  styleUrls: ['./add-survey.component.css']
})
export class AddSurveyComponent implements OnInit {
  @ViewChild('responseModel') responseModel: TemplateRef<any>;
  @ViewChild('confirmationModal') confirmationModal: TemplateRef<any>;
  @ViewChild('deleteModal') deleteModal: TemplateRef<any>;
  @ViewChild('successModel') successModel: TemplateRef<any>

  feedbackData: any;
  errorMessage: any;
  showAll: { [key: string]: boolean } = {};
  isEditMode: boolean = false;
  isSurveyCreated: boolean = false;
  id: string | null = null;
  starRatingValue: any = [''];
  editIndex: number | null = null;
  questions: any[] = [];
  isEditTitle = false;
  surveyTitle: string = '';
  surveyForm = new FormGroup({
    surveyName: new FormControl('', Validators.required),
    question: new FormControl('', Validators.required),
  });
  surveyQuestion = new FormControl('', Validators.required)
  type = new FormControl('starRating',Validators.required);
  scale = new FormControl('', Validators.required);
  successMessage: any;
  isEditQuestion = false;
  npsSurveyType: any;
  constructor(private router: Router, private commonService: CommonService, private route: ActivatedRoute, private modalService: NgbModal) { }

  ngOnInit(): void {
    document.getElementById('loader')!.style.display = 'block';
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.getSurveydata(1);
      }
    });
    let lookupBody = { "lookups": ["npsSurveyStarRating","npsSurveyType"] };
    this.commonService.getLookups(lookupBody).subscribe(res => {
      document.getElementById('loader').style.display = 'none';
      if (res.success == true) {
        this.starRatingValue = res.result.npsSurveyStarRating;
        this.npsSurveyType=res.result.npsSurveyType;
          this.type.setValue('starRating');
      }
    })

  }

  getStars(n: number): any[] {
  return Array.from({ length: Number(n) });
}

  spaceRestrict(event: any) {
    if (event.target.selectionStart == 0 && event.code == 'Space')
      event.preventDefault();
  }

  onCancel() {
    // this.modalService.open(this.deleteModal);
    this.router.navigateByUrl('admin/survey-management');
  }
  editSurveyName(){
    this.isEditTitle=true;
  }
saveSurveyName() {
  this.isEditTitle = false;
  this.surveyTitle = this.surveyForm.get('surveyName')?.value;
}
onReset() {
    this.surveyForm.reset();
    this.type.setValue('starRating');
    this.scale.reset();
    if (this.questions.length == 1) {
      this.questions = [];
    }
    this.isSurveyCreated = false;
  }

  onSave() {
    if (!this.surveyForm.valid && this.questions.length === 0) {
      this.errorMessage = "Please enter survey title and at least one question.";
      this.modalService.dismissAll();
      this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      return;
    }
    this.surveyTitle = this.surveyForm.get('surveyName')?.value;
    this.addQuestion();
    this.modalService.open(this.confirmationModal);
  }

  confirmCancel() {
    this.router.navigateByUrl('admin/survey-management');
    this.modalService.dismissAll();
  }

  mapType(type: string): string {
    switch (type) {
      case 'starRating': return 'starRating';
      case 'feedback': return 'feedback';
      default: return type;
    }
  }

  confirmSave() {
    const currentSurveyTitle = this.surveyForm.get('surveyName')?.value;
    this.surveyTitle = currentSurveyTitle;
    const payload = {
      formLabel: this.surveyForm.controls.surveyName.value,
      questions: this.questions.map((q, index) => {
        const baseQuestion = {
          question: q.question,
          type: this.mapType(q.type),
          comments: "",
          sequence: index + 1,
          isActive: true
        };

        if (q.type === 'starRating') {
          return {
            ...baseQuestion,
            starRatingScale: parseInt(q.StarRatingScale)
          };
        }

        return baseQuestion;
      })
    };

    document.getElementById('loader')!.style.display = 'block';
    this.commonService.addFeedback(payload).subscribe(
      res => {
        document.getElementById('loader').style.display = 'none';
        if (res.success) {
          this.modalService.dismissAll();
          this.router.navigateByUrl('admin/survey-management');
          this.successMessage = res.message;
          this.modalService.open(this.successModel);
        } else {
          this.errorMessage = res.message;
          this.modalService.dismissAll();
          this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
          if (this.questions.length == 1) {
            this.questions = [];
            // this.surveyForm.reset();
            // this.type.setValue('Single_Text');
            // this.scale.reset();
          }
        }
      },
      error => {
        document.getElementById('loader').style.display = 'none';
        this.errorMessage = "Something went wrong. Please try again.";
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
    );

  }

  getSurveydata(page: number) {
    let body;
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.getFeedback(body, page, this.id).subscribe(
      res => {
        document.getElementById('loader').style.display = 'none';
        if (res.success) {
          this.feedbackData = res.result.data;
          this.isEditMode = true;
        }
      },
      error => {
        document.getElementById('loader')!.style.display = 'none';
        this.errorMessage = "There is a problem processing your request. Please try again after some time.";
      }
    );
  }
  deleteQuestion(index: number) {
    this.questions.splice(index, 1);
  }

  editQuestion(index: number) {
    this.editIndex = index;
    this.surveyForm.get('question')?.setValue(this.questions[index].question);
  }

  updateQuestion(index: number) {
    if (this.surveyForm.get('question')?.valid) {
      this.questions[index].question = this.surveyForm.get('question')?.value;
      this.editIndex = null;
      this.surveyForm.get('question')?.reset();
    }
  }



  addQuestion() {
    if (this.surveyForm.invalid || this.type.invalid || (this.type.value === 'starRating' && this.scale.invalid)) {
      this.surveyForm.markAllAsTouched();
      this.type.markAsTouched();
      this.scale.markAsTouched();
      return;
    }

    const questionObj = {
      question: this.surveyForm.value.question,
      type: this.type.value,
      StarRatingScale: this.type.value === 'starRating' ? this.scale.value : null
    };
    this.surveyTitle = this.surveyForm.value.surveyName;

    if (this.editIndex !== null) {
      this.questions[this.editIndex] = questionObj;
      this.editIndex = null; // Reset edit mode
    } else {
      this.questions.push(questionObj);
      if (!this.isSurveyCreated) {
        this.isSurveyCreated = true;
      }
    }

    this.surveyForm.get('surveyName')?.setValue(this.surveyTitle);
    this.surveyForm.get('question')?.reset();
    this.type.setValue("starRating");
    this.scale.reset();
      }


  closeModal() {
    this.modalService.dismissAll();
    this.scale.reset();
  }
}
