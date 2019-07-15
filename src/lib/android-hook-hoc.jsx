import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash.omit';
import {connect} from 'react-redux';
import VM from 'scratch-vm';

import {activateTab, BLOCKS_TAB_INDEX} from '../reducers/editor-tab';

import log from '../lib/log';
import costumeLibraryContent from '../lib/libraries/costumes.json';
import spriteLibraryContent from '../lib/libraries/sprites.json';

/* Higher Order Component to provide behavior for hooking up to Android native code
 * @param {React.Component} WrappedComponent component to receive android hook prop
 * @returns {React.Component} component with android hooks
 */
const AndroidHookHOC = function (WrappedComponent) {
    class AndroidHookComponent extends React.Component {
        componentDidMount () {
            if (this.props.onSetCostumeAdder) {
                this.props.onSetCostumeAdder(this.handleAddCostume.bind(this));
            }
            if (this.props.onSetSpriteAdder) {
                this.props.onSetSpriteAdder(this.handleAddSprite.bind(this));
            }
        }
        componentWillUnmount () {
            if (this.props.onSetCostumeAdder) {
                this.props.onSetCostumeAdder(null);
            }
            if (this.props.onSetSpriteAdder) {
                this.props.onSetSpriteAdder(null);
            }
        }
        handleAddCostume (md5) {
            let item;
            for (const costume of costumeLibraryContent) {
                if (costume.md5 === md5) {
                    item = costume;
                    break;
                }
            }
            if (!item) {
                log.error(`Item not found! ${md5}`);
                return;
            }
            const split = item.md5.split('.');
            const type = split.length > 1 ? split[1] : null;
            const rotationCenterX = type === 'svg' ? item.info[0] : item.info[0] / 2;
            const rotationCenterY = type === 'svg' ? item.info[1] : item.info[1] / 2;
            const vmCostume = {
                name: item.name,
                md5: item.md5,
                rotationCenterX,
                rotationCenterY,
                bitmapResolution: item.info.length > 2 ? item.info[2] : 1,
                skinId: null
            };
            return this.props.vm.addCostumeFromLibrary(md5, vmCostume);
        }
        handleAddSprite (md5) {
            let item;
            for (const sprite of spriteLibraryContent) {
                if (sprite.md5 === md5) {
                    item = sprite;
                    break;
                }
            }
            if (!item) {
                log.error(`Item not found! ${md5}`);
                return;
            }
            return this.props.vm.addSprite(JSON.stringify(item.json)).then(() => {
                this.props.onActivateTab(BLOCKS_TAB_INDEX);
            });
        }
        render () {
            const componentProps = omit(this.props, ['onSetCostumeAdder, onSetSpriteAdder']);
            return (
                <WrappedComponent
                    {...componentProps}
                />
            );
        }
    }

    AndroidHookComponent.propTypes = {
        onActivateTab: PropTypes.func,
        onSetCostumeAdder: PropTypes.func,
        onSetSpriteAdder: PropTypes.func,
        vm: PropTypes.instanceOf(VM).isRequired
    };
    const mapStateToProps = state => ({
        vm: state.scratchGui.vm
    });
    const mapDispatchToProps = dispatch => ({
        onActivateTab: tab => dispatch(activateTab(tab))
    });
    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(AndroidHookComponent);
};

export {
    AndroidHookHOC as default
};
