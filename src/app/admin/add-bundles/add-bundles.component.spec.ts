import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBundlesComponent } from './add-bundles.component';

describe('AddBundlesComponent', () => {
  let component: AddBundlesComponent;
  let fixture: ComponentFixture<AddBundlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddBundlesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddBundlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
