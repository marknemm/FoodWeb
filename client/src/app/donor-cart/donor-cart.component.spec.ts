import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorCartComponent } from './donor-cart.component';

describe('DonorCartComponent', () => {
  let component: DonorCartComponent;
  let fixture: ComponentFixture<DonorCartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonorCartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonorCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
