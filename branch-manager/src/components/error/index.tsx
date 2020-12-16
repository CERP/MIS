import React from 'react'

interface P {
	error: Error
	errInfo: React.ErrorInfo
}

export const AppError = ({ error, errInfo }: P) => {

	return (
		<div className="h-screen w-full">
			Error!
			<div>{error.name}</div>
			<div>{error.message}</div>
			<div>{errInfo.componentStack}</div>
		</div>
	)
}