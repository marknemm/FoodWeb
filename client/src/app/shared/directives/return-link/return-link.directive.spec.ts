import { Router, ActivatedRoute } from '@angular/router';
import { fakeAsync, flush } from '@angular/core/testing';
import { ReturnLinkDirective } from './return-link.directive';

describe('ReturnLinkDirective', () => {
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let directive: ReturnLinkDirective;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj<Router>(['navigate']);
    mockActivatedRoute = jasmine.createSpyObj(['']);
    (<any>mockActivatedRoute).snapshot = {
      url: 'mock/url',
      queryParams: {
        param1: 'value1',
        param2: 'value2'
      }
    };
    directive = new ReturnLinkDirective(mockRouter, mockActivatedRoute);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should correctly add return fragment (id) to current URL on click', () => {
    directive.returnFragment = 'mock-return-fragment';
    directive.onclick();
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      [mockActivatedRoute.snapshot.url],
      {
        fragment: directive.returnFragment,
        queryParams: mockActivatedRoute.snapshot.queryParams,
        replaceUrl: true
      }
    );
  });

  it('should correctly route to target link', fakeAsync(() => {
    directive.routerLink = ['mock/router/link'];
    directive.queryParams = { paramT1: 'valueT1', paramT2: 'valueT2' };
    directive.state = { prop1: 'value1', prop2: 'value2' };
    directive.onclick();
    flush();
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      directive.routerLink,
      {
        queryParams: directive.queryParams,
        state: directive.state
      }
    );
  }));
});
