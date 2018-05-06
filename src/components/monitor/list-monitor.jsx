import React from 'react';
import PropTypes from 'prop-types';
import styles from './monitor.css';

const ListMonitor = ({categoryColor, label, width, height, value}) => (
    <div className={styles.listMonitor}>
        <div className={styles.listHeader}>
            {label}
        </div>
        <div
            className={styles.listBody}
            height={`${height}px`}
            width={`${width}px`}
        >
            {/* @todo need to have list monitors stay arrays */}
            {(typeof value === 'string' ? value.split(' ') : []).map((v, i) => (
                <div
                    className={styles.listRow}
                    key={`label-${i}`}
                >
                    <div className={styles.listIndex}>{i}</div>
                    <div
                        className={styles.listValue}
                        style={{background: categoryColor}}
                    >
                        {v}
                    </div>
                </div>
            ))}
        </div>
        <div className={styles.listFooter}>
            <div className={styles.footerButton}>
                {'+' /* @todo coming soon this, also icon? */}
            </div>
            <div className={styles.footerLength}>
                {`length ${(typeof value === 'string' ? value.split(' ') : []).length}`}
            </div>
            <div className={styles.resizeHandle}>
                {'=' /* @todo coming soon this, also icon? */}
            </div>
        </div>
    </div>
);

ListMonitor.propTypes = {
    categoryColor: PropTypes.string.isRequired,
    height: PropTypes.number,
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    width: PropTypes.number
};

ListMonitor.defaultProps = {
    width: 110,
    height: 200
};

export default ListMonitor;
