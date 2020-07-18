import { TestBed } from '@angular/core/testing';
import 'jasmine';
import { CodePushService } from './code-push.service';

describe('CodePushService', () => {
  let service: CodePushService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodePushService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
