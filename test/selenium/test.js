const path = require('path');
const test = require('tap').test;
const webdriver = require('selenium-webdriver');
const {By, until} = webdriver;

const uri = path.resolve(__dirname, '../../build/index.html');

const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

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
/* eslint-env jest */
import React from 'react'; // eslint-disable-line no-unused-vars
import {shallow} from 'enzyme';
import ButtonComponent from '../../../src/components/button/button'; // eslint-disable-line no-unused-vars
import renderer from 'react-test-renderer';

describe('ButtonComponent', () => {
    test('matches snapshot', () => {
        const onClick = jest.fn();
        const component = renderer.create(
            <ButtonComponent onClick={onClick}/>
        );
        expect(component.toJSON()).toMatchSnapshot();
    });

    test('triggers callback when clicked', () => {
        const onClick = jest.fn();
        const componentShallowWrapper = shallow(
            <ButtonComponent onClick={onClick}/>
        );
        componentShallowWrapper.simulate('click');
        expect(onClick).toHaveBeenCalled();
    });
});

describe('costumes, sounds and variables', t => {
    afterAll(() => {
        driver.quit();
    });

    test('opening file', () => {
        return driver.get('file://' + uri)

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
    })
});
