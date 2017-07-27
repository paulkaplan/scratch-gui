/* eslint-env jest */
import React from 'react'; // eslint-disable-line no-unused-vars
import {mount} from 'enzyme';
import configureStore from 'redux-mock-store';
import {Provider} from 'react-redux'; // eslint-disable-line no-unused-vars
import renderer from 'react-test-renderer';

import SpriteInfo from '../../../src/containers/sprite-info'; // eslint-disable-line no-unused-vars

describe('SpriteSelectorItem Container', () => {
    const mockStore = configureStore();
    let vm;
    let targets;
    let store;
    const getContainer = function () {
        return (
            <Provider store={store}>
                <SpriteInfo
                    x={100}
                    y={-100}
                    direction={50}
                    name={'name'}
                />
            </Provider>
        );
    };

    beforeEach(() => {
        vm = {
            postSpriteInfo: jest.fn(),
            renameSprite: jest.fn()
        };
        targets = {
            editingTarget: 'TARGET'
        };
        store = mockStore({vm, targets});
    });

    test('matches the snapshot', () => {
        const component = renderer.create(getContainer());
        expect(component.toJSON()).toMatchSnapshot();
    });

    test('should use the vm#postSpriteInfo callback for x input', () => {
        const wrapper = mount(getContainer());
        wrapper.find('input[placeholder="x"]').simulate('change', {target: {value: '123'}});
        wrapper.find('input[placeholder="x"]').simulate('keypress', {key: 'Enter'});
        expect(vm.postSpriteInfo).toBeCalledWith({x: 123});
    });

    test('should use the vm#postSpriteInfo callback for y input', () => {
        const wrapper = mount(getContainer());
        wrapper.find('input[placeholder="y"]').simulate('change', {target: {value: '5'}});
        wrapper.find('input[placeholder="y"]').simulate('blur');
        expect(vm.postSpriteInfo).toBeCalledWith({y: 5});
    });

    test('should use the vm#renameSprite callback for name', () => {
        const input = mount(getContainer()).find('input[placeholder="Name"]');
        input.simulate('change', {target: {value: 'cat cat'}});
        input.simulate('blur');
        expect(vm.renameSprite).toBeCalledWith('TARGET', 'cat cat');
    });
});
