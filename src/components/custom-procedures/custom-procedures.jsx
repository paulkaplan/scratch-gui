import PropTypes from 'prop-types';
import React from 'react';
import Modal from '../modal/modal.jsx';
import Box from '../box/box.jsx';

import booleanInputIcon from './boolean-input.png';
import textInputIcon from './text-input.png';
import labelIcon from './label.png';

import styles from './custom-procedures.css';

const CustomProcedures = props => (
    <Modal
        className={styles.modalContent}
        contentLabel="Create new block"
        onRequestClose={props.onCancel}
    >
        <Box
            className={styles.workspace}
            componentRef={props.componentRef}>

        </Box>
        <Box className={styles.body}>
            <div className={styles.optionsRow}>
                <div
                    role="button"
                    className={styles.optionCard}
                    onClick={props.onAddTextNumber}
                >
                    <img
                        className={styles.optionIcon}
                        src={textInputIcon}
                    />
                    <div className={styles.optionTitle}>Add an input</div>
                    <div className={styles.optionDescription}>number or text</div>
                </div>
                <div
                    role="button"
                    className={styles.optionCard}
                    onClick={props.onAddBoolean}
                >
                    <img
                        className={styles.optionIcon}
                        src={booleanInputIcon}
                    />
                    <div className={styles.optionTitle}>Add an input</div>
                    <div className={styles.optionDescription}>boolean</div>
                </div>
                <div
                    role="button"
                    className={styles.optionCard}
                    onClick={props.onAddLabel}
                >
                    <img
                        className={styles.optionIcon}
                        src={labelIcon}
                    />
                    <div className={styles.optionTitle}>Add a label</div>
                </div>
            </div>
            <div className={styles.checkboxRow}>
                <label><input type="checkbox" />Run without screen refresh</label>
            </div>
            <Box className={styles.buttonRow}>
                <button
                    className={styles.cancelButton}
                    onClick={props.onCancel}
                >
                    Cancel
                </button>
                <button
                    className={styles.okButton}
                    onClick={props.onOk}
                >
                    OK
                </button>
            </Box>
        </Box>
    </Modal>
);

CustomProcedures.propTypes = {
    componentRef: PropTypes.func.isRequired
};

export default CustomProcedures;
