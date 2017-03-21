const React = require('react');
const bindAll = require('lodash.bindAll')
const VM = require('scratch-vm');
const classNames = require('classnames');
const Blocks = require('../../containers/blocks.jsx');
const GreenFlag = require('../../containers/green-flag.jsx');
const TargetPane = require('../../containers/target-pane.jsx');
const Stage = require('../../containers/stage.jsx');
const StopAll = require('../../containers/stop-all.jsx');
const MenuBar = require('../menu-bar/menu-bar.jsx');

const Box = require('../box/box.jsx');
const styles = require('./gui.css');

class GUIComponent extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleScriptTabSelect',
            'handleSoundTabSelect',
            'handleCostumeTabSelect'
        ]);
        this.state = {selectedTab: 'scripts'};
    }
    handleScriptTabSelect () {
        this.setState({selectedTab: 'scripts'});
    }
    handleSoundTabSelect () {
        this.setState({selectedTab: 'sounds'});
    }
    handleCostumeTabSelect () {
        this.setState({selectedTab: 'costumes'});
    }
    render () {
        const {
            basePath,
            children,
            vm,
            ...componentProps
        } = this.props;

        if (children) {
            return (
                <Box {...componentProps}>
                    {children}
                </Box>
            );
        }

        return (
            <Box
                className={styles.pageWrapper}
                {...componentProps}
            >
                <MenuBar />
                <Box className={styles.bodyWrapper}>
                    <Box className={styles.flexWrapper}>
                        <Box className={styles.editorWrapper}>
                            <Box className={styles.tabList}>
                                <Box
                                    className={classNames(styles.tabListItem, {
                                        [styles.activeTabListItem]: this.state.selectedTab === 'scripts'
                                    })}
                                    onClick={this.handleScriptTabSelect}
                                >
                                    Scripts
                                </Box>
                                <Box
                                    className={classNames(styles.tabListItem, {
                                        [styles.activeTabListItem]: this.state.selectedTab === 'costumes'
                                    })}
                                    onClick={this.handleCostumeTabSelect}
                                >
                                    Costumes
                                </Box>
                                <Box
                                    className={classNames(styles.tabListItem, {
                                        [styles.activeTabListItem]: this.state.selectedTab === 'sounds'
                                    })}
                                    onClick={this.handleSoundTabSelect}
                                >
                                    Sounds
                                </Box>
                            </Box>
                            <Box className={styles.tabs}>
                                <Box
                                    className={classNames(styles.tabWrapper, {
                                        [styles.activeTabWrapper]: this.state.selectedTab === 'scripts'
                                    })}
                                >
                                    <Box className={styles.blocksWrapper}>
                                        <Blocks
                                            grow={1}
                                            options={{
                                                media: `${basePath}static/blocks-media/`
                                            }}
                                            vm={vm}
                                        />
                                    </Box>
                                </Box>
                                <Box
                                    className={classNames(styles.tabWrapper, {
                                        [styles.activeTabWrapper]: this.state.selectedTab === 'costumes'
                                    })}
                                >
                                    <Box className={styles.costumesWrapper}>
                                        <h1>Costumes</h1>
                                    </Box>
                                </Box>
                                <Box
                                    className={classNames(styles.tabWrapper, {
                                        [styles.activeTabWrapper]: this.state.selectedTab === 'sounds'
                                    })}
                                >
                                    <Box className={styles.soundsWrapper}>
                                        <h1>Sounds</h1>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>

                        <Box className={styles.stageAndTargetWrapper} >
                            <Box className={styles.stageMenuWrapper} >
                                <GreenFlag vm={vm} />
                                <StopAll vm={vm} />
                            </Box>

                            <Box className={styles.stageWrapper} >
                                <Stage
                                    shrink={0}
                                    vm={vm}
                                />
                            </Box>

                            <Box className={styles.targetWrapper} >
                                <TargetPane
                                    vm={vm}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        );
    }
};
GUIComponent.propTypes = {
    basePath: React.PropTypes.string,
    children: React.PropTypes.node,
    vm: React.PropTypes.instanceOf(VM)
};
GUIComponent.defaultProps = {
    basePath: '/',
    vm: new VM()
};
module.exports = GUIComponent;
