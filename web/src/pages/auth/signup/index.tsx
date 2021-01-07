import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import cond from 'cond-construct'
import clsx from 'clsx'

import { AppLayout } from 'components/Layout/appLayout'
import { EyePassword } from 'components/Password'
import { Spinner } from 'components/Animation/spinner'
import { getDistricts } from 'constants/locations'
import toTitleCase from 'utils/toTitleCase'
import checkCompulsoryFields from 'utils/checkCompulsoryFields'
import { validateMobileNumber, validatePassword } from 'utils/helpers'
import { createSignUp } from 'actions'

import iconMarkDone from 'assets/svgs/mark_done.svg'


type TState = SchoolSignup & {
	confirm_password: string
}

const initialState: TState = {
	name: '',
	phone: '',
	school: '',
	city: '',
	password: '',
	package: 'FREE_TRIAL',
	confirm_password: '',
}

export const SchoolSignup = () => {

	const dispatch = useDispatch()

	const { connected, sign_up_form } = useSelector((state: RootReducerState) => state)

	const { loading, succeed, reason } = sign_up_form

	// form state
	const [state, setState] = useState(initialState)

	const [togglePassword, setTogglePassword] = useState(false)
	const [toggleConfirmPassword, setToggleConfirmedPassword] = useState(false)

	const [hasError, setHasError] = useState('')

	useEffect(() => {
		if ((!loading && !succeed) && reason !== "") {

			setHasError('Account creation failed!' + reason)

			setTimeout(() => {
				setHasError('')
			}, 5000)
		}
	}, [loading, succeed, reason])


	const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const compulsoryFields = checkCompulsoryFields(state, [
			["name"],
			["phone"],
			["school"],
			["city"],
			["password"],
			["confirm_password"]
		])


		cond([
			[
				!!compulsoryFields,
				() => window.alert('Please fill all required fields')
			],
			[
				!validatePassword(state.password),
				() => window.alert('Password contains at least 4 characters - alphabets(lower and upercase) and number')
			],
			[
				state.password !== state.confirm_password,
				() => window.alert('Password mismatch')
			],
			[
				!validateMobileNumber(state.phone), () => window.alert('Please enter correct mobile number')
			]
		])

		// get rid of consfirm_password

		const { confirm_password: _, ...signup } = state

		// dispatch the create Signup action using dispatch hook
		dispatch(createSignUp(signup))
	}

	const onInputChange = (event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>) => {
		const { name, value } = event.target
		setState({ ...state, [name]: value })
	}

	return (
		<AppLayout title={"School Signup"}>
			<div className="p-5 pb-0 md:p-10 md:pb-0 text-gray-700">

				{
					!loading && succeed && reason === '' ?

						<SignupSuccess {...state} />

						:
						<>
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
										onSubmit={onFormSubmit}
										className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 mx-auto">
										<div>
											<div>Name</div>
											<input
												name="name"
												required
												onChange={onInputChange}
												autoCapitalize="off"
												autoComplete="off"
												placeholder="e.g. Karim"
												className="w-full md:w-11/12 input" />
										</div>
										<div>
											<div>School Name</div>
											<input
												name="school"
												required
												onChange={onInputChange}
												autoCapitalize="off"
												autoComplete="off"
												placeholder="e.g. National School"
												className="w-full md:w-11/12 input" />
										</div>
										<div>
											<div>Mobile Number (School Id)</div>
											<input
												name="phone"
												type="number"
												onChange={onInputChange}
												autoCapitalize="off"
												autoCorrect="off"
												autoComplete="off"
												pattern=""
												placeholder="e.g. 0300xxxxxxx"
												className="w-full md:w-11/12 input" />
										</div>
										<div>
											<div>Password</div>
											<div className="relative">
												<input
													name="password"
													onChange={onInputChange}
													autoCapitalize="off"
													autoCorrect="off"
													autoComplete="off"
													required
													type={togglePassword ? 'text' : 'password'}
													placeholder="Enter password"
													className="w-full md:w-11/12 input" />
												<div
													onClick={() => setTogglePassword(!togglePassword)}
													className="absolute inset-y-0 right-0 md:right-8 pr-3 flex items-center cursor-pointer">
													{
														<EyePassword open={togglePassword} />
													}
												</div>
											</div>
										</div>
										<div>
											<div>City/District</div>
											<select
												name="city"
												required
												onChange={onInputChange}
												placeholder="Enter school id"
												className="w-full md:w-11/12 select">
												<option value="">Choose from list</option>
												{
													getDistricts().sort().map(d => (<option key={d} value={d}>{toTitleCase(d)}</option>))
												}
											</select>
										</div>
										<div>
											<div>Confirm Password</div>
											<div className="relative">
												<input
													name="confirm_password"
													onChange={onInputChange}
													autoCapitalize="off"
													autoCorrect="off"
													autoComplete="off"
													required
													type={toggleConfirmPassword ? 'text' : 'password'}
													placeholder="Enter confirm password"
													className="w-full md:w-11/12 input" />
												<div
													onClick={() => setToggleConfirmedPassword(!toggleConfirmPassword)}
													className="absolute inset-y-0 right-0 md:right-8 pr-3 flex items-center cursor-pointer">
													{
														<EyePassword open={toggleConfirmPassword} />
													}
												</div>
											</div>
										</div>
									</form>
									<div className="mt-8 mx-auto md:w-1/3">
										<button
											form="signup"
											type="submit"
											disabled={loading || !connected}
											className={clsx("inline-flex items-center w-full btn-blue px-3 py-3", { 'pointer-events-none': loading || !connected })}>
											{
												loading ?
													<>
														<Spinner className={"animate-spin h-5 w-5"} />
														<span className={"mx-auto animate-pulse"}>Creating, Please wait...</span>
													</>
													:
													<span className="mx-auto">Create your Account</span>
											}
										</button>
									</div>
									<div className="h-2 py-2 text-sm text-red-brand">{hasError}</div>
								</div>
							</div>
						</>
				}
			</div>
		</AppLayout>
	)
}



const SignupSuccess = (signup: TState) => {
	return (
		<div className="flex flex-col items-center space-y-6">
			<div className="text-2xl leading-5 font-bold text-teal-500">Congratulations</div>
			<div className="text-center">You have successfully signed up on MISchool</div>
			<div className="w-32 h-32 md:w-40 md:h-40">
				<img src={iconMarkDone} alt="mark-done" />
			</div>
			<div className="mx-auto md:w-1/2 text-center text-gray-500">
				<div>Please remember these credentials.</div>
				<div>You will use these to login</div>
			</div>
			<div className="font-bold">
				<div className="">School Id: {signup.phone}</div>
				<div className="">Password: {signup.password}</div>
			</div>
			<Link className="btn-blue px-12" to='/school-login'>Sign in Now</Link>
		</div>
	)
}