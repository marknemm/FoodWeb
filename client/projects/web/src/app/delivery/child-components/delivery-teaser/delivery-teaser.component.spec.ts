import { async, ComponentFixture, TestBed } from '@angular/core/testing';


import { DeliveryTeaserComponent } from './delivery-teaser.component';

describe('DeliveryTeaserComponent', () => {
  let component: DeliveryTeaserComponent;
  let fixture: ComponentFixture<DeliveryTeaserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryTeaserComponent ],

    }).compileComponents();

    fixture = TestBed.createComponent(DeliveryTeaserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
