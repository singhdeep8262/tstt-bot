import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "../../../services/commonService";
import { CookieService } from 'ngx-cookie';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  @ViewChild('responseModel') responseModel: TemplateRef<any>;
  @ViewChild('deleteModel') deleteModel: TemplateRef<any>;
  @ViewChild('successModel') successModel: TemplateRef<any>;
  @ViewChild('updateModel') updateModel: TemplateRef<any>;
  @ViewChild('addFaqModel') addFaqModel: TemplateRef<any>;
  @ViewChild('editLabelModel') editLabelModel: TemplateRef<any>;
  @ViewChild('addQuestionModal') addQuestionModal: TemplateRef<any>;
  @ViewChild('answerContent', { static: false }) answerContent!: ElementRef<HTMLDivElement>;

  showTableGrid = false;
  selectedRows = 0;
  selectedCols = 0;
  isEditTitle = false;
  pageInfo: any;
  errorMessage: any;
  pageArray: any = [];
  totalPage = 1;
  currentPage = 1;
  deleteMessage: any;
  successMessage: any;
  faqForm = new FormGroup({
    label: new FormControl('')
  });
  labelName = new FormControl('', Validators.required);
  isLabelActive = new FormControl(false);
  addFaqForm = new FormGroup({
    label: new FormControl('', Validators.required),
    question: new FormControl('', Validators.required),
    isActive: new FormControl(false)
  });
  faqLabel = "";
  dummyData = []
  openedAnswers: { [key: string]: boolean } = {};
  showAll: { [key: string]: boolean } = {};
  faqList: any = [];
  deletedFaq: any;
  selectedFaq: any;
  isEditMode: boolean = false
  counter = 1;
  active: any;
  labelId: any;
  addOnlyQuestion: boolean = false;

  constructor(private sanitizer: DomSanitizer, private commonService: CommonService, private router: Router, private cookie_service: CookieService, private modalService: NgbModal) { }



  ngOnInit(): void {
    this.search(1);
  }
  editLabel() {
    this.isEditTitle = true;
  }
  // saveLabel() {
  //   this.isEditTitle = false;
  //   this.faqLabel = this.addFaqForm.get('label')?.value;
  //   this.isLabelActive = this.addFaqForm.get('isLabelActive')?.value;
  // }
  groupApiData() {
    if (this.dummyData) {
      const grouped = Object.keys(this.dummyData).map(categoryKey => {
        const categoryData = this.dummyData[categoryKey];
        return {
          label: categoryKey,
          labelId: categoryData.labelId,
          isActive: categoryData.isActive === 'Y',
          questions: categoryData.faqs.map((faq: any) => ({
            id: faq.id,
            question: faq.question,
            answer: faq.answer,
            isActive: faq.isActive === 'Y',
            createdAt: faq.createdAt,
            updatedAt: faq.updatedAt
          }))
        };
      });

      this.faqList = grouped;
      this.faqList.forEach((category: any) => {
        this.showAll[category.label] = false;
        this.faqLabel = category.label;
        category.questions.forEach((_: any, i: number) => {
          this.openedAnswers[`${category.label}-${i}`] = false;
        });
      });
    }
  }
  editFAQLabel(faq) {
    this.addOnlyQuestion = false;
    this.isLabelActive.setValue(faq.isActive);
    this.labelId = faq.labelId;
    this.labelName.setValue(faq.label);
    this.modalService.open(this.editLabelModel, { backdrop: 'static', keyboard: false });
  }
  updateLabel() {
    let body = {
      "label": this.labelName.value,
      "isActive": this.isLabelActive.value ? "Y" : "N",
    }

    document.getElementById('loader')!.style.display = 'block';
    this.commonService.editfaqLabel(this.labelId, body).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.isEditMode = false;
        this.modalService.dismissAll();
        this.successMessage = res.message;
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
  search(page: number) {
    let body = {
      "label": this.faqForm.controls.label.value,
      "labelId": ""
    };
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.getFaqList(body, page).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success) {
        this.dummyData = res.result.data;
        this.totalPage = res.result.pageInfo.totalPage;
        this.currentPage = res.result.pageInfo.currentPage;
        this.groupApiData();
        if (page > this.totalPage) {
          this.search(1);
        }
        this.pageArray = this.getArrayOfPage(this.totalPage, this.currentPage);
      } else {
        this.errorMessage = res.message;
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
        this.dummyData = [];
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
  letterOnly(event) {
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
      this.search(page);
    }
  }

  spaceRestrict(event: any) {
    if (event.target.selectionStart == 0 && event.code == 'Space')
      event.preventDefault();
  }

  closeModal() {
    this.modalService.dismissAll();
    this.addFaqForm.reset();
    this.isEditMode = false;
  }
  // To Open Delete Confirmation Modal
  deleteQuestion(id) {
    this.deletedFaq = id;
    this.modalService.dismissAll();
    this.deleteMessage = "Are you sure you want to delete ?"
    this.modalService.open(this.deleteModel, { windowClass: 'error-modal' });
  }
  confirmDelete() {
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.DeleteFaq(this.deletedFaq).subscribe(res => {
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

  OpenFaqModal() {
    this.addOnlyQuestion = false
    this.modalService.dismissAll();
    this.modalService.open(this.addFaqModel, { windowClass: 'faq-modal', backdrop: 'static' });
  }

  //  To Show or Hide Answer
  showAnswer(categoryIndex: number, questionIndex: number): void {
    const key = `${categoryIndex}-${questionIndex}`;
    this.openedAnswers[key] = !this.openedAnswers[key];
  }
  // To show All questions of an label 
  showAllQuestions(categoryLabel: string) {
    this.showAll[categoryLabel] = !this.showAll[categoryLabel];

  }

  confirmEdit(faq) {
    const answerHTML = document.getElementById('answerContent')?.innerHTML?.trim() || '';
    const question = this.addFaqForm.controls.question.value;
    if (!question || !answerHTML || answerHTML === '<br>') {
      this.modalService.dismissAll();
      this.errorMessage = "Please fill all required fields.";
      this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      return;
    }
    let body = {
      // "label": this.addFaqForm.controls.label.value,
      "question": question,
      "answer": answerHTML,
      "isActive": this.addFaqForm.value.isActive ? "Y" : "N",
      "labelId": faq.labelId
    }
    this.modalService.dismissAll();
    this.modalService.open(this.addFaqModel, { windowClass: 'faq-modal' });
    document.getElementById('loader')!.style.display = 'block';
    this.commonService.UpdateFaq(faq.id, body).subscribe(res => {
      document.getElementById('loader')!.style.display = 'none';
      if (res.success == true) {
        this.isEditMode = false;
        this.modalService.dismissAll();
        this.successMessage = res.message;
        this.modalService.open(this.successModel);
        this.addFaqForm.reset();
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


  toggleTableGrid() {
    this.showTableGrid = !this.showTableGrid;
  }

  highlightGrid(rows: number, cols: number) {
    this.selectedRows = rows;
    this.selectedCols = cols;
  }

  hideTableGrid() {
    this.selectedRows = 0;
    this.selectedCols = 0;
    this.showTableGrid = false;
  }

  insertTable(rows: number, cols: number) {
    const answerDiv = document.getElementById('answerContent');
    if (!answerDiv) return;

    answerDiv.focus();
    this.setCursorToEnd(answerDiv); 
    const selection = window.getSelection();
    if (!selection) return;
    if (this.savedSelection) {
      selection.removeAllRanges();
      selection.addRange(this.savedSelection);
    } else {
      const range = document.createRange();
      range.selectNodeContents(answerDiv);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    const range = selection.getRangeAt(0);
    const table = document.createElement('table');
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';
    table.style.marginTop = '8px';

    for (let i = 0; i < rows; i++) {
      const tr = document.createElement('tr');
      for (let j = 0; j < cols; j++) {
        const td = document.createElement('td');
        td.textContent = ' ';
        td.style.border = '1px solid #000';
        td.style.padding = '6px';
        td.style.minWidth = '50px';
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }

    range.collapse(false);
    range.insertNode(table);

    const br = document.createElement('br');
    table.after(br);

    const newRange = document.createRange();
    newRange.setStartAfter(br);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);

    this.savedSelection = null;
    this.showTableGrid = false;
  }

  insertUnorderedList() {
      const answerContent = document.getElementById('answerContent');
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    answerContent.focus();
    this.setCursorToEnd(answerContent); 
    const range = selection.getRangeAt(0);
    const ul = document.createElement('ul');
    const li = document.createElement('li');
    ul.appendChild(li);
    range.deleteContents();
    range.insertNode(ul);
    const newRange = document.createRange();
    newRange.selectNodeContents(li);
    newRange.collapse(false);
    selection.removeAllRanges();
    selection.addRange(newRange);
  }

  insertOrderedList() {
      const answerContent = document.getElementById('answerContent');
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
   answerContent.focus();
   this.setCursorToEnd(answerContent); 
    const range = selection.getRangeAt(0);
    const ol = document.createElement('ol');
    const li = document.createElement('li');
    ol.appendChild(li);
    range.deleteContents();
    range.insertNode(ol);
    const newRange = document.createRange();
    newRange.selectNodeContents(li);
    newRange.collapse(false);
    selection.removeAllRanges();
    selection.addRange(newRange);
  }

  setCursorToEnd(el: HTMLElement) {
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);

  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
}

  handleEnterInTextArea(event: KeyboardEvent) {
    if (event.key !== 'Enter') return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const node = range.startContainer;
    const currentText = node.textContent || '';

    const matchBullet = currentText.trim().startsWith('•');
    const matchNumber = currentText.trim().match(/^(\d+)\./);

    if (matchBullet || matchNumber) {
      event.preventDefault();

      let prefix = '';
      if (matchBullet) {
        prefix = '• ';
      } else if (matchNumber) {
        const currentNumber = parseInt(matchNumber[1], 10);
        prefix = `${currentNumber + 1}. `;
      }

      const br = document.createElement('br');
      const span = document.createElement('span');
      span.textContent = prefix;

      // Insert new line with prefix
      range.deleteContents();
      range.insertNode(br);
      range.collapse(false);
      range.insertNode(span);

      // Move caret to end of inserted prefix
      const newRange = document.createRange();
      newRange.setStart(span, 1);
      newRange.collapse(true);

      selection.removeAllRanges();
      selection.addRange(newRange);
    }
  }

  insertAtCursor(text: string) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const textNode = document.createTextNode(text);

    range.deleteContents();
    range.insertNode(textNode);

    // Move cursor to the end of inserted text
    const newRange = document.createRange();
    newRange.setStartAfter(textNode);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);
  }
  openQuestionModal(categoryLabel: any) {
    this.isEditMode = false;
    this.addOnlyQuestion = true;
    this.addFaqForm.reset();
    this.labelId = categoryLabel.labelId;

    if (categoryLabel) {
      this.addFaqForm.patchValue({ label: categoryLabel.label });
    }

    const modalRef = this.modalService.open(this.addQuestionModal, {
      windowClass: 'faq-modal',
      backdrop: 'static'
    });

    // Otherwise just wait a bit longer
    setTimeout(() => {
      const element = document.getElementById('answerContent');
    }, 300); // Give it more time if needed
  }
  addNewFaq() {
    const answerHTML = document.getElementById('answerContent')?.innerHTML?.trim() || '';
    const question = this.addFaqForm.controls.question.value;
    const label = this.addFaqForm.controls.label.value;

 
    let body;
    if (this.addOnlyQuestion) {
      body = {
        labelId: this.labelId,
        label: label,
        question: question,
        answer: answerHTML,
        isActive: this.addFaqForm.value.isActive ? "Y" : "N",
      };
    }
    else {
      body = {
        // labelId: this.labelId,
        label: label,
        question: question,
        answer: answerHTML,
        isActive: this.addFaqForm.value.isActive ? "Y" : "N",
      };
    }

    document.getElementById('loader')!.style.display = 'block';

    this.commonService.createNewFaq(body).subscribe(
      res => {
        document.getElementById('loader')!.style.display = 'none';
        if (res.success == true) {
          this.modalService.dismissAll();
          this.successMessage = res.message;
          this.modalService.open(this.successModel);
          this.search(1);
        } else {
          this.modalService.dismissAll();
          this.errorMessage = res.message;
          this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
        }
      },
      error => {
        document.getElementById('loader')!.style.display = 'none';
        this.errorMessage = "There is a problem processing your request. Please try again after some time.";
        this.modalService.open(this.responseModel, { windowClass: 'error-modal' });
      }
    );
  }

  openEditModal(faq: any, heading: any) {
    this.selectedFaq = faq;
    this.isEditMode = true;

    this.addFaqForm.patchValue({
      label: heading || '',
      question: faq.question || '',
      isActive: faq.isActive === 'Y' || faq.isActive === true
    });

    this.modalService.dismissAll();

    const modalRef = this.modalService.open(this.addQuestionModal, {
      windowClass: 'faq-modal',
      backdrop: 'static',
      keyboard: false
    });

    setTimeout(() => {
      const answerDiv = document.getElementById('answerContent');
      if (answerDiv) {
        answerDiv.innerHTML = faq.answer || '';
      }
    }, 0);
  }

  savedSelection: Range | null = null;
  saveSelection() {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      this.savedSelection = selection.getRangeAt(0);
    }
  }

  getSanitizedAnswer(answer: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(answer);
  }

}

