import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformReportsComponent } from './platform-reports.component';

describe('PlatformReportsComponent', () => {
  let component: PlatformReportsComponent;
  let fixture: ComponentFixture<PlatformReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlatformReportsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PlatformReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
