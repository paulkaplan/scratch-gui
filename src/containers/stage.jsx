import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import Renderer from 'scratch-render';
import AudioEngine from 'scratch-audio';
import VM from 'scratch-vm';

import StageComponent from '../components/stage/stage.jsx';

class Stage extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'attachMouseEvents',
            'cancelMouseDownTimeout',
            'detachMouseEvents',
            'handleDoubleClick',
            'onMouseUp',
            'onMouseMove',
            'onMouseDown',
            'onTouchStart',
            'onTouchMove',
            'onTouchEnd',
            'onStartDrag',
            'onStopDrag',
            'updateRect',
            'setCanvas'
        ]);
        this.state = {
            mouseDownTimeoutId: null,
            mouseDownPosition: null,
            isDragging: false,
            dragOffset: null,
            dragId: null
        };
    }
    componentDidMount () {
        this.attachRectEvents();
        this.attachMouseEvents(this.canvas);
        this.updateRect();
        this.renderer = new Renderer(this.canvas);
        this.props.vm.attachRenderer(this.renderer);
        this.audioEngine = new AudioEngine();
        this.props.vm.attachAudioEngine(this.audioEngine);
    }
    shouldComponentUpdate (nextProps) {
        return this.props.width !== nextProps.width || this.props.height !== nextProps.height;
    }
    componentWillUnmount () {
        this.detachMouseEvents(this.canvas);
        this.detachRectEvents();
    }
    attachMouseEvents (canvas) {
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('touchmove', this.onTouchMove);
        document.addEventListener('mouseup', this.onMouseUp);
        document.addEventListener('touchend', this.onTouchEnd);
        canvas.addEventListener('mousedown', this.onMouseDown);
        canvas.addEventListener('touchstart', this.onTouchStart);
    }
    detachMouseEvents (canvas) {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('touchmove', this.onTouchMove);
        document.removeEventListener('mouseup', this.onMouseUp);
        document.removeEventListener('touchend', this.onTouchEnd);
        canvas.removeEventListener('mousedown', this.onMouseDown);
        canvas.removeEventListener('touchstart', this.onTouchStart);
    }
    attachRectEvents () {
        window.addEventListener('resize', this.updateRect);
        window.addEventListener('scroll', this.updateRect);
    }
    detachRectEvents () {
        window.removeEventListener('resize', this.updateRect);
        window.removeEventListener('scroll', this.updateRect);
    }
    updateRect () {
        this.rect = this.canvas.getBoundingClientRect();
    }
    getScratchCoords (x, y) {
        const nativeSize = this.renderer.getNativeSize();
        return [
            (nativeSize[0] / this.rect.width) * (x - (this.rect.width / 2)),
            (nativeSize[1] / this.rect.height) * (y - (this.rect.height / 2))
        ];
    }
    handleDoubleClick (e) {
        // Set editing target from cursor position, if clicking on a sprite.
        const mousePosition = [e.clientX - this.rect.left, e.clientY - this.rect.top];
        const drawableId = this.renderer.pick(mousePosition[0], mousePosition[1]);
        if (drawableId === null) return;
        const targetId = this.props.vm.getTargetIdForDrawableId(drawableId);
        if (targetId === null) return;
        this.props.vm.setEditingTarget(targetId);
    }
    onTouchStart (e) {
        this.onMouseDown(e.touches[0]);
    }
    onTouchEnd (e) {
        this.onMouseUp(e.changedTouches[0]);
    }
    onTouchMove (e) {
        this.onMouseMove(e.touches[0]);
        if (this.state.mouseDown) {
            e.preventDefault();
        }
    }
    onMouseMove (e) {
        const mousePosition = [e.clientX - this.rect.left, e.clientY - this.rect.top];
        if (this.state.mouseDownTimeoutId !== null) {
            this.cancelMouseDownTimeout();
            if (this.state.mouseDown && !this.state.isDragging) {
                this.onStartDrag(...this.state.mouseDownPosition);
            }
        }
        if (this.state.mouseDown && this.state.isDragging) {
            const spritePosition = this.getScratchCoords(mousePosition[0], mousePosition[1]);
            this.props.vm.postSpriteInfo({
                x: spritePosition[0] + this.state.dragOffset[0],
                y: -(spritePosition[1] + this.state.dragOffset[1]),
                force: true
            });
        }
        const coordinates = {
            x: mousePosition[0],
            y: mousePosition[1],
            canvasWidth: this.rect.width,
            canvasHeight: this.rect.height
        };
        this.props.vm.postIOData('mouse', coordinates);
    }
    onMouseUp (e) {
        this.cancelMouseDownTimeout();
        this.setState({
            mouseDown: false,
            mouseDownPosition: null
        });
        if (this.state.isDragging) {
            this.onStopDrag();
        } else {
            const data = {
                isDown: false,
                x: e.clientX - this.rect.left,
                y: e.clientY - this.rect.top,
                canvasWidth: this.rect.width,
                canvasHeight: this.rect.height
            };
            this.props.vm.postIOData('mouse', data);
        }
    }
    onMouseDown (e) {
        this.updateRect();
        const mousePosition = [e.clientX - this.rect.left, e.clientY - this.rect.top];
        this.setState({
            mouseDown: true,
            mouseDownPosition: mousePosition,
            mouseDownTimeoutId: setTimeout(
                this.onStartDrag.bind(this, mousePosition[0], mousePosition[1]),
                500
            )
        });
        const data = {
            isDown: true,
            x: mousePosition[0],
            y: mousePosition[1],
            canvasWidth: this.rect.width,
            canvasHeight: this.rect.height
        };
        this.props.vm.postIOData('mouse', data);
        if (e.preventDefault) {
            e.preventDefault();
        }
    }
    cancelMouseDownTimeout () {
        if (this.state.mouseDownTimeoutId !== null) {
            clearTimeout(this.state.mouseDownTimeoutId);
        }
        this.setState({mouseDownTimeoutId: null});
    }
    onStartDrag (x, y) {
        const drawableId = this.renderer.pick(x, y);
        if (drawableId === null) return;
        const drawableData = this.renderer.extractDrawable(drawableId, x, y);
        const targetId = this.props.vm.getTargetIdForDrawableId(drawableId);
        if (targetId === null) return;
        this.props.vm.startDrag(targetId);
        this.setState({
            isDragging: true,
            dragId: targetId,
            dragOffset: drawableData.scratchOffset
        });
    }
    onStopDrag () {
        this.props.vm.stopDrag(this.state.dragId);
        this.setState({
            isDragging: false,
            dragOffset: null,
            dragId: null
        });
    }
    setCanvas (canvas) {
        this.canvas = canvas;
    }
    render () {
        const {
            vm, // eslint-disable-line no-unused-vars
            ...props
        } = this.props;
        return (
            <StageComponent
                canvasRef={this.setCanvas}
                onDoubleClick={this.handleDoubleClick}
                {...props}
            />
        );
    }
}

Stage.propTypes = {
    height: PropTypes.number,
    vm: PropTypes.instanceOf(VM).isRequired,
    width: PropTypes.number
};

export default Stage;
