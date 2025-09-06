import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlatformReportComponent } from './add-platform-report.component';

describe('AddPlatformReportComponent', () => {
  let component: AddPlatformReportComponent;
  let fixture: ComponentFixture<AddPlatformReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddPlatformReportComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddPlatformReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
