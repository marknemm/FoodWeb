import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AgreementBulletPointsComponent } from './agreement-bullet-points.component';

describe('AgreementBulletPointsComponent', () => {
  let component: AgreementBulletPointsComponent;
  let fixture: ComponentFixture<AgreementBulletPointsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AgreementBulletPointsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgreementBulletPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
