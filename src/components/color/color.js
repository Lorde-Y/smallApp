import React, {Component} from 'react';
import { CustomPicker, SliderPicker, HuePicker, SwatchesPicker  } from 'react-color';
import {Saturation, Hue, EditableInput, Swatch, SliderPointer} from 'react-color/lib/components/common';
import {Slider} from 'react-color/lib/components/slider/Slider';

import './color.less';

const fuckPointer = ({})=> (
	<div className='pointer' />
);

const ProhibitColor = ({})=> (
	<div className='prohibit-color'>
		<div className='line' />
	</div>
);

const BgGrid = ({cls, items})=> (
	<ul className={`bg-grid ${cls} clearfix`}>
		{
			items.map((item, idx)=>(
				<li
					key={idx}
					style={{background: item}}
				/>
			))
		}
	</ul>
);

const defaultColor = ['#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688'];

const gradientColor = ['#ec4064', '#ab47bc', '#673ab7', '#5c6bc0', '#42a5f5', '#26a69a', '#81c784', '#ffeb3b', '#ffa726', '#ff5722'];
const defaultImage = [];
const brightnessArr = [30, 40];
let bgColor = [...gradientColor];

function increaseBrightness(hex, percent){
	// strip the leading # if it's there
	hex = hex.replace(/^\s*#|\s*$/g, '');

	// convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
	if(hex.length == 3){
			hex = hex.replace(/(.)/g, '$1$1');
	}

	let r = parseInt(hex.substr(0, 2), 16);
	let g = parseInt(hex.substr(2, 2), 16);
	let b = parseInt(hex.substr(4, 2), 16);

	return '#' +
		((0|(1<<8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
		((0|(1<<8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
		((0|(1<<8) + b + (256 - b) * percent / 100).toString(16)).substr(1);
}

for (let i = 0; i < brightnessArr.length; i++) {
	for (let j = 0; j < gradientColor.length; j++) {
		bgColor.push(increaseBrightness(gradientColor[j], brightnessArr[i]));
	}
}

const whiteOrblack = ['#fff', '#b5b6b6', '#898989', '#5a5a5a', '#373737', '#232323', '#161616', '#0e0e0e', '#000'];
class Color extends Component {
		constructor(props) {
			super(props);
			console.log(props);
		}
		handleChange = (color)=> {
			console.log(color)
			this.props.onChange(color)
		};
		render() {
			console.log(this.props)
			const styles = {
				pointer: {
					width: '16px',
					height: '16px'
				},
				slider: {
					width: '16px',
					height: '16px'
				}
			};
			var inputStyles = {
				wrap: {
					position: 'relative',
					marginTop: '17px',
				},
				input: {
					textIndent: '10px',
					border: 'none',
					width: '165px',
					height: '21px',
					lineHeight: '21px',
					fontSize: '12px',
					color: '#999',
					borderRadius: '4px'
				}
			};
			return (
				<div className='color-panel'>
					<div className='saturation-block'>
						<Saturation
							{...this.props}
							onChange={ this.handleChange }
						/>
					</div>
					<div className='color-setting clearfix'>
						<div className='current-color pull-left' style={{background: `${this.props.hex}`}}></div>
						<div className='color-slider pull-left'>
							<Hue
								{...this.props}
								onChange={ this.handleChange }
							/>
							<EditableInput
								// value={ typeof(this.props.color) === 'string' ? this.props.color : this.props.hex}
								value={this.props.hex}
								onChange={ this.handleChange }
								style={inputStyles}
							/>
						</div>
					</div>
					<div className='color-block'>
						<BgGrid 
							cls="default-color"
							items={defaultColor}
						/>
						<BgGrid
							cls="bggrid-color"
							items={bgColor}
							onClick={ val => this.props.updatePage({bgcol: val}) }
						/>
						<ProhibitColor />
						<BgGrid
							cls="white-black-color"
							items={whiteOrblack}
							onClick={ val => this.props.updatePage({bgcol: val}) }
						/>
					</div>
				</div>
			)
		}
}

export default CustomPicker(Color)