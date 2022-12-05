/* eslint-disable react/jsx-props-no-spreading */
import './index.css';

import React from 'react';
import { useField } from 'formik';
import Input, { InputInterface } from 'ui-components/Input';

type FieldInputInterface = { label: string; name: string } & InputInterface;

function FieldInput({ label, ...props }: FieldInputInterface) {
	const [field, meta] = useField(props.name);

	return (
		<label htmlFor={props.name} className="field-input">
			<span className="typography sublabel">{label}</span>
			<Input {...field} {...props} />
			{meta.touched && meta.error ? (
				<div className="field-error">{meta.error}</div>
			) : null}
		</label>
	);
}

export default FieldInput;
