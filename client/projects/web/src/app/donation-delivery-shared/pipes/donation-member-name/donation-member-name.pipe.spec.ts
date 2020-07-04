import { DonationMemberNamePipe } from './donation-member-name.pipe';

describe('DonationMemberNamePipe', () => {
  it('create an instance', () => {
    const pipe = new DonationMemberNamePipe();
    expect(pipe).toBeTruthy();
  });
});
