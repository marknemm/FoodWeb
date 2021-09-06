import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageUsComponent } from './message-us.component';

describe('MessageUsComponent', () => {
  let component: MessageUsComponent;
  let fixture: ComponentFixture<MessageUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageUsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
