import React, { Component } from 'react';
import ReactDom from 'react-dom';
import Events from './events';

import './crop.less';

const imgSrc = 'http://oss1.rabbitpre.com/7dfc1cb5-c8dd-4a27-9ce1-21d589ff8c21.png';
const imgWidth = 1200;
const imgHeight = 800;

class ImageCrop extends Component {
	constructor(props) {
		super(props);
		this.state = {
			cropObj:{
				x:0,
				y:0,
				width:0,
				height:0
			},
			dragDisX:0,
			dragDisY:0,
			dragNewCrop: false,
			showResizePoint: false,
			showMask: false
		}
	}

	componentDidMount() {
		// this.getContainerBoundingRect();
	}

	getContainerBoundingRect() {
		const {left, right} = ReactDom.findDOMNode(this).getBoundingClientRect();
		this.setState({startPos: left, containerRightPos: right - left});
	}

	handleImageMouseDown = (e)=> {
		if (e.target === this.refs.cropSelection) return;

		Events.pauseEvent(e);

		const position = Events.getMousePosition(e);
		if (position.x === this.state.x) return;

		let cropObj = {};

		cropObj.x = position.x;
		cropObj.y = position.y;
		cropObj.width = 0;
		cropObj.height = 0;

		this.setState({showMask: true, dragNewCrop: true, showResizePoint: false,cropObj: cropObj});

		Events.addEventsToDocument(this.getMouseEventMap());
	};

	getMouseEventMap() {
		return {
			mousemove: this.handeMouseMove,
			mouseup: this.handeMouseUp
		}
	}

	handeMouseMove = (e)=> {
		this.getDragValue(Events.getMousePosition(e));
	};

	handeMouseUp = (e)=> {
		if (this.state.dragNewCrop && Math.abs(this.state.cropObj.width) > 0) {
				this.setState({showResizePoint: true});
		}else {
			this.setState({showMask: false, dragNewCrop: false});
		}
		// this.dragNewCrop = false;
		Events.removeEventsFromDocument(this.getMouseEventMap());
	};

	handleCropResize = (e)=> {
		Events.pauseEvent(e);
		const cropObj = this.setCropStateAbs(this.state.cropObj);

		// start selection drag
		const cropSelection = ReactDom.findDOMNode(this.refs.cropSelection);
		const { left, top } = cropSelection.getBoundingClientRect();
		this.setState({cropObj: cropObj, dragDisX: e.clientX - left, dragDisY: e.clientY - top});
		
		Events.addEventsToDocument(this.getSelectionDragEventMap())
	};

	handleSelectionDragMove = (e)=> {
		Events.pauseEvent(e);

		const parentContainer = ReactDom.findDOMNode(this);
		const { left, top } = parentContainer.getBoundingClientRect();

		let cropObj = {};
		cropObj.x = e.clientX - this.state.dragDisX - left;
		cropObj.y = e.clientY - this.state.dragDisY - top;
		cropObj = {...this.state.cropObj, ...cropObj};
		this.setState({cropObj: cropObj});
	};

	handleSelectionDragUp = (e)=> {
		Events.removeEventsFromDocument(this.getSelectionDragEventMap())
	};

	handleNwResize = (e)=> {
		Events.pauseEvent(e);
		console.log('resize...me...')
	};

	getSelectionDragEventMap() {
		return {
			mousemove: this.handleSelectionDragMove,
			mouseup: this.handleSelectionDragUp
		}
	}

	getDragValue(position) {
		const cropObj = this.state.cropObj;
		cropObj.width =  position.x - cropObj.x;
		cropObj.height = position.y - cropObj.y;
		this.setState({cropObj: cropObj});
	}

	getPolygonValues() {
		//获取polygon每个点的x,y坐标
		const cropObj = this.state.cropObj;
		let {x, y, width, height} = {...cropObj};
		let topLeft = [x, y];
		let topRight = [x+width, y];
		let bottomRight = [x+width, y+height];
		let bottomLeft = [x, y+height];
		//返回的结果用百分比
		return {
			top: {
				left: this.arrayToPrecent(topLeft),
				right: this.arrayToPrecent(topRight)
			},
			bottom: {
				left: this.arrayToPrecent(bottomLeft),
				right: this.arrayToPrecent(bottomRight)
			}
		}
	}

	arrayToPrecent(arr) {
		return arr.map((number, idx)=> {
			if (idx ===0) {
				return (parseFloat(number/imgWidth*100).toFixed(2))+'%';
			}
			return (parseFloat(number/imgHeight*100).toFixed(2))+'%';
		}).join(' ');
	}

	drawPolygon() {
		const polygonPoint = this.getPolygonValues();
		const {top, bottom} = {...polygonPoint};
		return `polygon(${top.left},${top.right},${bottom.right},${bottom.left} )`;
	}

	setCropStateAbs(cropObj) {
		let {x, y, width, height} = {...cropObj};
		let obj = {}
		obj.x = (width > 0) ? x : (x+width);
		obj.y = (height > 0) ? y : (y+height);
		obj.width =  Math.abs(width);
		obj.height = Math.abs(height);
		return obj;
	}

	createCropSelection() {
		const cropObj = this.setCropStateAbs(this.state.cropObj);
		const {x, y, width, height} = cropObj;
		const style = {
			left: x,
			top: y,
			width: width,
			height: height
		};
		return (
			<div>
				{	this.state.dragNewCrop &&
					<div className='image-crop-selection' onMouseDown={this.handleCropResize} style={style} ref="cropSelection">
						{	this.state.showResizePoint &&
							<div>
								<div className='handle-resize origin-nw' onMouseDown={this.handleNwResize}/>
								<div className='handle-resize origin-n' />
								<div className='handle-resize origin-ne'/>
								<div className='handle-resize origin-e'/>
								<div className='handle-resize origin-se'/>
								<div className='handle-resize origin-s'/>
								<div className='handle-resize origin-sw'/>
								<div className='handle-resize origin-w'/>
							</div>
						}
					</div>
				}
			</div>
		);
	}

	render() {
		console.log('rendering...........');
		console.log(this.state.cropObj);
		const imageMask = this.state.showMask ? 'image-crop-mask active' : 'image-crop-mask';
		const cropSvgStyle = {
			WebkitClipPath: this.drawPolygon(),
			clipPath: this.drawPolygon()
		};
		return (
			<div className='image-crop' onMouseDown={this.handleImageMouseDown} onMouseUp={this.handleImageMouseUp}>
				<div className='image-crop-origin'>
					<img width="1200" height="800" src={imgSrc}/>
				</div>
				
				<div className='image-crop-show'>
					<div className={imageMask}/>
					<img width="1200" height="800" src={imgSrc} style={cropSvgStyle}/>
					{this.createCropSelection()}
				</div>
			</div>
		);
	}
}

export default ImageCrop