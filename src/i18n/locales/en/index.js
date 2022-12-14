import chat from './chat.js';

const translation = {
	translation: {
		header: {
			login: 'Log in',
			greeting: 'Welcome',
			back: 'Back',
		},
		navigation: {
			chat: 'Dialogs',
		},
		login: {
			label: 'Log in',
			email: 'E-mail',
			password: 'Password',
			forgot: 'Forgot password',
			'stay-logined': 'Remember me',
			register: 'register now!',
			login: 'Log in',
			errors: {
				'email-empty': 'Please input your e-mail!',
				'password-empty': 'Please input your password!',
				'email-incorrect': 'Incorrect e-mail!',
				'incorrect-credentials': 'User with this e-mail is not exist',
				'incorrect-password': 'Incorrect password',
			},
		},
		register: {
			email: 'E-mail',
			password: 'Password',
			'confirm-password': 'Confirm password',
			firstName: 'First name',
			'firstName-tooltip': 'Your first name',
			secondName: 'Second name',
			'secondName-tooltip': 'Your second name',
			submit: 'Register now!',
			errors: {
				'email-empty': 'Please input your e-mail!',
				'email-invalid': 'The input is not valid E-mail!',
				'password-empty': 'Please input your password!',
				'password-short': 'Minimal length is 6 symbols',
				'password-not-confirmed': 'Please confirm your password!',
				'password-not-match':
					'The two passwords that you entered do not match!',
				'firstName-empty': 'Please input your first name!',
				'secondName-empty': 'Please input your second name!',
			},
		},
		chat,
	},
};

export default translation;
