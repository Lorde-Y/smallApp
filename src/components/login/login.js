import {Component} from 'react';
import './login.less';

export default class Login extends Component {
	render() {
		return(
			<div className='login-container'>
				<div className='login-account login-item'>
					<label>账号：</label>
					<input type='text' />
				</div>
				<div className='login-pass login-item'>
					<label>密码：</label>
					<input type='password' />
				</div>
			</div>
		)
	}
}
