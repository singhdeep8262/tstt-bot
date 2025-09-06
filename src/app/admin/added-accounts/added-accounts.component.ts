import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/services/commonService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-added-accounts',
  templateUrl: './added-accounts.component.html',
  styleUrls: ['./added-accounts.component.css']
})
export class AddedAccountsComponent implements OnInit {
  @ViewChild('responseModel') responseModel: TemplateRef<any>;
  @ViewChild('successModel') successModel: TemplateRef<any>;
  successMessage: any;
  errorMessage: any;
  accountData: any;
  accountType = [];
  constructor(private router: Router, private route: ActivatedRoute, private commonService: CommonService, private modalService: NgbModal, private cookie_service: CookieService) { }
  ngOnInit() {
    this.accountData = this.commonService.getAccountDetails();
      document.getElementById('loader')!.style.display = 'block';
      if(this.accountData)
        document.getElementById('loader')!.style.display = 'none';

        let body = { "lookups": ["consumerAccountType"] };
        document.getElementById('loader').style.display = 'block';
        this.commonService.getLookups(body).subscribe(res => {
          document.getElementById('loader').style.display = 'none';
          if (res.success == true) {
            this.accountType = res.result.consumerAccountType;
          } else {
            this.accountType = [];
          }
        });
  }

  getLookups(value) {
    let element = this.accountType.filter(element => element.key == value)[0];
    if (element) {
      return element.value;
    }

  }

}
