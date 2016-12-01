import React, {Component} from 'react';
let cmpId = 1000;
const PANELID = `PANEL-${cmpId}`;

let Panel = ()=> (
	<div className={"panel attribute-panel "} id={PANELID}>
		<div className="j-attribute-panel panel-body">

		</div>
	</div>
);
export const Enhance = function(Components) {

	return class AttributePanel extends React.Component {
		constructor(props) {
			super(props);
			console.log(props);
		}
		hidePanel() {

		}
		showPanel() {

		}
		render() {
			let node = <Panel />;
			return (
				<div>{node}</div>
			)
		}
	}
};
// AttributePanel.defaultProps = {
// 	type: null,
// 	cls: '',
// 	title: null,
// 	noHeader: false,
// 	headerContent: '',
// 	contentHtml: '',
// 	closeIcon: '',
// 	closeable: false,
// 	closeContent: ''
// }