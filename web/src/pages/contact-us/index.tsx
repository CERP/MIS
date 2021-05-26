import React, { useState } from 'react'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import { PhoneIcon, LocationMarkerIcon, MailIcon } from '@heroicons/react/solid'

import SiteConfig from 'constants/siteConfig.json'
import { AppLayout } from 'components/Layout/appLayout'
import { hostHTTPS } from 'utils/hostConfig'
import { isValidPhone } from 'utils/helpers'
import { Spinner } from 'components/animation/spinner'

const initialState = {
	isSending: false,
	form: {
		name: '',
		phone: '',
		message: ''
	}
}

export const ContactUs = () => {
	const [state, setState] = useState(initialState)

	const handleInputChange = (
		event: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>
	) => {
		const { name, value } = event.target
		setState({ ...state, form: { ...state.form, [name]: value } })
	}

	const handleFormSubmit = async (event: React.FormEvent) => {
		event.preventDefault()

		// check phone is valid
		// check name or message is filled
		if (!isValidPhone(state.form.phone)) {
			return toast.error('Please enter valid phone number')
		}

		if (state.form.name.trim().length < 3 || state.form.message.trim().length < 10) {
			return toast.error('Please enter valid name or message', {
				duration: 5000
			})
		}

		const reqOpts: RequestInit = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(state.form)
		}

		setState({ ...state, isSending: true })

		await fetch(`${hostHTTPS}/mis/contact-us`, reqOpts)
			.then((res: Response) => res.json())
			.then(data => {
				console.log(data)
				setState(initialState)
				toast.success('Your request has been submitted!')
			})
			.catch(error => {
				console.log(error)
				setState({ ...state, isSending: false })
				toast.error('Something went wrong, Please retry!')
			})
	}

	return (
		<AppLayout title={'Contact Us'}>
			<div className="min-h-screen p-5 pb-10 md:p-10 md:pb-0 bg-gray-900">
				<div className="flex flex-col md:flex-row md:w-4/5 space-y-4 md:space-y-0 md:space-x-8 mx-auto mt-10">
					<div className="w-full md:w-2/5 flex flex-col space-y-4 md:space-y-8 text-white">
						<div className="text-2xl md:text-3xl font-bold text-center md:text-left">
							Contact Us
						</div>
						<div className="flex flex-row items-center">
							<a href={'tel:' + SiteConfig.helpLineIlmx.phone}>
								<PhoneIcon className="w-10 h-10 p-2 rounded-full bg-white shadow-md mr-4 text-teal-brand" />
							</a>
							<div>{SiteConfig.helpLineIlmx.phoneInt}</div>
						</div>
						<div className="flex flex-row items-center justify-between">
							<div>
								<LocationMarkerIcon className="w-10 h-10 p-2 rounded-full bg-white shadow-md mr-4 text-teal-brand" />
							</div>
							<div>29-P Mustaq Ahmed Gurmani Road, Block P, Gulberg III, Lahore</div>
						</div>
						<div className="flex flex-row items-center">
							<div>
								<MailIcon className="w-10 h-10 p-2 rounded-full bg-white shadow-md mr-4 text-teal-brand" />
							</div>
							<div>mischool@cerp.org.pk</div>
						</div>
						<div className="space-y-2 hidden md:block">
							<div>Follow us on</div>
							<div className="flex flex-row space-x-2">
								<div className="rounded w-6 h-6 bg-white"></div>
								<div className="rounded w-6 h-6 bg-white"> </div>
								<div className="rounded w-6 h-6 bg-white" />
							</div>
						</div>
					</div>
					<div className="w-full md:w-3/5 bg-white rounded-2xl p-6 md:p-8">
						<form className="space-y-2 w-full" onSubmit={handleFormSubmit}>
							<div>
								<label htmlFor="name">Your Name</label>
								<input
									name="name"
									required
									onChange={handleInputChange}
									value={state.form.name}
									type="text"
									className="tw-input w-full"
									placeholder="Full name (3 characters long)"
								/>
							</div>
							<div>
								<label htmlFor="phone">Your Phone</label>
								<input
									name="phone"
									required
									onChange={handleInputChange}
									value={state.form.phone}
									type="text"
									className="tw-input w-full"
									placeholder="Mobile number e.g. 03xxxxxxxxx"
								/>
							</div>
							<div>
								<label htmlFor="message">Your Message</label>
								<textarea
									name="message"
									required
									onChange={handleInputChange}
									value={state.form.message}
									className="tw-input w-full"
									rows={8}
									placeholder="Type your message here (10 characters long)"
								/>
							</div>
							<div className="flex justify-end">
								<button
									type="submit"
									className={clsx(
										' inline-flex items-center tw-btn-blue w-full md:w-40',
										{
											'pointer-events-none': state.isSending
										}
									)}>
									{state.isSending ? (
										<>
											<Spinner />
											<span className="mx-auto animate-pulse">
												Sending...
											</span>
										</>
									) : (
										<span className="mx-auto">Send Message</span>
									)}
								</button>
							</div>
						</form>
					</div>
					<div className="space-y-2 block md:hidden">
						<div className="text-white">Follow us on</div>
						<div className="flex flex-row space-x-2">
							<div className="rounded w-6 h-6 bg-white"></div>
							<div className="rounded w-6 h-6 bg-white"> </div>
							<div className="rounded w-6 h-6 bg-white" />
						</div>
					</div>
				</div>
			</div>
		</AppLayout>
	)
}
