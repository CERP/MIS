import React from 'react'
import siteConfig from 'constants/siteConfig.json'

interface AppErrorProps {
	error: Error
	errInfo: React.ErrorInfo
}

export const AppError = ({ error, errInfo }: AppErrorProps) => {
	const helpline = siteConfig.helpLineIlmx

	return (
		<div className="w-full h-screen container">
			<h1>MISchool Error!</h1>
			<h2>
				Please call <a href={`tel:${helpline.phoneInt}`}>{helpline.phoneAlt}</a> or send
				screenshot
			</h2>
			<div>{error.name}</div>
			<div>{error.message}</div>
			<div>{errInfo.componentStack}</div>
		</div>
	)
}
