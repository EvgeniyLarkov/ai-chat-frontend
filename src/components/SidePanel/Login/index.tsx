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

type FormValues = {
	email: string;
	password: string;
};

type LoginBoxInterface = {
	successCallback: () => void;
};

const LoginBox = observer(({ successCallback }: LoginBoxInterface) => {
	const { t } = useTranslation();
	const { user } = useStore();

	const initialValues: FormValues = { email: '', password: '' };

	const handleSetServerError = (
		result: UnsuccssesRequest,
		formikHelpers: FormikHelpers<any>
	): void => {
		if (result.data?.errors?.email === 'emailNotExists') {
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
			.login({
				email: values.email,
				password: values.password,
			})
			.then((result) => {
				if (!isSuccessRequest(result)) {
					handleSetServerError(result, formikHelpers);
				} else {
					successCallback();
				}
			});
	};

	const validationShema = Yup.object().shape({
		email: Yup.string()
			.email(t('login.errors.email-incorrect'))
			.required(t('login.errors.email-empty')),
		password: Yup.string().required(t('login.errors.password-empty')),
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
						name="email"
						type="email"
						autoComplete="on"
						label={t('login.email')}
					/>
					<FieldInput
						name="password"
						type="password"
						autoComplete="on"
						label={t('login.password')}
					/>
					<div className="login-box-line">
						<Button theme="primary" fullWidth type="submit">
							{t('login.login')}
						</Button>
					</div>
				</Form>
			</Formik>
		</div>
	);
});

export default LoginBox;
