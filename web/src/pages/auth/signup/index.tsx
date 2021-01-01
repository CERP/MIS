import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { AppLayout } from 'components/Layout/appLayout'
import { EyePassword } from 'components/Password'

type TState = {
	name: string
	phone: string
	school_name: string
	district: string
	password: string
	confirmed_password: string
	show_pass: boolean
	show_cpass: boolean
}

const initialState: TState = {
	name: '',
	phone: '',
	school_name: '',
	district: '',
	password: '',
	confirmed_password: '',
	show_pass: false,
	show_cpass: false
}

export const SchoolSignup = () => {

	const [state, setState] = useState(initialState)

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
	}

	const hanldeInputChange = (event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>) => {
		const { name, value } = event.target
		setState({ ...state, [name]: value })
	}

	return (
		<AppLayout title={"School Signup"}>
			<div className="md:min-h-screen p-5 pb-0 md:p-10 md:pb-0 text-gray-700">
				<div className="flex flex-col items-center space-y-2">
					<div className="text-2xl font-bold">Sign up to MISchool</div>
					<div className="text-sm mt-5">
						<span className="text-gray-500">Have an account? </span>
						<Link to="school-login" className="text-blue-500 text-base">Sign in</Link>
					</div>
				</div>

				<div className="w-full mt-5 md:mt-10 pb-10 md:px-16">
					<div className="mx-auto md:w-9/12">
						<form id="signup"
							onSubmit={handleSubmit}
							className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 mx-auto">
							<div>
								<div>Name</div>
								<input
									name="name"
									required
									onChange={hanldeInputChange}
									autoCapitalize="off"
									autoCorrect="off"
									placeholder="e.g. Karim"
									className="w-full input" />
							</div>
							<div>
								<div>School Name</div>
								<input
									name="school_name"
									required
									onChange={hanldeInputChange}
									autoCapitalize="off"
									autoCorrect="off"
									placeholder="e.g. National School"
									className="w-full input" />
							</div>
							<div>
								<div>Mobile Number (School Id)</div>
								<input
									name="phone"
									onChange={hanldeInputChange}
									autoCapitalize="off"
									autoCorrect="off"
									placeholder="e.g. 0300xxxxxxx"
									className="w-full input" />
							</div>
							<div>
								<div>City/District</div>
								<select
									name="district"
									required
									onChange={hanldeInputChange}
									placeholder="Enter school id"
									className="w-full select" />
							</div>
							<div>
								<div>Password</div>
								<div className="relative">
									<input
										name="password"
										onChange={hanldeInputChange}
										autoCapitalize="off"
										autoCorrect="off"
										type={state.show_pass ? 'text' : 'password'}
										placeholder="Enter password"
										className="w-full input" />
									<div
										onClick={() => setState({ ...state, show_pass: !state.show_pass })}
										className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
										{
											<EyePassword open={state.show_pass} />
										}
									</div>
								</div>
							</div>
							<div>
								<div>Confirm Password</div>
								<div className="relative">
									<input
										name="confirm_password"
										onChange={hanldeInputChange}
										autoCapitalize="off"
										autoCorrect="off"
										type={state.show_cpass ? 'text' : 'password'}
										placeholder="Enter confirm password"
										className="w-full input" />
									<div
										onClick={() => setState({ ...state, show_cpass: !state.show_pass })}
										className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
										{
											<EyePassword open={state.show_cpass} />
										}
									</div>
								</div>
							</div>
						</form>
						<div className="mt-8 mx-auto md:w-1/2">
							<button form="signup" type="submit" className="w-full btn-blue px-5 md:px-8 py-3">Create your Account</button>
						</div>
					</div>
				</div>
			</div>
		</AppLayout>
	)
}
