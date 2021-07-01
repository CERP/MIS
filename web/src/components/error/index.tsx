import React from 'react'
import siteConfig from 'constants/siteConfig.json'
import { ExclamationIcon } from '@heroicons/react/outline'

interface AppErrorProps {
	error: Error
	errInfo: React.ErrorInfo
}

export const AppError = ({ error, errInfo }: AppErrorProps) => {
	const helpline = siteConfig.helpLineIlmx
	return (
		<div className="min-w-screen min-h-screen bg-gray-brand flex items-center p-5 lg:p-20 overflow-hidden relative">
			<div className="flex-1 min-h-full min-w-full rounded-3xl bg-white shadow-xl p-8 lg:p-20 text-gray-800 relative md:flex items-center">
				<div className="w-full md:w-2/3">
					<div className="mb-4 text-gray-600">
						<h1 className="font-black text-lg lg:text-3xl mb-4 text-center md:text-left">
							MISchool has encountered an error <span>😓</span>
						</h1>
						<div className="mb-2">
							Please call us at{' '}
							<a
								className="underline text-blue-brand font-semibold text-lg"
								href={`tel:${helpline.phoneInt}`}>
								{helpline.phoneAlt}
							</a>{' '}
							<span className="font-semibold">OR</span> Send screenshot via Whatsapp!
						</div>
						<p>
							<span className="font-semibold">{error?.name}</span>: {error?.message}
						</p>
						<p className="overflow-x-auto">
							<span className="font-semibold">Path</span>: {window.location.pathname}
						</p>
						<p className="overflow-x-auto md:truncate md:overflow-ellipsis">
							<span className="font-semibold">Trace</span>:{' '}
							{errInfo?.componentStack
								? errInfo?.componentStack?.substr(
									0,
									errInfo?.componentStack?.indexOf('div') - 4
								)
								: ''}
						</p>
					</div>
					<div className="flex justify-center md:justify-start">
						<a href="/home" className="tw-btn-blue">
							Go to Home
						</a>
					</div>
				</div>
				<div className="w-full md:w-1/2 text-center hidden md:block">
					<ExclamationIcon className="w-40 h-40 md:w-48 md:h-48 mx-auto text-red-brand" />
				</div>
			</div>
			<div className="w-64 md:w-96 h-96 md:h-full bg-white bg-opacity-30 absolute -top-64 md:-top-96 right-20 md:right-32 rounded-full pointer-events-none -rotate-45 transform"></div>
			<div className="w-96 h-full bg-white bg-opacity-20 absolute -bottom-96 right-64 rounded-full pointer-events-none -rotate-45 transform"></div>
		</div>
	)
}
