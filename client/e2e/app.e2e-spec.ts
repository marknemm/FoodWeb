import { NodeJsGettingStartedPage } from './app.po';

describe('node-js-getting-started App', () => {
  let page: NodeJsGettingStartedPage;

  beforeEach(() => {
    page = new NodeJsGettingStartedPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
