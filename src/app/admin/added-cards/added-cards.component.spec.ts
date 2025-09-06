import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddedCardsComponent } from './added-cards.component';

describe('AddedCardsComponent', () => {
  let component: AddedCardsComponent;
  let fixture: ComponentFixture<AddedCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddedCardsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddedCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
