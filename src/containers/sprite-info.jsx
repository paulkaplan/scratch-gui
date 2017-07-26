import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';

import {connect} from 'react-redux';

import SpriteInfoComponent from '../components/sprite-info/sprite-info.jsx';

class SpriteInfo extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleChangeRotationStyle',
            'handleClickVisible',
            'handleClickNotVisible'
        ]);
    }
    handleChangeRotationStyle (e) {
        this.props.onChangeRotationStyle(e.target.value);
    }
    handleClickVisible (e) {
        e.preventDefault();
        this.props.onChangeVisibility(true);
    }
    handleClickNotVisible (e) {
        e.preventDefault();
        this.props.onChangeVisibility(false);
    }
    render () {
        return (
            <SpriteInfoComponent
                {...this.props}
                onChangeRotationStyle={this.handleChangeRotationStyle}
                onClickNotVisible={this.handleClickNotVisible}
                onClickVisible={this.handleClickVisible}
            />
        );
    }
}

SpriteInfo.propTypes = {
    ...SpriteInfoComponent.propTypes,
    onChangeDirection: PropTypes.func,
    onChangeName: PropTypes.func,
    onChangeRotationStyle: PropTypes.func,
    onChangeVisibility: PropTypes.func,
    onChangeX: PropTypes.func,
    onChangeY: PropTypes.func,
    x: PropTypes.number,
    y: PropTypes.number
};

const mapStateToProps = state => ({
    onChangeDirection: direction => state.vm.postSpriteInfo({direction}),
    onChangeX: x => state.vm.postSpriteInfo({x}),
    onChangeY: y => state.vm.postSpriteInfo({y}),
    onChangeVisibility: visible => state.vm.postSpriteInfo({visible}),
    onChangeRotationStyle: rotationStyle => state.vm.postSpriteInfo({rotationStyle}),
    onChangeName: name => state.vm.renameSprite(state.targets.editingTarget, name)
});

export default connect(mapStateToProps)(SpriteInfo);
