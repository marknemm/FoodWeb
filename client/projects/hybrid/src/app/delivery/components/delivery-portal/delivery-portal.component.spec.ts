import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryPortalComponent } from './delivery-portal.component';

describe('DeliveryPortalComponent', () => {
  let component: DeliveryPortalComponent;
  let fixture: ComponentFixture<DeliveryPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryPortalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
