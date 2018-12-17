import { browser, element, by } from 'protractor';
var NodeJsGettingStartedPage = (function () {
    function NodeJsGettingStartedPage() {
    }
    NodeJsGettingStartedPage.prototype.navigateTo = function () {
        return browser.get('/');
    };
    NodeJsGettingStartedPage.prototype.getParagraphText = function () {
        return element(by.css('app-root h1')).getText();
    };
    return NodeJsGettingStartedPage;
}());
export { NodeJsGettingStartedPage };
//# sourceMappingURL=app.po.js.map