/* eslint-env jest */
import {
    driver,
    load,
    clickScriptsTab,
    clickCostumeTab,
    clickSoundsTab,
    findByXpath,
    clickText,
    clickButton
} from './support/helpers';

describe('costumes, sounds and variables', () => {
    afterEach(() => {
        driver.quit();
    });

    test('opening the file', () => {
        const promise = load()
        .then(() => clickCostumeTab())
        .then(() => clickText('Add Costume'))
        .then(() => findByXpath("//input[@placeholder='what are you looking for?']"))
        .then((el) => el.sendKeys('abb'))
        .then(() => clickText('abby-a')) // Should close the modal, then click the costumes in the selector
        .then(() => clickText('costume1'))
        .then(() => clickText('abby-a'))

        .then(() => clickSoundsTab())
        .then(() => clickText('Add Sound'))
        .then(() => findByXpath("//input[@placeholder='what are you looking for?']"))
        .then((el) => el.sendKeys('chom'))
        .then(() => clickText('chomp')) // Should close the modal, then click the sounds in the selector
        .then(() => clickText('meow'))
        .then(() => clickText('chomp'))

        .then(() => clickScriptsTab())
        .then(() => clickText('Data'))
        .then(() => clickText('Create variable...'))
        .then(() => findByXpath("//input[@placeholder='']"))
        .then((el) => el.sendKeys('score'))
        .then(() => clickButton('OK'))
        .then(() => driver.manage().logs().get('browser')) // eslint-disable-line newline-per-chained-call
        .then(logs => {
            expect(logs).toEqual([]);
        });
        return promise;
    }, 20000);
});
