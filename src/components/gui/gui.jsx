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

const costumeIcon = require('./icon--costume.svg');
const soundIcon = require('./icon--sound.svg');
const addIcon = require('../target-pane/icon--add.svg');

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
            target,
            ...componentProps
        } = this.props;

        if (children) {
            return (
                <Box {...componentProps}>
                    {children}
                </Box>
            );
        }

        const costumeWord = vm.editingTarget && vm.editingTarget.isStage ? 'Backdrop' : 'Costume';

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
                                    {costumeWord}
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
                                        <Box className={styles.sidebarArea}>
                                            <Box className={styles.newArea}>
                                                <Box className={styles.addButton}><img src={addIcon} /></Box>
                                                <Box>Add a {costumeWord.toLowerCase()}</Box>
                                            </Box>
                                            <Box className={styles.listArea}>
                                                {vm.editingTarget ? vm.editingTarget.sprite.costumes.map((costume) => {
                                                    return (
                                                        <Box className={styles.listItem}>
                                                            <img src={costume.skin} />
                                                            <div>{costume.name}</div>
                                                        </Box>
                                                    )
                                                }): null}
                                            </Box>
                                        </Box>
                                        <Box className={styles.detailArea}>
                                            <Box><h3>{costumeWord} detail area</h3></Box>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box
                                    className={classNames(styles.tabWrapper, {
                                        [styles.activeTabWrapper]: this.state.selectedTab === 'sounds'
                                    })}
                                >
                                    <Box className={styles.soundsWrapper}>
                                        <Box className={styles.sidebarArea}>
                                            <Box className={styles.newArea}>
                                                <Box className={styles.addButton}><img src={addIcon} /></Box>
                                                <Box>Add a sound</Box>
                                            </Box>
                                            <Box className={styles.listArea}>
                                                {vm.editingTarget ? vm.editingTarget.sprite.sounds.map((sound) => {
                                                    return (
                                                        <Box className={styles.listItem}>
                                                            <img src={soundIcon} />
                                                            <div>{sound.name}</div>
                                                        </Box>
                                                    )
                                                }): null}
                                            </Box>
                                        </Box>
                                        <Box className={styles.detailArea}>
                                            <Box><h3>Sound detail area</h3></Box>
                                        </Box>
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
