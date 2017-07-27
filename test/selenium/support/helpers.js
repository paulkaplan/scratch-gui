/* eslint-env jest */
const path = require('path');
const webdriver = require('selenium-webdriver');
const {By, until} = webdriver;

const uri = path.resolve(__dirname, '../../../build/index.html');

const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

const load = () => driver.get('file://' + uri);

const clickScriptsTab = () => driver.findElement(By.id('react-tabs-0')).click();
const clickCostumeTab = () => driver.findElement(By.id('react-tabs-2')).click();
const clickSoundsTab = () => driver.findElement(By.id('react-tabs-4')).click();

const findByXpath = (xpath) => {
    return driver.wait(until.elementLocated(By.xpath(xpath), 5 * 1000));
};

const clickXpath = (xpath) => {
    return findByXpath(xpath).then(el => el.click());
};

const clickText = (text) => {
    return clickXpath(`//*[contains(text(), '${text}')]`);
};

const clickButton = (text) => {
    return clickXpath(`//button[contains(text(), '${text}')]`);
};

export {
    driver,
    load,
    clickScriptsTab,
    clickCostumeTab,
    clickSoundsTab,
    findByXpath,
    clickText,
    clickButton
};
