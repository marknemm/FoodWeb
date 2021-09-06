import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationWorkflowComponent } from './donation-workflow.component';

describe('DonationWorkflowComponent', () => {
  let component: DonationWorkflowComponent;
  let fixture: ComponentFixture<DonationWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
