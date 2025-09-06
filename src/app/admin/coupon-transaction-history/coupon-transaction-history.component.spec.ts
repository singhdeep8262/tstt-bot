import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponTransactionHistoryComponent } from './coupon-transaction-history.component';

describe('CouponTransactionHistoryComponent', () => {
  let component: CouponTransactionHistoryComponent;
  let fixture: ComponentFixture<CouponTransactionHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CouponTransactionHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CouponTransactionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
