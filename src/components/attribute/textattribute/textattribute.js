import {Component} from 'react';
import {Enhance} from 'components/attributepanel';

class TextAttribute extends Component {
	constructor(props) {
		super(props);
		console.log(props)
	}
	render() {
		return (
			<div className='fuck'>ddddddddddddd</div>
		);
		
	}
}
export default Enhance(TextAttribute);