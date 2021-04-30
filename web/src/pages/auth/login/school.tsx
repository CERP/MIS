import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowRightIcon } from '@heroicons/react/outline'

import { createSchoolLogin } from 'actions'
import { AppLayout } from 'components/Layout/appLayout'
import { ShowHidePassword } from 'components/password'
import { Spinner } from 'components/animation/spinner'

type State = {
	school: string
	password: string
	showHidePassword: boolean
}

const initialState: State = {
	school: '',
	password: '',
	showHidePassword: false
}

export const SchoolLogin = () => {
	const dispatch = useDispatch()

	const [state, setState] = useState(initialState)
	const [isSubmitted, setIsSubmitted] = useState(false)
	const [hasError, setHasError] = useState('')

	const { auth } = useSelector((state: RootReducerState) => state)

	useEffect(() => {
		if (auth.attempt_failed && isSubmitted && !auth.loading) {
			setHasError('School Id or Password is incorrect!')

			setIsSubmitted(false)

			setTimeout(() => {
				setHasError('')
			}, 3000)
		}
	}, [auth, isSubmitted])

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		// TODO: Have to handle this later (remove local state variable if you have global state)
		setIsSubmitted(true)

		// dispatch the action
		dispatch(createSchoolLogin(state.school, state.password))
	}

	// TODO: make a generic input handler
	const hanldeInputChange = (event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>) => {
		const { name, value } = event.target
		setState({ ...state, [name]: value })
	}

	return (
		<AppLayout title={'School Login'}>
			<div className="p-5 pb-0 md:p-10 md:pb-0 text-gray-700">
				<div className="flex flex-col items-center space-y-2">
					<div className="text-2xl font-bold 2xl:text-3xl">Login to MISchool</div>
					<div className="text-sm mt-4 md:text-lg">
						<span className="text-gray-500">Don't have an account? </span>
						<Link to="/signup" className="text-blue-500 text-base">
							Sign up
						</Link>
					</div>
				</div>

				<div className="w-full mt-5 px-5 md:mt-10 md:px-16">
					<div className="bg-white shadow mx-auto border border-gray-150 md:w-1/3 rounded-xl py-6 px-6 md:px-8">
						<form onSubmit={handleSubmit} className="flex flex-col justify-items-start">
							<div className="my-2">Mobile Number (School Id)</div>
							<input
								name="school"
								autoFocus={true}
								required
								onChange={hanldeInputChange}
								autoCapitalize="off"
								autoCorrect="off"
								autoComplete="off"
								placeholder="Enter school id"
								className="tw-input"
							/>

							<div className="my-2">Password</div>
							<div className="relative">
								<input
									name="password"
									required
									onChange={hanldeInputChange}
									type={state.showHidePassword ? 'text' : 'password'}
									autoCapitalize="off"
									autoCorrect="off"
									autoComplete="off"
									placeholder="Enter password"
									className="tw-input w-full"
								/>
								<div
									onClick={() =>
										setState({
											...state,
											showHidePassword: !state.showHidePassword
										})
									}
									className="absolute cursor-pointer flex inset-y-0 items-center m-2  px-3 py-2 right-0">
									{<ShowHidePassword open={state.showHidePassword} />}
								</div>
							</div>
							<div className="text-xs h-1 pt-2 text-red-brand">{hasError}</div>
							<div className="mt-6 text-center">
								<button className="inline-flex items-center w-full tw-btn-blue px-5 md:px-8 py-3 mb-2">
									{auth.loading ? (
										<>
											<Spinner className={'animate-spin h-5 w-5'} />
											<span className={'mx-auto animate-pulse'}>
												Logging In
											</span>
										</>
									) : (
										<>
											<span className={'mx-auto'}>Login into School</span>
											<ArrowRightIcon className="w-6" />
										</>
									)}
								</button>
								<Link
									to="/school/reset-password"
									className="text-sm text-gray-500 hover:text-blue-brand">
									Forgot your school password?
								</Link>
							</div>
						</form>
					</div>
				</div>
			</div>
		</AppLayout>
	)
}
