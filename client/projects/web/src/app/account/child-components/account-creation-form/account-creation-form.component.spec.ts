import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AccountCreationFormComponent } from './account-creation-form.component';

describe('AccountCreationFormComponent', () => {
  let component: AccountCreationFormComponent;
  let fixture: ComponentFixture<AccountCreationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountCreationFormComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountCreationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
