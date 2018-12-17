import { NodeJsGettingStartedPage } from './app.po';
describe('node-js-getting-started App', function () {
    var page;
    beforeEach(function () {
        page = new NodeJsGettingStartedPage();
    });
    it('should display message saying app works', function () {
        page.navigateTo();
        expect(page.getParagraphText()).toEqual('app works!');
    });
});
//# sourceMappingURL=app.e2e-spec.js.map