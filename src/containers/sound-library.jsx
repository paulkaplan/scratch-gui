const bindAll = require('lodash.bindall');
const React = require('react');
const VM = require('scratch-vm');

const LibaryComponent = require('../components/library/library.jsx');
const soundIcon = require('../components/target-pane/icon--sound-dark.svg');

const soundLibraryContent = require('../lib/libraries/sounds.json');

class SoundLibrary extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleItemSelected'
        ]);
    }
    handleItemSelected (item) {
        // @todo these two props should be handled by a VM.addSound function
        const nextSoundId = this.props.vm.editingTarget.sprite.sounds.length;
        const fileUrl = `https://cdn.assets.scratch.mit.edu/internalapi/asset/${item._md5}/get/`;

        const vmSound = {
            fileUrl,
            format: item.format,
            md5: item._md5,
            rate: item.rate,
            sampleCount: item.sampleCount,
            soundID: nextSoundId,
            name: item.name
        };

        // @todo awaiting an official VM.addSound function
        // it will need to both add to sprite and load the sound
        this.props.vm.editingTarget.sprite.sounds.push(vmSound);
        this.props.vm.runtime.audioEngine.loadSounds([vmSound]);
    }
    render () {
        /*
            @todo the library is overfit for images,
            have to use this hack to avoid using md5 for file image
        */
        const soundLibraryThumbnailData = soundLibraryContent.map(sound => {
            const {
                md5,
                ...otherData
            } = sound;
            return {
                _md5: md5,
                // @todo another part of the hack for thumbnails
                rawURL: soundIcon,
                ...otherData
            };
        });

        return (
            <LibaryComponent
                data={soundLibraryThumbnailData}
                title="Sound Library"
                visible={this.props.visible}
                onItemSelected={this.handleItemSelected}
                onRequestClose={this.props.onRequestClose}
            />
        );
    }
}

SoundLibrary.propTypes = {
    onRequestClose: React.PropTypes.func,
    visible: React.PropTypes.bool,
    vm: React.PropTypes.instanceOf(VM).isRequired
};

module.exports = SoundLibrary;
