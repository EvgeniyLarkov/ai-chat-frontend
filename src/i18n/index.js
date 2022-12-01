import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import { en, ru } from './locales';

const options = {
	fallbackLng: 'en',
	debug: process.env.NODE_ENV === 'development',
};

export default function initLocalization() {
	i18next
		.use(LanguageDetector)
		.use(initReactI18next)
		.init({
			...options,
			resources: {
				en,
				ru,
			},
		});
}
