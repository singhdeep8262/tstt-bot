import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundPaymentComponent } from './refund-payment.component';

describe('RefundPaymentComponent', () => {
  let component: RefundPaymentComponent;
  let fixture: ComponentFixture<RefundPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefundPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefundPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
