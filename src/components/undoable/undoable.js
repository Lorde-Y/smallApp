import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { bindActionCreators } from 'redux';
import * as actionCreators from 'action/action';
import { ActionCreators } from 'redux-undo'

import './undoable.less';

class Undoable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			disX: 0,
			disY: 0,
			left: 0,
			top: 0,
			undoDisabled: true,
			redoDisabled: true
		}
	}

	handleMouseDown = (e)=> {
		const dragDom = ReactDom.findDOMNode(this.refs.drag);
		const { left, top } = dragDom.getBoundingClientRect();
		this.setState({disX: e.clientX - left, disY: e.clientY - top});
		this.addDragEvents();
	};

	addDragEvents() {
		document.addEventListener('mousemove', this.handleMouseMove);

		document.addEventListener('mouseup', this.handleMouseUp);
	}

	handleMouseMove = (e)=> {
		e.stopPropagation();
		e.preventDefault();
		const dragContainerDom = ReactDom.findDOMNode(this);
		const { left, top } = dragContainerDom.getBoundingClientRect();

		const finalLeft = e.clientX - this.state.disX - left;
		const finalTop = e.clientY - this.state.disY - top;


		this.setState({left: finalLeft, top: finalTop});
		

	};

	handleMouseUp = (e)=> {
		document.removeEventListener('mousemove', this.handleMouseMove, false);
		document.removeEventListener('mouseup', this.handleMouseUp, false);

		const {store} = this.props;
		let boundActionCreators = bindActionCreators(actionCreators, store.dispatch);
		boundActionCreators.undoable(this.state.left, this.state.top);

		const state = store.getState();
		const undoRedo = state.undoRedo;
		const {present, past, future} = {...undoRedo};
		if (past.length != 0) {
			this.setState({undoDisabled: false});
		}else {
			this.setState({undoDisabled: true});
		}
		if (future.length != 0){
			this.setState({redoDisabled: false});
		}else {
			this.setState({redoDisabled: true});
		}

	};

	handleUndo = (e)=> {
		const {store} = this.props;
		store.dispatch(ActionCreators.undo());
		const state = store.getState();
		const undoRedo = state.undoRedo;
		const {present, past, future} = {...undoRedo};
		if (past.length != 0) {
			this.setState({left: present.left, top: present.top,undoDisabled: false});
		}else {
			this.setState({left: present.left, top: present.top,undoDisabled: true});
		}
		if (future.length != 0){
			this.setState({redoDisabled: false});
		}else {
			this.setState({redoDisabled: true});
		}
	};

	handleRedo = (e)=> {
		const {store} = this.props;
		store.dispatch(ActionCreators.redo());
		const state = store.getState();
		const undoRedo = state.undoRedo;
		const {present, past, future} = {...undoRedo};
		if (past.length != 0) {
			this.setState({left: present.left, top: present.top,undoDisabled: false});
		}else {
			this.setState({left: present.left, top: present.top,undoDisabled: true});
		}
		if (future.length != 0) {
			this.setState({left: present.left, top: present.top, redoDisabled: false});
		}else {
			this.setState({left: present.left, top: present.top, redoDisabled: true});
		}
		
	};

	render() {
		const { left, top, undoDisabled, redoDisabled } = this.state;
		const style = {
			left:left + 'px',
			top: top + 'px'
		};
		let undoBtnCls = 'undo-btn'
		let redoBtnCls = 'redo-btn'
		if (undoDisabled) {
			undoBtnCls += ' disabled'
		}
		if (redoDisabled) {
			redoBtnCls += ' disabled'
		}
		return (
			<div className='drag-container'>
				<div className='drag-box' style={style} onMouseDown={this.handleMouseDown} ref='drag'/>
				<button className={undoBtnCls} onClick={this.handleUndo}>Undo</button>
				<button className={redoBtnCls} onClick={this.handleRedo}>Redo</button>
			</div>
		)
	}
}

export default Undoable