import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import 'jasmine';
import { AdminAccountCreateComponent } from './admin-account-create.component';

describe('AdminAccountCreateComponent', () => {
  let component: AdminAccountCreateComponent;
  let fixture: ComponentFixture<AdminAccountCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAccountCreateComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminAccountCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
