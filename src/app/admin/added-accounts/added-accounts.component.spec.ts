import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddedAccountsComponent } from './added-accounts.component';

describe('AddedAccountsComponent', () => {
  let component: AddedAccountsComponent;
  let fixture: ComponentFixture<AddedAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddedAccountsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddedAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
