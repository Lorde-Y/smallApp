import {Component} from 'react';
import templatesData from 'components/common/data';
import './innerpage.less';

// noitce: 计算适配， 首先 要计算当前元素在原来编辑区域窗口所占比例。乘以当前窗口宽，就是现在的实际大小。
//先把长宽，位置确定。
let calOuterStyle = (cmp)=> {
	let outerStyle = cmp.style;
	let deviceWidth = window.defaultWidth;
	let deviceHeight = window.defaultHeight;
	let clientWidth = document.documentElement.clientWidth;
	let clientHeight = document.documentElement.clientHeight - 64;
	let animationString = '';
	let animation = [];
	cmp.animation = cmp.animation ? cmp.animation : [];
	for(let key in cmp.animation) {
		let value = cmp.animation[key];
		if(!value.name || value.name == 'none'){
			continue;
		}
		let name = value.name;
		let duration = value.duration ? value.duration : 1;
		let timingFun = value.timingFun ? value.timingFun : 'ease';
		let delay = value.delay ? value.delay : 0;
		let animationCount = value.animationCount ? value.animationCount : 1;
		let fillMode = value.fillMode ? value.fillMode : 'both';
		animationString = `${name} ${duration}s ${timingFun} ${delay}s ${animationCount} ${fillMode}` ;
		animation.push(animationString);
	}
	animationString = animation.join(',');
	// outerStyle.width/deviceWidth * 100 + '%',
	// (outerStyle.height == 'auto') ? outerStyle.height : outerStyle.height/deviceHeight * 100 + '%',
	return {
		"position": "absolute",
		"width": outerStyle.width/deviceWidth * clientWidth / window.fontSize + 'rem',
		"height": (outerStyle.height == 'auto') ? outerStyle.height : outerStyle.height/deviceHeight * clientHeight / window.fontSize + 'rem',
		"overflow": outerStyle["overflow"] ? outerStyle["overflow"] : null,
		"left": parseFloat(outerStyle.left/deviceWidth) * 100 + '%',
		"top": parseFloat(outerStyle.top/deviceHeight) * 100 + '%',
		"zIndex": outerStyle["z-index"] ? outerStyle["z-index"] : 0,
		"opacity": outerStyle.opacity ? outerStyle.opacity : 1,
		"animation": animationString,
		"WebkitAnimation": animationString,
		"MozAnimation": animationString,
		"msAnimation": animationString,
		"transform": outerStyle.transform ? outerStyle.transform : null,
		"WebkitTransform": outerStyle.transform ? outerStyle.transform : null
	};
};

let calInnerStyle = (cmp)=> {
	let clientWidth = document.documentElement.clientWidth;
	let innerStyle = cmp.style;
	if (typeof innerStyle['font-size'] == undefined || !innerStyle['font-size']) {
		innerStyle['font-size'] = 14;
	}
	//计算font-size的时候，要计算一下这个字体在原来编辑页面所占的比例  font-size/原编辑页面*现在的页面的大小，就是现在所占的比例。
	return {
		"fontSize": innerStyle['font-size']/window.defaultWidth * clientWidth/window.fontSize + 'rem',
		"fontFamily": innerStyle['font-family'] ? innerStyle['font-family'] : null,
		"backgroundColor": innerStyle['background-color'] ? innerStyle['background-color'] : null,
		"borderRadius": innerStyle['border-radius'] ? innerStyle['border-radius'] + 'px' : null,
		"borderWidth": innerStyle['border-width'] ? innerStyle['border-width'] + 'px' : null,
		"borderColor": innerStyle['border-color'] ? innerStyle['border-color'] : '#000',
		"transform": innerStyle['transform'] ? innerStyle['transform'] : null,
		"WebkitTransform": innerStyle['transform'] ? innerStyle['transform'] : null,
		"boxShadow": innerStyle['box-shadow'] ? innerStyle['box-shadow'] : null,
		"WebkitBoxShadow": innerStyle['box-shadow'] ? innerStyle['box-shadow'] : null,
		"opacity": innerStyle['opacity'] ? innerStyle['opacity'] : 1
	};
}

let formatJsonToString = (obj)=> {
	let value = null;
	let string = '';
	for(let key in obj) {
		value = obj[key];
		string += `${key}:${value};`;
	}
	return string
};

let createImageCmp = (cmpObj)=> {
	if (typeof cmpObj.file === undefined || typeof cmpObj.url === undefined) {
		return;
	}
	// let outerStyle = calOuterStyle(cmp);主要是长宽，位置,外面套一层 div,保证一直是相对 浏览器来处理位置。
	let outerStyle = calOuterStyle(cmpObj);
	let width = parseFloat(outerStyle.width.replace('rem', '')) * window.fontSize;
	let height = parseFloat(outerStyle.height.replace('rem', '')) * window.fontSize;
	//  let innerStyle = calInnerStyle(cmp);主要是字体大小，border,color等。
	let innerStyle = calInnerStyle(cmpObj);
	let style1 = formatJsonToString(outerStyle);
	let style2 = formatJsonToString(innerStyle);
	return <div id={"cmp-"+cmpObj.tid} className="cmp image" key={cmpObj.tid} data-id={cmpObj.tid} style={outerStyle}>
					<img src={cmpObj.file.key} style={innerStyle}  width={width} height={height}/>
			</div>
	// let cmpHtml = `<div id="cmp-${cmpObj.tid}" class="cmp image" data-id="${cmpObj.tid}" style="${formatJsonToString(outerStyle)}">
	// 				<img src=${cmpObj.file.key} style=${formatJsonToString(innerStyle)}  width="${width}" height="${height}"/>
	// 		</div>`;
	// return cmpHtml;
};

let createTextCmp = (cmpObj)=> {
	// let outerStyle = calOuterStyle(cmp);主要是长宽，位置
	let outerStyle = calOuterStyle(cmpObj);
	//  let innerStyle = calInnerStyle(cmp);主要是字体大小，border,color等。
	let innerStyle = calInnerStyle(cmpObj);
	let style = cmpObj.style;
	let clientHeight = document.documentElement.clientHeight - 64;
	let textStyle = {
		"lineHeight": style['line-height'] ? style['line-height']/window.defaultHeight * clientHeight/window.fontSize + 'rem' : "auto",
		"color": style["color"] ? style["color"] : "black",
		"textAlign": style["text-align"] ? style["text-align"] : "left"
	};
	innerStyle = Object.assign(innerStyle, innerStyle, textStyle);
	return <div id={"cmp-"+cmpObj.tid} className="cmp text" key={cmpObj.tid} data-id={cmpObj.tid} style={outerStyle}>
					<div className="cmp-inner text" style={innerStyle} dangerouslySetInnerHTML={{__html:cmpObj.text}} />
			</div>
	// let cmpHtml = `<div id="cmp-${cmpObj.tid}" data-id="${cmpObj.tid}" style="${formatJsonToString(outerStyle)}">
	// 				<div class="cmp-inner text" style="${formatJsonToString(innerStyle)}">
	// 					${cmpObj.text}
	// 				</div>
	// 		</div>`;
	// return cmpHtml;
};

export default class InnerPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentPage: 0,
			pageData: templatesData
		}
		//获取 编辑时，所用的尺寸，然后按照编辑时候的尺寸进行
		window.defaultWidth = this.state.pageData.width;
		window.defaultHeight = this.state.pageData.height;
		window.clientHeight = document.documentElement.clientHeight;
		//touch event params
		this.startY = null;
		this.moveY = null;
		this.distanceY = null;
		this.pageSlide = null;
		this.pageIndex = 0;
		this.pagesLen = 0;
	}
	createPage() {
		// document.getElementById('app').innerHTML = html;
		let pagesArr = this.state.pageData.pages;
		this.pagesLen = pagesArr.length;
		let pagesData = null;
		let pageLiNodes = [];
		let html = '';
		let current = 'current';
		for(let key in pagesArr) {
			if(key != 0) {
				current = '';
			}
			pagesData = pagesArr[key];
			console.log(pagesData)
			html = this.forEachCmps(pagesData);
			let addClass = `${key} ${current}`;
			pageLiNodes.push(<li className={"page-li page-"+addClass}  data-index={key} key={key}>{html}</li>);
		}
		console.log(pageLiNodes)
		return pageLiNodes;
	}
	forEachPages() {

	}
	forEachCmps(pagesData) {
		// let pagesData = this.state.pageData.pages[0];
		let cmpsArr = pagesData.cmps;
		let cmp = null;
		let cmpsHtml = [];
		for(let key in cmpsArr) {
			cmp = cmpsArr[key];
			cmpsHtml.push(this.judgeCmpType(cmp));
		}
		return cmpsHtml;
	}
	judgeCmpType(cmp) {
		switch(cmp.cmpType) {
			case "image":
				return createImageCmp(cmp);
				break;
			case "text":
				return createTextCmp(cmp);
				break;
			default:
				break;
		}
	}
	handleTouchStart(e) {
		// onTouchCancel onTouchEnd onTouchMove onTouchStart
		e.preventDefault();
		this.ulDom = document.getElementById('pages-ul');
		let touches = e.touches[0];
		console.log(touches.pageY)
		this.startY = touches.pageY;
		console.log(this.startY);
		let currentLi = this.ulDom.querySelector('.current');
		this.pageIndex = parseInt(currentLi.getAttribute('data-index'));
		console.log(this.pageIndex)
	}
	handleTouchMove(e) {
		// console.log('i am moving......');
		e.preventDefault();
		let touches = e.touches[0];
		this.moveY = touches.pageY;
		// console.log(this.moveY);
		this.distanceY =  this.startY - this.moveY;
		let mathAbs = Math.abs(this.distanceY);
		// if (this.pageIndex == this.pagesLen) {
		// 	return
		// }
		if (this.distanceY >= 0 && mathAbs >50 && this.pageIndex != this.pagesLen-1) {
			//page Up
			this.pageSlide = 'UP';
			
			// this.ulDom.style.transform = `translateY(-${this.pageIndex * 100}%)`;
			this.ulDom.style.transform = `translateY(-${this.distanceY}px)`;
		}
		if(this.distanceY < 0 && mathAbs > 50 && this.pageIndex != 0){
			//page down
			this.pageSlide = 'DOWN';
			
			// this.ulDom.style.transform = `translateY(${this.pageIndex * 100}%)`;
			this.ulDom.style.transform = `translateY(${this.distanceY}px)`;
		}
		// console.log(this.distanceY);
		console.log(this.pageIndex)
	}
	handleTouchEnd(e) {
		console.log('ending.............');
		let mathAbs = Math.abs(this.distanceY);
		if (this.pageSlide == 'UP') {
			console.log(this.pageIndex)
			this.pageIndex++;
			// if(this.pageIndex == this.pagesLen)
			this.ulDom.style.transform = `translateY(-${this.pageIndex * 100}%)`;
		}
		if (this.pageSlide == 'DOWN') {
			this.pageIndex--;
			this.ulDom.style.transform = `translateY(${this.pageIndex * 100}%)`;
		}
		setTimeout(()=>{
			this.ulDom.children[this.pageIndex-1].className = `page-li page-${this.pageIndex}`;
			this.ulDom.children[this.pageIndex].className += ' current';
		}, 1200)
		
		// if (mathAbs < 300) {
		// 	//如果滑动距离小于100， 取消滑动。
		// 	this.ulDom.style.transform = `translateY(0px)`
		// }
		// if (this.pageSlide === 'UP') {
		// 	//向上滑动，下一页
		// 	this.toNextPage();
		// }
		// if (this.pageSlide === 'DOWN') {
		// 	//向下滑动，上一页
		// 	this.toPrevPage();
		// }
	}
	toPrevPage() {

	}
	toNextPage() {

	}
	render() {
		let nodes = this.createPage();
		let touceEvents = {
			onTouchStart: this.handleTouchStart.bind(this),
			onTouchMove: this.handleTouchMove.bind(this),
			onTouchEnd: this.handleTouchEnd.bind(this)
		};
		return (
			<ul className='pages-ul' id='pages-ul' {...touceEvents}>{nodes}</ul>
		)
	}
}
InnerPage.defaultProps = {
	startY: null,
	moveY: null,
	distanceY: null
};


