import React, { InputHTMLAttributes } from 'react'

interface PhoneInputType extends InputHTMLAttributes<HTMLInputElement> {
	error?: boolean
}

export const PhoneInput = ({ children, error, ...rest }: PhoneInputType) => {
	const { className, ...restProps } = rest
	return (
		<div>
			<input
				className={className}
				autoComplete="off"
				type="text"
				placeholder="Mobile number e.g. 03xxxxxxxxx"
				{...restProps}>
				{children}
			</input>
			{error && (
				<div className="my-2 text-left text-red-400 text-sm">
					Enter a valid phone number
				</div>
			)}
		</div>
	)
}
