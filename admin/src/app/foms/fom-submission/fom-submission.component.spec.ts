import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FomSubmissionComponent } from './fom-submission.component';

describe('FomSubmissionComponent', () => {
  let component: FomSubmissionComponent;
  let fixture: ComponentFixture<FomSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FomSubmissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FomSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
