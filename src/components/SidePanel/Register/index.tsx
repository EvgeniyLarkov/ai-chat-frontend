/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'ui-components/Button';

import * as Yup from 'yup';

import './index.css';
import { useStore } from 'storage';
import { Formik, Form, FormikHelpers } from 'formik';
import FieldInput from 'ui-components/FieldInput';
import { isSuccessRequest } from 'utils/requestHelper';
import { UnsuccssesRequest } from 'core/TransportLayer/types';
import { observer } from 'mobx-react-lite';
import { UserLoginData } from 'storage/user/types';

type FormValues = {
	email: string;
	password: string;
	confirmPassword: string;
	firstName: string;
	lastName: string;
};

type RegisterBoxInterface = {
	successCallback: ({ email, password }: UserLoginData) => void;
};

const RegisterBox = observer(({ successCallback }: RegisterBoxInterface) => {
	const { t } = useTranslation();
	const { user } = useStore();

	const initialValues: FormValues = {
		email: '',
		password: '',
		confirmPassword: '',
		firstName: '',
		lastName: '',
	};

	const handleSetServerError = (
		result: UnsuccssesRequest,
		formikHelpers: FormikHelpers<any>
	): void => {
		if (result.data?.errors?.email === 'emailExists') {
			formikHelpers.setErrors({
				email: t('login.errors.incorrect-credentials'),
			});
		} else if (result.data?.errors?.password === 'incorrectPassword') {
			formikHelpers.setErrors({
				password: t('login.errors.incorrect-password'),
			});
		}
	};

	const handleSubmit = (
		values: FormValues,
		formikHelpers: FormikHelpers<any>
	) => {
		user
			.register({
				email: values.email,
				password: values.password,
				firstName: values.firstName,
				lastName: values.lastName,
			})
			.then((result) => {
				if (!isSuccessRequest(result)) {
					handleSetServerError(result, formikHelpers);
				} else {
					successCallback({ email: values.email, password: values.password });
				}
			});
	};

	const validationShema = Yup.object().shape({
		email: Yup.string()
			.email(t('register.errors.email-incorrect'))
			.required(t('register.errors.email-empty')),
		password: Yup.string()
			.min(6, t('register.errors.password-short'))
			.required(t('register.errors.password-empty')),
		confirmPassword: Yup.string()
			.min(6, t('register.errors.min-length'))
			.oneOf(
				[Yup.ref('password'), null],
				t('register.errors.password-not-match')
			)
			.required(t('register.errors.password-not-confirmed')),
		firstName: Yup.string().required(t('register.errors.firstName-empty')),
		lastName: Yup.string().required(t('register.errors.secondName-empty')),
	});

	return (
		<div className="login-box">
			<Formik
				initialValues={initialValues}
				validationSchema={validationShema}
				validateOnChange
				onSubmit={handleSubmit}
			>
				<Form className="login-box-inner">
					<FieldInput
						name="firstName"
						autoComplete="on"
						placeholder={t('register.firstName-tooltip')}
						label={t('register.firstName')}
					/>
					<FieldInput
						name="lastName"
						autoComplete="on"
						placeholder={t('register.secondName-tooltip')}
						label={t('register.secondName')}
					/>
					<FieldInput
						name="email"
						type="email"
						autoComplete="on"
						label={t('register.email')}
					/>
					<FieldInput
						name="password"
						type="password"
						autoComplete="on"
						label={t('register.password')}
					/>
					<FieldInput
						name="confirmPassword"
						type="confirmPassword"
						autoComplete="on"
						label={t('register.confirm-password')}
					/>
					<div className="login-box-line">
						<Button theme="primary" fullWidth type="submit">
							{t('register.submit')}
						</Button>
					</div>
				</Form>
			</Formik>
		</div>
	);
});

export default RegisterBox;
