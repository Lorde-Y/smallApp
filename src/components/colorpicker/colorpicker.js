import React, {Component} from 'react';
import Color from 'components/color';
// import { CustomPicker, Slider} from 'react-color';

import './colorpicker.less';

class PickColor extends Component {
		constructor(props) {
			super(props);
			console.log(props);
			this.state = {
				color: '#cd2b77'
			}
		}
		handleChange = (color)=> {
			console.log(color)
			this.setState({
				color: color
			})
		};
		render() {
			return (
				<div className='color-picker-custome'>
					<Color color={this.state.color} onChange={this.handleChange}/>
				</div>
			)
		}
}

export default PickColor