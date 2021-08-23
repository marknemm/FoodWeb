import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupInfoComponent } from './pickup-info.component';

describe('PickupInfoComponent', () => {
  let component: PickupInfoComponent;
  let fixture: ComponentFixture<PickupInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickupInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PickupInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
