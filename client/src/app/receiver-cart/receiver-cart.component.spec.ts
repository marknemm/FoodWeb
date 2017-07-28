import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiverCartComponent } from './receiver-cart.component';

describe('ReceiverCartComponent', () => {
  let component: ReceiverCartComponent;
  let fixture: ComponentFixture<ReceiverCartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiverCartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiverCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
