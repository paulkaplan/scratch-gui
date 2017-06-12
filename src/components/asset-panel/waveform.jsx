const React = require('react');
const PropTypes = require('prop-types');

// Adapted from https://github.com/cwilso/Audio-Buffer-Draw/blob/master/js/audiodisplay.js
const styles = require('./waveform.css');
const Waveform = props => {
    const {
        width,
        height,
        data,
        level
    } = props;

    const amp = height / 2;

    // let step = Math.ceil(data.length / width);
    // const maxStep = 10 * step;
    const nSteps = 40;
    const step = Math.floor(data.length / nSteps);

    let i = 0;
    let pathData = `M 0 0`;

    const handleFactor = 3;

    while (i < data.length) {
        const d = data.slice(i, i + step);
        const min = Math.max(-1, Math.min.apply(null, d));

        const halfX = (i + step / 2) * (width / data.length);
        const fullX = (i + step) * (width / data.length);

        const topY = -min * amp;
        const bottomY = min * amp;

        pathData += `C ${halfX} ${handleFactor * topY} ${halfX} ${handleFactor * bottomY} ${fullX} 0`;

        i += step;
    }


    return (
        <div
            style={{
                padding: '15px',
                margin: '15px',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: '10px'
            }}
        >
            <svg
                height={height}
                width={width}
            >
                {data.length === 0 ? (
                    <line
                        stroke="rgb(207, 99, 207)"
                        strokeLinecap="round"
                        strokeWidth={Math.max(0.01, level) * amp}
                        style={{transition: '0.2s'}}
                        x1={width / 10}
                        x2={(9 * width) / 10}
                        y1={height / 2}
                        y2={height / 2}
                    />
                ) : (
                    <g transform={`scale(1, -1) translate(0, -${height / 2}) `}>
                        <path
                            d={pathData}
                            fill="none"
                            stroke="rgb(207, 99, 207)"
                            strokeLinejoin={'round'}
                            strokeWidth={2}
                            style={styles.polygon}
                        />
                    </g>
                )}
            </svg>
        </div>
    );
};

Waveform.propTypes = {
    data: PropTypes.arrayOf(PropTypes.number),
    height: PropTypes.number,
    level: PropTypes.number,
    width: PropTypes.number
};

module.exports = Waveform;
