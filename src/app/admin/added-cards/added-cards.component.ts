
import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/services/commonService';

@Component({
  selector: 'app-added-cards',
  templateUrl: './added-cards.component.html',
  styleUrls: ['./added-cards.component.css']
})
export class AddedCardsComponent implements OnInit {

  constructor(private commonService: CommonService) { }

  CardDetails: any;

  ngOnInit(): void {
    this.CardDetails = this.commonService.getCardsDetails();
  }
}
