import 'jasmine';
import { DonationDetailsRouterLinkPipe } from './donation-details-router-link.pipe';

describe('DonationDetailsRouterLinkPipe', () => {
  it('create an instance', () => {
    const pipe = new DonationDetailsRouterLinkPipe();
    expect(pipe).toBeTruthy();
  });
});
