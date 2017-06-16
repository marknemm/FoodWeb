import { ReceiverPage } from './app.po';

describe('receiver App', () => {
  let page: ReceiverPage;

  beforeEach(() => {
    page = new ReceiverPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
