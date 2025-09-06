import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfuencerCouponTransactionReportComponent } from './infuencer-coupon-transaction-report.component';

describe('InfuencerCouponTransactionReportComponent', () => {
  let component: InfuencerCouponTransactionReportComponent;
  let fixture: ComponentFixture<InfuencerCouponTransactionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfuencerCouponTransactionReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfuencerCouponTransactionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
