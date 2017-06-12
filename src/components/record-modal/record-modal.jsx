const PropTypes = require('prop-types');
const React = require('react');
const ReactModal = require('react-modal');
const Box = require('../box/box.jsx');
const Waveform = require('../asset-panel/waveform.jsx');
const styles = require('./record-modal.css');

const RecordModal = props => (
    <ReactModal
        className={styles.modalContent}
        contentLabel={'Record a sound'}
        isOpen={props.visible}
        overlayClassName={styles.modalOverlay}
        onRequestClose={props.onCancel}
    >
        <Box className={styles.header}>
            Record a sound
        </Box>
        <Box className={styles.body}>
            <Box class={styles.waveformContainer}>
                <Waveform
                    data={props.buffer ? props.buffer.getData() : []}
                    height={150}
                    level={props.level}
                    width={500}
                />
            </Box>
            <Box className={styles.mainButtonRow}>
                <button
                    className={styles.mainButton}
                    onClick={props.buffer ? (
                        props.playing ? props.onStopPlaying : props.onPlay
                    ) : (
                        props.recording ? props.onStopRecording : props.onRecord
                    )}
                >
                    <svg
                        height={50}
                        width={50}
                    >
                        {props.buffer ? (
                            props.playing ? (
                                <rect
                                    fill="#4C97FF"
                                    height={20}
                                    width={20}
                                    x={15}
                                    y={15}
                                />
                            ) : (
                                <polygon
                                    fill="#4C97FF"
                                    points="10 10 40 25 10 40"
                                />
                            )
                        ) : (
                            props.recording ? (
                                <rect
                                    fill="red"
                                    height={20}
                                    width={20}
                                    x={15}
                                    y={15}
                                />
                            ) : (
                                <circle
                                    cx={25}
                                    cy={25}
                                    fill="red"
                                    r={15}
                                />
                            )
                        )}
                    </svg>
                </button>
            </Box>
            {props.buffer ? (
                <Box className={styles.buttonRow}>
                    <button
                        className={styles.cancelButton}
                        onClick={props.onBack}
                    >
                        Back
                    </button>
                    <button
                        className={styles.okButton}
                        onClick={props.onSubmit}
                    >
                        OK
                    </button>
                </Box>
            ) : null}
        </Box>
    </ReactModal>
);

RecordModal.propTypes = {
    buffer: PropTypes.arrayOf(PropTypes.number),
    level: PropTypes.number,
    onBack: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onPlay: PropTypes.func.isRequired,
    onRecord: PropTypes.func.isRequired,
    onStopPlaying: PropTypes.func.isRequired,
    onStopRecording: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    playing: PropTypes.bool,
    recording: PropTypes.bool,
    visible: PropTypes.bool.isRequired
};

module.exports = RecordModal;
