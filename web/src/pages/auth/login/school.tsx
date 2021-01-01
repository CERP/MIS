import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { AppLayout } from 'components/Layout/appLayout'
import { EyePassword } from 'components/Password'

type TState = {
	eye_open: boolean
	id: string
	password: string
}

const initialState: TState = {
	eye_open: false,
	id: '',
	password: ''
}

export const SchoolLogin = () => {

	const [state, setState] = useState(initialState)

	const { eye_open } = state

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

	}

	const hanldeInputChange = (event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>) => {
		const { name, value } = event.target
		setState({ ...state, [name]: value })
	}

	return (
		<AppLayout title={"School Login"}>
			<div className="p-5 pb-0 md:p-10 md:pb-0 text-gray-700">
				<div className="flex flex-col items-center space-y-2">
					<div className="text-2xl font-bold">Log in to MISchool</div>
					<div className="text-sm mt-5">
						<span className="text-gray-500">Don't have an account? </span>
						<Link to="/signup" className="text-blue-500 text-base">Sign up</Link>
					</div>
				</div>

				<div className="w-full mt-5 px-5 md:mt-10 md:px-16">
					<div className="bg-white shadow-md mx-auto border md:w-1/3 rounded-md py-6 px-6 md:px-8">
						<form onSubmit={handleSubmit} className="flex flex-col justify-items-start">
							<div className="my-2">Mobile Number (School Id)</div>
							<input
								name="id"
								required
								onChange={hanldeInputChange}
								autoCapitalize="off"
								autoCorrect="off"
								placeholder="Enter school id"
								className="input" />

							<div className="my-2">Password</div>
							<div className="relative">
								<input
									name="password"
									required
									onChange={hanldeInputChange}
									type={eye_open ? 'text' : 'password'}
									placeholder="Enter password"
									className="input w-full" />
								<div
									onClick={() => setState({ ...state, eye_open: !eye_open })}
									className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
									{
										<EyePassword open={eye_open} />
									}
								</div>
							</div>
							<div className="mt-8 text-center">
								<button className="w-full btn-blue px-5 md:px-8 py-3">Login into your school</button>
								<Link to="/school/reset-password" className="mt-2 text-sm text-gray-500 hover:text-blue-brand">Forgot your school passsword?</Link>
							</div>
						</form>

					</div>
				</div>
			</div>
		</AppLayout>
	)
}
