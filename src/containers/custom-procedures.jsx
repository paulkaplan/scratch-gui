import bindAll from 'lodash.bindall';
import defaultsDeep from 'lodash.defaultsdeep';
import PropTypes from 'prop-types';
import React from 'react';
import CustomProceduresComponent from '../components/custom-procedures/custom-procedures.jsx';
import ScratchBlocks from 'scratch-blocks';
import {connect} from 'react-redux';
import {updateToolbox} from '../reducers/toolbox';
import {activateColorPicker} from '../reducers/color-picker';
import {deactivateCustomProcedures} from '../reducers/custom-procedures';

// const declarationBlock = `
// <xml xmlns="http://www.w3.org/1999/xhtml">
//   <variables></variables>
//     <block type="procedures_declaration" id=",vkJKl8e}dPs]zcVlb]," deletable="false" x="30" y="75">
//         <mutation proccode="play %s %n times if %b is true" argumentids="[&quot;1&quot;,&quot;2&quot;,&quot;3&quot;]" argumentnames="[&quot;this sound&quot;,&quot;this many&quot;,&quot;condition&quot;]" argumentdefaults="[&quot;todo&quot;,&quot;todo&quot;,&quot;todo&quot;]" warp="false"></mutation>
//     </block>
// </xml>
// `;
//
// const callBlock = `
// <xml xmlns="http://www.w3.org/1999/xhtml">
//   <variables></variables>
//   <block type="procedures_call" id=",vkJKl8e}dPs]zcVlb]," deletable="false" x="90" y="75">
//       <mutation proccode="play %s %n times if %b is true" argumentids="[&quot;1&quot;,&quot;2&quot;,&quot;3&quot;]" argumentnames="[&quot;this sound&quot;,&quot;this many&quot;,&quot;condition&quot;]" argumentdefaults="[&quot;todo&quot;,&quot;todo&quot;,&quot;todo&quot;]" warp="false"></mutation>
//       <value name="1"><shadow type="text"><field name="TEXT">meow</field></shadow></value>
//       <value name="2"><shadow type="text"><field name="TEXT">5</field></shadow></value>
//   </block>
// </xml>
// `;
//
// const definitionBlock = `
// <xml xmlns="http://www.w3.org/1999/xhtml">
//   <variables></variables>
//   <block type="procedures_definition">
//       <statement name="custom_block">
//           <shadow type="procedures_prototype" id=",vkJKl8e}dPs]zcVlb]," deletable="false" x="30" y="155">
//               <mutation proccode="play %s %n times if %b is true" argumentids="[&quot;1&quot;,&quot;2&quot;,&quot;3&quot;]" argumentnames="[&quot;this sound&quot;,&quot;this many&quot;,&quot;condition&quot;]" argumentdefaults="[&quot;todo&quot;,&quot;todo&quot;,&quot;todo&quot;]" warp="false"></mutation>
//           </shadow>
//       </statement>
//     </block>
// </xml>
// `;

const declarationBlock = `
<xml xmlns="http://www.w3.org/1999/xhtml">
  <variables></variables>
    <block type="procedures_declaration" id=",vkJKl8e}dPs]zcVlb]," deletable="false" x="150" y="75">
        <mutation proccode="draw a face" argumentids="[]" argumentnames="[]" argumentdefaults="[]" warp="false"></mutation>
    </block>
</xml>
`;

const declarationBlockFn = mutation => `
<xml xmlns="http://www.w3.org/1999/xhtml">
  <variables></variables>
    <block type="procedures_declaration" id=",vkJKl8e}dPs]zcVlb]," deletable="false" x="150" y="75">
        ${mutation}
    </block>
</xml>
`;


const callBlock = `
<xml xmlns="http://www.w3.org/1999/xhtml">
  <variables></variables>
  <block type="procedures_call" id=",vkJKl8e}dPs]zcVlb]," deletable="false" x="150" y="75">
      <mutation proccode="draw a face" argumentids="[]" argumentnames="[]" argumentdefaults="[]" warp="false"></mutation>
  </block>
</xml>
`;

const definitionBlock = `
<xml xmlns="http://www.w3.org/1999/xhtml">
  <variables></variables>
  <block type="procedures_definition">
      <statement name="custom_block">
          <shadow type="procedures_prototype" id=",vkJKl8e}dPs]zcVlb]," deletable="false" x="150" y="155">
              <mutation proccode="draw a face" argumentids="[]" argumentnames="[]" argumentdefaults="[]" warp="false"></mutation>
          </shadow>
      </statement>
    </block>
</xml>
`;

class Blocks extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleAddLabel',
            'handleAddBoolean',
            'handleAddTextNumber',
            'handleCancel',
            'handleOk',
            'setBlocks'
        ]);
        this.state = {
            workspaceMetrics: {},
            prompt: null,
            xml: declarationBlock
        };
    }
    componentDidMount () {
        console.log('mounted');
        console.log(this.props);
        // this.workspace = ScratchBlocks.inject(this.blocks);


        const _this = this;
        window.callBlock = function () {
            _this.setState({xml: callBlock});
        };
        window.declarationBlock = function () {
            _this.setState({xml: declarationBlock});
        };
        window.definitionBlock = function () {
            _this.setState({xml: definitionBlock});
        };
    }
    componentDidUpdate (prevProps) {
        console.log('did update');
        const workspaceConfig = defaultsDeep({},
            Blocks.defaultOptions,
            this.props.options
        );
        this.workspace = ScratchBlocks.inject(this.blocks, workspaceConfig);
        const dom = ScratchBlocks.Xml.textToDom(this.state.xml);
        ScratchBlocks.Xml.domToWorkspace(dom, this.workspace);
        this.mutationRoot = this.workspace.getTopBlocks()[0];
    }
    componentWillUnmount () {
        this.workspace.dispose();
    }
    handleAddLabel () {
        this.mutationRoot.addLabelExternal();
    }
    handleAddBoolean () {
        this.mutationRoot.addBooleanExternal();
    }
    handleAddTextNumber () {
        this.mutationRoot.addStringNumberExternal();
    }
    setBlocks (blocksRef) {
        console.log('set blocks', blocksRef);
        if (!blocksRef) return;
        this.blocks = blocksRef;
        const workspaceConfig = defaultsDeep({},
            Blocks.defaultOptions,
            this.props.options
        );
        // HACK to get the default toolbox not to load
        ScratchBlocks.Blocks.defaultToolbox = null;
        this.workspace = ScratchBlocks.inject(this.blocks, workspaceConfig);
        this.mutationRoot = this.workspace.newBlock('procedures_declaration');
        this.workspace.addChangeListener(() => this.mutationRoot.onChangeFn());
        this.mutationRoot.domToMutation(this.props.data);
        this.mutationRoot.initSvg();
        this.mutationRoot.render(false);
        const metrics = this.workspace.getMetrics();
        const dx = (metrics.viewWidth / 2) - (this.mutationRoot.width / 2);
        const dy = (metrics.viewHeight / 2) - (this.mutationRoot.height / 2);
        this.mutationRoot.moveBy(dx, dy);
    }
    handleCancel () {
        this.props.onRequestClose();
    }
    handleOk () {
        this.props.onRequestClose(this.mutationRoot.mutationToDom());

    }
    render () {
        console.log(this.props);
        return (
            <CustomProceduresComponent
                componentRef={this.setBlocks}
                onAddBoolean={this.handleAddBoolean}
                onAddLabel={this.handleAddLabel}
                onAddTextNumber={this.handleAddTextNumber}
                onCancel={this.handleCancel}
                onOk={this.handleOk}
            />
        );
    }
}

Blocks.propTypes = {
    options: PropTypes.shape({
        media: PropTypes.string,
        zoom: PropTypes.shape({
            controls: PropTypes.bool,
            wheel: PropTypes.bool,
            startScale: PropTypes.number
        }),
        colours: PropTypes.shape({
            workspace: PropTypes.string,
            flyout: PropTypes.string,
            toolbox: PropTypes.string,
            toolboxSelected: PropTypes.string,
            scrollbar: PropTypes.string,
            scrollbarHover: PropTypes.string,
            insertionMarker: PropTypes.string,
            insertionMarkerOpacity: PropTypes.number,
            fieldShadow: PropTypes.string,
            dragShadowOpacity: PropTypes.number
        }),
        comments: PropTypes.bool
    })
};

Blocks.defaultOptions = {
    zoom: {
        controls: false,
        wheel: false,
        startScale: 0.9
    },
    colours: {
        workspace: '#E7EDF2',
        flyout: '#E7EDF2',
        toolbox: '#E7EDF2',
        toolboxSelected: '#E9EEF2',
        scrollbar: '#CECDCE',
        scrollbarHover: '#CECDCE',
        insertionMarker: '#000000',
        insertionMarkerOpacity: 0.2,
        fieldShadow: 'rgba(255, 255, 255, 0.3)',
        dragShadowOpacity: 0.6
    },
    comments: false
};

Blocks.defaultProps = {
    isVisible: true,
    options: Blocks.defaultOptions
};


const mapStateToProps = state => ({
    extensionLibraryVisible: state.modals.extensionLibrary
});

const mapDispatchToProps = dispatch => ({
    onDeactivateCustomProcedures: data => {
        dispatch(deactivateCustomProcedures(data));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Blocks);
