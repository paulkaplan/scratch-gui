const React = require('react');
const bindAll = require('lodash.bindAll');
const VM = require('scratch-vm');
const classNames = require('classnames');
const Blocks = require('../../containers/blocks.jsx');
const CostumeTab = require('../../containers/costume-tab.jsx');
const GreenFlag = require('../../containers/green-flag.jsx');
const TargetPane = require('../../containers/target-pane.jsx');
const SoundTab = require('../../containers/sound-tab.jsx');
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

        // @todo must resize blockly manually in case resize triggered while hidden
        setTimeout(() => window.dispatchEvent(new Event('resize')));
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

        const costumeTabLabel = vm.editingTarget && vm.editingTarget.isStage ? 'Backdrop' : 'Costume';

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
                                    {costumeTabLabel}
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
                                    <CostumeTab
                                        active={this.state.selectedTab === 'costumes'}
                                        vm={vm}
                                    />
                                </Box>
                                <Box
                                    className={classNames(styles.tabWrapper, {
                                        [styles.activeTabWrapper]: this.state.selectedTab === 'sounds'
                                    })}
                                >
                                    <SoundTab
                                        active={this.state.selectedTab === 'sounds'}
                                        vm={vm}
                                    />
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
}

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
