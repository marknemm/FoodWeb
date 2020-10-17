import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppReceiverComponent } from './app-receiver.component';

describe('AppReceiverComponent', () => {
  let component: AppReceiverComponent;
  let fixture: ComponentFixture<AppReceiverComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppReceiverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppReceiverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
