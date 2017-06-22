const PropTypes = require('prop-types');
const React = require('react');
const classNames = require('classnames');
const Box = require('../box/box.jsx');
const Waveform = require('../waveform/waveform.jsx');
const AudioTrimmer = require('../../containers/audio-trimmer.jsx');

const styles = require('./sound-editor.css');

const playIcon = require('../record-modal/icon--play.svg');
const stopIcon = require('../record-modal/icon--stop-playback.svg');
const trimIcon = require('./icon--trim.svg');

const SoundEditor = props => (
    <Box className={styles.editorContainer}>
        <Box className={styles.row}>
            <Box className={styles.inputGroup}>
                {props.playhead ? (
                    <button
                        className={classNames(styles.button, styles.stopButtonn)}
                        onClick={props.onStop}
                    >
                        <img src={stopIcon} />
                    </button>
                ) : (
                    <button
                        className={classNames(styles.button, styles.playButton)}
                        onClick={props.onPlay}
                    >
                        <img src={playIcon} />
                    </button>
                )}
            </Box>
            <Box className={styles.inputGroup}>
                <span className={styles.inputLabel}>Sound</span>
                <input
                    className={classNames(styles.inputForm, styles.soundName)}
                    placeholder="Sound Name"
                    tabIndex="1"
                    type="text"
                    value={props.name}
                    onBlur={props.onBlurName}
                    onChange={props.onChangeName}
                    onKeyPress={props.onKeyPress}
                />
            </Box>
            <Box className={styles.inputGroup}>
                <button
                    className={classNames(styles.button, styles.playButton, {
                        [styles.trimRed]: props.trimStart !== 0
                    })}
                    onClick={props.onTrim}
                >
                    <img src={trimIcon} />
                </button>
            </Box>
        </Box>
        <Box className={styles.row}>
            <Box className={styles.waveformContainer}>
                <Waveform
                    data={props.soundData}
                    height={180}
                    width={600}
                />
                <AudioTrimmer
                    playhead={props.playhead}
                    trimEnd={props.trimEnd}
                    trimStart={props.trimStart}
                    onSetTrimEnd={props.onSetTrimEnd}
                    onSetTrimStart={props.onSetTrimStart}
                />
            </Box>
        </Box>
    </Box>
);

SoundEditor.propTypes = {
    name: PropTypes.string.isRequired,
    onBlurName: PropTypes.func.isRequired,
    onChangeName: PropTypes.func.isRequired,
    onKeyPress: PropTypes.func.isRequired,
    onPlay: PropTypes.func.isRequired,
    onSetTrimEnd: PropTypes.func,
    onSetTrimStart: PropTypes.func,
    onStop: PropTypes.func.isRequired,
    onTrim: PropTypes.func,
    playhead: PropTypes.number,
    soundData: PropTypes.arrayOf(PropTypes.number).isRequired,
    trimEnd: PropTypes.number,
    trimStart: PropTypes.number
};

module.exports = SoundEditor;
