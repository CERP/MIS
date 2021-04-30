import React, { useState } from 'react'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/outline'

import { AppLayout } from 'components/Layout/appLayout'
import { Spinner } from 'components/animation/spinner'
import { hostHTTPS } from 'utils/hostConfig'
import siteConfig from 'constants/siteConfig.json'

export const ResetSchoolPassword = () => {
	const [state, setState] = useState({
		isSending: false,
		hasSent: false,
		schoolId: ''
	})

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		if (state.schoolId.trim().length === 0) {
			return toast.error('Please enter valid school id')
		}

		const reqOpts: RequestInit = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ schoolId: state.schoolId })
		}

		setState({ ...state, isSending: true })

		await fetch(`${hostHTTPS}/mis/school-password-reset`, reqOpts)
			.then((res: Response) => res.json())
			.then(data => {
				console.log(data)
				setState({ isSending: false, hasSent: true, schoolId: '' })
				toast.success(data.message)
			})
			.catch(error => {
				console.log(error)
				setState({ ...state, isSending: false })
				toast.error('Something went wrong, Please retry again!')
			})
	}

	return (
		<AppLayout title={'School Login'}>
			<div className="p-5 pb-0 md:p-10 md:pb-0 text-gray-700">
				<div className="flex flex-col items-center space-y-2">
					<div className="text-2xl font-bold 2xl:text-3xl">Reset School Password</div>
				</div>

				<div className="w-full mt-5 px-5 md:mt-10 md:px-16">
					<div className="bg-white shadow mx-auto border border-gray-150 md:w-1/3 rounded-xl py-6 px-6 md:px-8">
						{state.hasSent ? (
							<div className="flex flex-col items-center justify-center space-y-4">
								<CheckCircleIcon className="text-teal-brand w-16 h-16" />
								<div className="text-center">
									Please contact at {siteConfig.helpLineIlmx.phoneInt}, If you
									don't hear from us within 24 hours.
								</div>
								<Link
									to="/school-login"
									className="tw-btn-blue flex w-full justify-center">
									<ArrowLeftIcon className="mr-4 w-6" />
									<span>Back to Login</span>
								</Link>
							</div>
						) : (
							<form
								onSubmit={handleSubmit}
								className="flex flex-col justify-items-start">
								<div className="my-2">Mobile Number (School Id)</div>
								<input
									name="school"
									autoFocus={true}
									required
									onChange={event =>
										setState({ ...state, schoolId: event.target.value })
									}
									value={state.schoolId}
									autoCapitalize="off"
									autoCorrect="off"
									autoComplete="off"
									placeholder="Enter school id"
									className="tw-input"
								/>

								<div className="mt-6 text-center">
									<button
										className={clsx(
											'inline-flex items-center w-full tw-btn-blue px-5 md:px-8 py-3 mb-2',
											{
												'pointer-events-none cursor-not-allowed':
													state.isSending
											}
										)}>
										{state.isSending ? (
											<>
												<Spinner className={'animate-spin h-5 w-5'} />
												<span className={'mx-auto animate-pulse'}>
													Sending Request
												</span>
											</>
										) : (
											<span className={'mx-auto'}>Send Request</span>
										)}
									</button>
								</div>
							</form>
						)}
					</div>
				</div>
			</div>
		</AppLayout>
	)
}
