import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersTransactionHistoryComponent } from './users-transaction-history.component';

describe('UsersTransactionHistoryComponent', () => {
  let component: UsersTransactionHistoryComponent;
  let fixture: ComponentFixture<UsersTransactionHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersTransactionHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersTransactionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
