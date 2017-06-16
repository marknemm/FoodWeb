import { DonorPage } from './app.po';

describe('donor App', () => {
  let page: DonorPage;

  beforeEach(() => {
    page = new DonorPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
