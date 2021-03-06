import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { AppLayout } from 'components/Layout/appLayout'
import { ShowHidePassword } from 'components/password'
import { Spinner } from 'components/animation/spinner'
import { getDistricts } from 'constants/locations'
import { isValidPhone, isValidPassword } from 'utils/helpers'
import { createSignUp } from 'actions'
import toTitleCase from 'utils/toTitleCase'
import checkCompulsoryFields from 'utils/checkCompulsoryFields'
import iconMarkDone from 'assets/svgs/mark-done.svg'
import { PhoneInput } from 'components/input/PhoneInput'

type State = SchoolSignup & {
	confirmPassword: string
}

const initialState: State = {
	name: '',
	phone: '',
	schoolName: '',
	city: '',
	schoolPassword: '',
	packageName: 'FREE_TRIAL',
	confirmPassword: ''
}

export const SchoolSignup = () => {
	const dispatch = useDispatch()
	const location = useLocation()
	const searchParams = new URLSearchParams(location.search)

	const {
		connected,
		sign_up_form: { loading, succeed, reason }
	} = useSelector((state: RootReducerState) => state)

	const [state, setState] = useState({
		...initialState,
		packageName:
			(searchParams.get('package') as SchoolSignup['packageName']) || initialState.packageName
	})

	// move this into one state variable
	const [togglePassword, setTogglePassword] = useState(false)
	const [toggleConfirmPassword, setToggleConfirmedPassword] = useState(false)

	useEffect(() => {
		// make sure here to check reason not equal to empty string instead of "&& reason" just
		if (loading === false && succeed === false && reason !== '') {
			const errorMsg =
				'Account creation failed!' +
				(reason?.includes(state.phone) ? `${state.phone} already exists` : reason)

			setTimeout(() => {
				toast.error(errorMsg)
			}, 1000)
		}
	}, [loading, succeed, reason])

	const createSchoolAccount = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const compulsoryFields = checkCompulsoryFields(state, [
			['name'],
			['phone'],
			['school'],
			['city'],
			['password'],
			['confirmPassword']
		])

		// TODO: Change all these window.alerts to RHT
		// TODO: try using cond() from cond-construct instead fo IFs

		if (compulsoryFields) {
			return toast.error('Please fill all required fields')
		}

		if (!isValidPassword(state.schoolPassword)) {
			return toast.error(
				'Password contains at least 4 characters - alphabets(lower and upercase) and number'
			)
		}

		if (state.schoolPassword !== state.confirmPassword) {
			return toast.error('Password mismatch')
		}

		if (!isValidPhone(state.phone)) {
			return toast.error('Please enter correct mobile number')
		}

		// get rid of consfirm_password
		const { confirmPassword: _, ...signup } = state

		// dispatch the create Signup action using dispatch hook
		dispatch(createSignUp(signup))
	}

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>) => {
		const { name, value } = event.target
		setState({ ...state, [name]: value })
	}

	return (
		<AppLayout title={'School Signup'}>
			<div className="p-6 pb-0 md:p-10 md:pb-0">
				{
					// explictly check reason is empty string instead of undefined
					!loading && succeed && reason === '' ? (
						<SignupSuccess {...state} />
					) : (
						<>
							<div className="flex flex-col items-center space-y-2">
								<div className="text-2xl md:text-2xl 2xl:text-3xl font-bold">
									Sign up to MISchool
								</div>
								<div className="text-sm mt-4 md:text-lg">
									<span className="text-gray-500">Have an account? </span>
									<Link to="school-login" className="text-blue-500">
										Login
									</Link>
								</div>
							</div>

							<div className="w-full mt-5 md:mt-10 pb-10 md:px-16">
								<div className="mx-auto md:w-9/12">
									<form
										id="signup"
										onSubmit={createSchoolAccount}
										className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 mx-auto">
										<div className="space-y-2">
											<label htmlFor="name">Name</label>
											<input
												name="name"
												required
												type="text"
												onChange={handleInputChange}
												autoCapitalize="off"
												autoComplete="off"
												placeholder="Type your name"
												className="w-full tw-input"
											/>
										</div>
										<div className="space-y-2">
											<label htmlFor="schoolName">School Name</label>
											<input
												name="schoolName"
												required
												type="text"
												onChange={handleInputChange}
												autoCapitalize="off"
												autoComplete="off"
												placeholder="Type your school name"
												className="w-full tw-input"
											/>
										</div>
										<div className="space-y-2">
											<label htmlFor="phone">Mobile Number (School Id)</label>
											<PhoneInput
												name="phone"
												onChange={handleInputChange}
												autoCapitalize="off"
												autoCorrect="off"
												className="w-full tw-input"
											/>
										</div>
										<div className="space-y-2">
											<label htmlFor="city">City/District</label>
											<datalist id="city">
												{getDistricts()
													.sort()
													.map(d => (
														<option key={d} value={d}>
															{toTitleCase(d)}
														</option>
													))}
											</datalist>
											<input
												list="city"
												name="city"
												required
												onChange={handleInputChange}
												className="tw-input w-full"
												placeholder="Select or type class name"
											/>
										</div>
										<div className="space-y-2">
											<label htmlFor="schoolPassword">Password</label>
											<div className="relative">
												<input
													name="schoolPassword"
													onChange={handleInputChange}
													autoCapitalize="off"
													autoCorrect="off"
													autoComplete="off"
													required
													type={togglePassword ? 'text' : 'password'}
													placeholder="alphanumeric &amp; min 4 characters"
													className="w-full tw-input"
												/>
												<div
													onClick={() =>
														setTogglePassword(!togglePassword)
													}
													className="absolute inset-y-0 right-2 pr-3 flex items-center cursor-pointer">
													{<ShowHidePassword open={togglePassword} />}
												</div>
											</div>
										</div>
										<div className="space-y-2">
											<label htmlFor="comfirmPassword">
												Confirm Password
											</label>
											<div className="relative">
												<input
													name="confirmPassword"
													onChange={handleInputChange}
													autoCapitalize="off"
													autoCorrect="off"
													autoComplete="off"
													required
													type={
														toggleConfirmPassword ? 'text' : 'password'
													}
													placeholder="Confirm your password"
													className="w-full tw-input"
												/>
												<div
													onClick={() =>
														setToggleConfirmedPassword(
															!toggleConfirmPassword
														)
													}
													className="absolute inset-y-0 right-2 pr-3 flex items-center cursor-pointer">
													{
														<ShowHidePassword
															open={toggleConfirmPassword}
														/>
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
											className={clsx(
												'inline-flex items-center w-full tw-btn-blue px-3 py-3',
												{
													'pointer-events-none': loading || !connected
												}
											)}>
											{loading ? (
												<>
													<Spinner className={'animate-spin h-5 w-5'} />
													<span className={'mx-auto animate-pulse'}>
														Creating, Please wait...
													</span>
												</>
											) : (
												<span className="mx-auto">Create your Account</span>
											)}
										</button>
									</div>
								</div>
							</div>
						</>
					)
				}
			</div>
		</AppLayout>
	)
}

const SignupSuccess = (signup: State) => {
	return (
		<div className="flex flex-col items-center space-y-6">
			<div className="text-2xl leading-5 font-bold text-teal-brand">Congratulations</div>
			<div className="text-center">You have successfully signed up on MISchool</div>
			<div className="w-32 h-32 md:w-40 md:h-40">
				<img src={iconMarkDone} alt="mark-done" />
			</div>
			<div className="mx-auto md:w-1/2 text-center text-gray-500">
				<div>Please remember these credentials.</div>
				<div>You will use these to login into MISchool</div>
			</div>
			<div className="font-bold">
				<div className="">School Id: {signup.phone}</div>
				<div className="">Password: {signup.schoolPassword}</div>
			</div>
			<Link className="tw-btn-blue px-12" to="/school-login">
				Sign In Now
			</Link>
		</div>
	)
}
