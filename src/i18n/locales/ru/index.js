import chat from './chat.js';
import profile from './profile.js';

const translation = {
	translation: {
		header: {
			login: 'Войти',
			register: 'Регистрация',
			greeting: 'Здравствуйте,',
			back: 'Назад',
		},
		navigation: {
			chat: 'Диалоги',
			profile: 'Профиль',
		},
		login: {
			label: 'Войти',
			email: 'E-mail',
			password: 'Пароль',
			forgot: 'Забыл пароль',
			'stay-logined': 'Запомнить',
			register: 'зарегистрируйтесь сейчас',
			login: 'Войти',
			errors: {
				'email-empty': 'Укажите e-mail!',
				'email-incorrect': 'Неверный e-mail!',
				'password-empty': 'Введите пароль',
				'incorrect-credentials': 'Нет пользователя с e-mail',
				'incorrect-password': 'Неверный пароль',
			},
		},
		register: {
			email: 'E-mail',
			password: 'Пароль',
			'confirm-password': 'Подтвердите пароль',
			firstName: 'Имя',
			'firstName-tooltip': 'Валерий',
			secondName: 'Фамилия',
			'secondName-tooltip': 'Жмышенко',
			submit: 'Зарегестрироваться',
			errors: {
				'email-empty': 'Укажите e-mail!',
				'email-invalid': 'Некорректный e-mail!',
				'password-empty': 'Введите пароль',
				'password-short': 'Минимальная длина пароля составляет 6 символов',
				'password-not-confirmed': 'Подтвердите пароль!',
				'password-not-match': 'Пароли не совпадают',
				'firstName-empty': 'Введите Ваше имя',
				'secondName-empty': 'Введите Вашу фамилию',
			},
		},
		chat,
		profile,
	},
};

export default translation;
