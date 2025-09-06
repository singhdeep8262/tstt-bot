import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedeemedCouponTransactionHistoryComponent } from './redeemed-coupon-transaction-history.component';

describe('RedeemedCouponTransactionHistoryComponent', () => {
  let component: RedeemedCouponTransactionHistoryComponent;
  let fixture: ComponentFixture<RedeemedCouponTransactionHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedeemedCouponTransactionHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedeemedCouponTransactionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
