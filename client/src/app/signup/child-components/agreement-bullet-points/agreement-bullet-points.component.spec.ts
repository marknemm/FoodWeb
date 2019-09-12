import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreementBulletPointsComponent } from './agreement-bullet-points.component';

describe('AgreementBulletPointsComponent', () => {
  let component: AgreementBulletPointsComponent;
  let fixture: ComponentFixture<AgreementBulletPointsComponent>;

  beforeEach(async(() => {
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
