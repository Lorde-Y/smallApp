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
				x:0,//最左上角x坐标
				y:0,//最左上角y坐标
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
		const {left, right, top} = ReactDom.findDOMNode(this).getBoundingClientRect();
		if (position.x === this.state.x) return;

		let cropObj = {};

		cropObj.x = position.x -left;
		cropObj.y = position.y-top;
		cropObj.width = 0;
		cropObj.height = 0;
		cropObj.originStartWidth = 0;
		cropObj.originStartHeight = 0;

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

		// this.checkCrossOver();
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
		let cropObj = this.setCropStateAbs(this.state.cropObj);
		cropObj = {...this.state.cropObj, ...cropObj};
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
		const position = Events.getMousePosition(e);

		let cropObj = {};
		cropObj.x = position.x - this.state.dragDisX - left;
		cropObj.y = position.y - this.state.dragDisY - top;
		cropObj = {...this.state.cropObj, ...cropObj};
		this.setState({cropObj: cropObj});
		// this.checkCrossOver();
	};

	handleSelectionDragUp = (e)=> {
		Events.removeEventsFromDocument(this.getSelectionDragEventMap())
	};

	handleResizeOrigin(disX, disY) {
		const origin = this.resizeOrigin;
		let cropObj = {};
		console.log('handleing...resize...');
		const {originStartWidth, originStartHeight, height} = {...this.state.cropObj};
		console.log(originStartHeight, height)
		switch(origin) {
			case 'nw'://西北
				cropObj.x = this.currMouseX + disX;
				cropObj.y = this.currMouseY + disY;
				cropObj.width = originStartWidth - disX;
				cropObj.height = originStartHeight - disY;
				break;
			case 'n'://正北
				// cropObj.x = this.currMouseX - disX
				cropObj.y = this.currMouseY + disY;
				cropObj.height = originStartHeight - disY;
				cropObj.originStartWidth = originStartHeight - disY;
				break;
			case 'ne'://东北
				cropObj.y = this.currMouseY + disY;
				cropObj.width = originStartWidth + disX;
				cropObj.height = originStartHeight - disY;
				break;
			case 'e'://正东
				cropObj.width = originStartWidth + disX;
				break;
			case 'se'://东南
				cropObj.width = originStartWidth + disX;
				cropObj.height = originStartHeight + disY;
				break;
			case 's'://正南
				cropObj.height = originStartHeight + disY;
				break;
			case 'sw'://西南
				cropObj.x = this.currMouseX + disX;
				cropObj.width = originStartWidth - disX;
				cropObj.height = originStartHeight + disY;
				break;
			case 'w'://正西
				cropObj.x = this.currMouseX + disX;
				cropObj.width = originStartWidth - disX;
				break;
		}
		return cropObj;
	}

	handleSelectionResize (origin, e) {
		Events.pauseEvent(e);
		this.resizeOrigin = origin;

		let cropObj = this.setCropStateAbs(this.state.cropObj);
		cropObj = {...this.state.cropObj, ...cropObj};
		this.setState({cropObj: cropObj});

		const position = Events.getMousePosition(e);
		this.currMouseX = position.x;
		this.currMouseY = position.y;
		console.log(position);
		Events.addEventsToDocument(this.getSelectionResizeEventMap());
	}

	handleSelectionResizeMove =(e)=> {
		Events.pauseEvent(e);
		const position = Events.getMousePosition(e);
		console.log(position)
		const {left, top} = ReactDom.findDOMNode(this).getBoundingClientRect();
		const disX = position.x - this.currMouseX;
		const disY = position.y - this.currMouseY;
		console.log(disX, disY);
		if (disX===0 && disY === 0) return;
		let cropObj = this.handleResizeOrigin(disX, disY);
		cropObj = {...this.state.cropObj, ...cropObj};

		this.setState({cropObj: cropObj});

		// this.checkCrossOver();
	};

	handleSelectionResizeUp =(e)=> {
		let cropObj = {
			originStartWidth: Math.abs(this.state.cropObj.width),
			originStartHeight: Math.abs(this.state.cropObj.height)
		};
		cropObj = {...this.state.cropObj, ...cropObj};
		this.setState({cropObj: cropObj});
		Events.removeEventsFromDocument(this.getSelectionResizeEventMap());
	};

	getSelectionResizeEventMap() {
		return {
			mousemove: this.handleSelectionResizeMove,
			mouseup: this.handleSelectionResizeUp
		}
	}

	getSelectionDragEventMap() {
		return {
			mousemove: this.handleSelectionDragMove,
			mouseup: this.handleSelectionDragUp
		}
	}

	checkCrossOver() {
		let cropObj = Object.assign({},this.state.cropObj);
		console.log('check..crosso..over..');
		console.log(cropObj)
		// console.log(ReactDom.findDOMNode(this).getBoundingClientRect());
		const {width, height} = ReactDom.findDOMNode(this).getBoundingClientRect();
		//check left
		if (cropObj.x <= 0) {
			cropObj.x = 0;
		}
		//check right
		if ((cropObj.x + cropObj.originStartWidth) > width) {
			console.log('over....');
			cropObj.x = width - cropObj.originStartWidth;
			cropObj.width = width - cropObj.x;
			cropObj.originStartWidth = width - cropObj.x;
		}
		//check top
		if (cropObj.y <= 0) {
			cropObj.y = 0;
		}
		//check bottom
		if ((cropObj.y + cropObj.originStartHeight) > height) {
			console.log('over....');
			cropObj.y = height - cropObj.originStartHeight;
			cropObj.height = height - cropObj.y;
			cropObj.originStartHeight = height - cropObj.y;
		}
		cropObj = {...this.state.cropObj, ...cropObj};
		console.log('final....obj.');
		console.log(cropObj);
		return this.setState({cropObj: cropObj});
	}

	getDragValue(position) {
		const cropObj = this.state.cropObj;
		cropObj.width =  position.x - cropObj.x;
		cropObj.height = position.y - cropObj.y;
		cropObj.originStartWidth = Math.abs(cropObj.width);
		cropObj.originStartHeight = Math.abs(cropObj.height)
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
								<div className='handle-resize origin-nw' onMouseDown={this.handleSelectionResize.bind(this, 'nw')}/>
								<div className='handle-resize origin-n'  onMouseDown={this.handleSelectionResize.bind(this, 'n')}/>
								<div className='handle-resize origin-ne' onMouseDown={this.handleSelectionResize.bind(this, 'ne')}/>
								<div className='handle-resize origin-e'  onMouseDown={this.handleSelectionResize.bind(this, 'e')}/>
								<div className='handle-resize origin-se' onMouseDown={this.handleSelectionResize.bind(this, 'se')}/>
								<div className='handle-resize origin-s'  onMouseDown={this.handleSelectionResize.bind(this, 's')}/>
								<div className='handle-resize origin-sw' onMouseDown={this.handleSelectionResize.bind(this, 'sw')}/>
								<div className='handle-resize origin-w'  onMouseDown={this.handleSelectionResize.bind(this, 'w')}/>
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