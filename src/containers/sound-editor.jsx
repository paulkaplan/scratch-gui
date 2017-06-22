const bindAll = require('lodash.bindall');
const PropTypes = require('prop-types');
const React = require('react');

const {connect} = require('react-redux');

const {computeRMS} = require('../lib/audio/audio-util.js');
const VM = require('scratch-vm');

const SoundEditorComponent = require('../components/sound-editor/sound-editor.jsx');
const AudioBufferPlayer = require('../lib/audio/audio-buffer-player.js');

class SoundEditor extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'afterStop',
            'handleChangeName',
            'handleFlush',
            'handleKeyPress',
            'handlePlay',
            'handleStopPlaying',
            'handlePlayheadUpdate',
            'handleUpdateTrimEnd',
            'handleUpdateTrimStart',
            'handleActivateTrim'
        ]);
        this.state = {
            playhead: null,
            name: null,
            trimStart: 0,
            trimEnd: 1
        };
    }
    componentDidMount () {
        this.audioBufferPlayer = new AudioBufferPlayer(this.props.soundData, this.props.sampleRate);
    }
    componentWillReceiveProps (newProps) {
        if (newProps.soundData !== this.props.soundData) {
            this.audioBufferPlayer.stop();
            this.audioBufferPlayer = new AudioBufferPlayer(newProps.soundData, newProps.sampleRate);
        }
    }
    componentWillUnmount () {
        this.audioBufferPlayer.stop();
    }
    handlePlay () {
        this.audioBufferPlayer.play(
            this.state.trimStart,
            this.state.trimEnd,
            this.handlePlayheadUpdate,
            this.afterStop);
    }
    handleStopPlaying () {
        this.audioBufferPlayer.stop();
        this.afterStop();
    }
    afterStop () {
        this.setState({playhead: null});
    }
    handlePlayheadUpdate (playhead) {
        this.setState({playhead});
    }
    handleKeyPress (e) {
        if (e.key === 'Enter') {
            this.handleFlush();
            e.target.blur();
        }
    }
    handleUpdatePitch (e) {
        this.setState({pitch: Number(e.target.value)});
        this.handleApplyEffects();
    }
    handleUpdateDistort (e) {
        this.setState({distort: Number(e.target.value)});
        this.handleApplyEffects();
    }
    handleUpdateEcho (e) {
        this.setState({echo: Number(e.target.value)});
        this.handleApplyEffects();
    }
    handleFlush () {
        if (this.state.name !== null) {
            this.props.vm.editingTarget.sprite.sounds[this.props.soundIndex].name = this.state.name;
            this.props.vm.runtime.requestTargetsUpdate(this.props.vm.editingTarget);
        }
    }
    handleChangeName (e) {
        this.setState({name: e.target.value});
    }
    handleUpdateTrimEnd (trimEnd) {
        this.setState({trimEnd});
    }
    handleUpdateTrimStart (trimStart) {
        this.setState({trimStart});
    }
    handleActivateTrim () {
        if (this.state.trimStart === 0 && this.state.trimEnd === 1) {
            this.setState({trimEnd: 0.9, trimStart: 0.1});
        } else {
            this.takeNewSound = true;
            const vm = this.props.vm;
            const sound = vm.editingTarget.sprite.sounds[this.props.soundIndex];
            const buffer = vm.runtime.audioEngine.audioBuffers[sound.md5];
            const samples = buffer.getChannelData(0);
            const sampleCount = samples.length;
            const startIndex = Math.floor(this.state.trimStart * sampleCount);
            const endIndex = Math.floor(this.state.trimEnd * sampleCount);
            const clippedSamples = samples.slice(startIndex, endIndex);
            const audioCtx = new AudioContext();
            const newBuffer = audioCtx.createBuffer(1, clippedSamples.length, this.props.sampleRate);
            newBuffer.getChannelData(0).set(clippedSamples);
            this.setState({trimEnd: 1, trimStart: 0});
            vm.runtime.audioEngine.audioBuffers[sound.md5] = newBuffer;
            vm.editingTarget.sprite.sounds[this.props.soundIndex].name += '(t)'; // hack to get updating working
            vm.runtime.requestTargetsUpdate(vm.editingTarget);
        }
    }
    render () {
        // HACK
        const soundData = this.props.soundData;
        // const soundData = this.props.vm.runtime.audioEngine.audioBuffers[this.props.sound.md5].getChannelData(0);
        const samples = soundData.length;
        const chunkSize = 512;
        const chunkLevels = [];
        for (let i = 0; i < samples; i += chunkSize) {
            const maxIndex = Math.min(samples - 1, i + chunkSize);
            chunkLevels.push(computeRMS(soundData.slice(i, maxIndex), true));
        }

        const bufferedName = this.state.name === null ? this.props.name : this.state.name;

        return (
            <SoundEditorComponent
                name={bufferedName}
                playhead={this.state.playhead}
                soundData={chunkLevels}
                trimEnd={this.state.trimEnd}
                trimStart={this.state.trimStart}
                onBlurName={this.handleFlush}
                onChangeName={this.handleChangeName}
                onKeyPress={this.handleKeyPress}
                onPlay={this.handlePlay}
                onSetTrimEnd={this.handleUpdateTrimEnd}
                onSetTrimStart={this.handleUpdateTrimStart}
                onStop={this.handleStopPlaying}
                onTrim={this.handleActivateTrim}
            />
        );
    }
}

SoundEditor.propTypes = {
    name: PropTypes.string.isRequired,
    sampleRate: PropTypes.number,
    soundData: PropTypes.instanceOf(Float32Array),
    soundIndex: PropTypes.number,
    vm: PropTypes.instanceOf(VM)
};

const mapStateToProps = (state, {soundIndex}) => {
    const sound = state.vm.editingTarget.sprite.sounds[soundIndex];
    const audioBuffer = state.vm.runtime.audioEngine.audioBuffers[sound.md5];
    return {
        sampleRate: audioBuffer.sampleRate,
        soundData: audioBuffer.getChannelData(0),
        name: sound.name,
        vm: state.vm
    };
};

module.exports = connect(
    mapStateToProps
)(SoundEditor);
