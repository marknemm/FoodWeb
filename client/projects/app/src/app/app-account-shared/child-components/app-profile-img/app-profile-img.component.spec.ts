import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppProfileImgComponent } from './app-profile-img.component';

describe('AppProfileImgComponent', () => {
  let component: AppProfileImgComponent;
  let fixture: ComponentFixture<AppProfileImgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppProfileImgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppProfileImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
