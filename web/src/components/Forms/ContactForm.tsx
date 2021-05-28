import clsx from 'clsx'
import { Spinner } from 'components/animation/spinner'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { isValidPhone } from 'utils/helpers'
import { hostHTTPS } from 'utils/hostConfig'

const initialState = {
	isSending: false,
	form: {
		name: '',
		phone: '',
		message: ''
	}
}

function ContactForm() {
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
					className={clsx(' inline-flex items-center tw-btn-blue w-full md:w-40', {
						'pointer-events-none': state.isSending
					})}>
					{state.isSending ? (
						<>
							<Spinner />
							<span className="mx-auto animate-pulse">Sending...</span>
						</>
					) : (
						<span className="mx-auto">Send Message</span>
					)}
				</button>
			</div>
		</form>
	)
}

export default ContactForm
