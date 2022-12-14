import { Form, Formik, FormikHelpers } from 'formik';
import { observer } from 'mobx-react-lite';
import React, { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from 'storage';
import Button from 'ui-components/Button';
import FieldInput from 'ui-components/FieldInput';
import InlineButton from 'ui-components/InlineButton';
import { isSuccessRequest } from 'utils/requestHelper';

import * as Yup from 'yup';
import './index.css';

type FormValues = {
	firstName: string;
	lastName: string;
	email: string;
};

const ProfileBox = observer(() => {
	const { t } = useTranslation();
	const { user } = useStore();

	const [hasLogo, setHasLogo] = useState(!!user.photo);
	const [photoPath, setPhotoPath] = useState(user.photo);
	const [newFileUuid, setNewFileUuid] = useState<string | null>(null);

	const initialValues: FormValues = {
		firstName: user.name || '',
		lastName: user.lastName || '',
		email: user.email || '',
	};

	const handleLogoUpload = (event: ChangeEvent<HTMLInputElement>) => {
		const userLogo = event.currentTarget.files?.[0];

		if (userLogo) {
			user.uploadFile(userLogo).then((res) => {
				if (isSuccessRequest(res)) {
					setHasLogo(true);
					setPhotoPath(res.path);
					setNewFileUuid(res.uuid);
				} else {
					setHasLogo(false);
					setPhotoPath(null);
					setNewFileUuid(null);
				}
			});
		}
	};

	const handleSubmit = (
		values: FormValues,
		formikHelpers: FormikHelpers<any>
	) => {
		user
			.updateUserData({
				firstName: values.firstName,
				lastName: values.lastName,
				...(newFileUuid && { photo: newFileUuid }),
			})
			.then(console.log);
	};

	const validationShema = Yup.object().shape({
		lastName: Yup.string()
			.trim()
			.matches(/^[A-zА-я]+$/, t('profile.errors.only-letters'))
			.required(t('profile.errors.lastName-empty')),
		firstName: Yup.string()
			.trim()
			.matches(/^[A-zА-я]+$/, t('profile.errors.only-letters'))
			.required(t('profile.errors.firstName-empty')),
	});

	return (
		<div className="profile-outer">
			<div className="profile-inner">
				<div className="profile-container container">
					<div className="profile-header">
						<div className="profile-header_label typography label">
							{t('profile.label')}
						</div>
						<div className="divider" />
						<Formik
							initialValues={initialValues}
							validationSchema={validationShema}
							validateOnChange
							onSubmit={handleSubmit}
						>
							<Form>
								<div className="profile-main_top">
									<div className="profile-main_avatar-wrapper">
										<div className="profile-main_avatar container">
											{hasLogo ? (
												<img
													className="profile-main_avatar-img"
													src={photoPath || ''}
													alt={`${user.name} ${user.lastName}`}
												/>
											) : (
												<div className="profile-main_avatar-no-logo-wrapper">
													<div className="profile-main_avatar-no-logo typography sublabel">
														{t('profile.no-logo')}
													</div>
													<InlineButton>
														{t('profile.upload-logo')}
														<input
															type="file"
															accept="image/*"
															className="hidden_avatar_upload"
															onChange={handleLogoUpload}
														/>
													</InlineButton>
												</div>
											)}
										</div>
									</div>
									<div className="profile-main_maininfo-wrapper">
										<FieldInput
											name="firstName"
											type="firstName"
											autoComplete="on"
											label={t('profile.firstName')}
										/>
										<FieldInput
											name="lastName"
											type="lastName"
											autoComplete="on"
											label={t('profile.lastName')}
										/>
									</div>
								</div>
								<div className="profile-main_additional-wrapper">
									<FieldInput
										name="email"
										type="email"
										readOnly
										label={t('profile.email')}
									/>
								</div>
								<div className="profile-main_actions-wrapper">
									<Button theme="primary" type="submit">
										{t('profile.save')}
									</Button>
								</div>
							</Form>
						</Formik>
					</div>
				</div>
			</div>
		</div>
	);
});

export default ProfileBox;
