import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDeliveryDetailsComponent } from './app-delivery-details.component';

describe('AppDeliveryDetailsComponent', () => {
  let component: AppDeliveryDetailsComponent;
  let fixture: ComponentFixture<AppDeliveryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppDeliveryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppDeliveryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
