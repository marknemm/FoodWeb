import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationEditComponent } from './donation-edit.component';

describe('DonationEditComponent', () => {
  let component: DonationEditComponent;
  let fixture: ComponentFixture<DonationEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
