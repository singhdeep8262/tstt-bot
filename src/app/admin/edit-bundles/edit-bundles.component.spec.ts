import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBundlesComponent } from './edit-bundles.component';

describe('EditBundlesComponent', () => {
  let component: EditBundlesComponent;
  let fixture: ComponentFixture<EditBundlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditBundlesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EditBundlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
