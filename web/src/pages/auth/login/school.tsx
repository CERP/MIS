import React, { useEffect, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'

import { AppLayout } from 'components/Layout/appLayout'
import { EyePassword } from 'components/Password'
import { useDispatch, useSelector } from 'react-redux'
import { DownloadIcon } from 'assets/icons'
import { createSchoolLogin } from 'actions'
import { Spinner } from 'components/Animation/spinner'

type TState = {
	school: string
	password: string
	openEye: boolean
}

const initialState: TState = {
	school: '',
	password: '',
	openEye: false,
}


export const SchoolLogin = () => {

	// local state
	const [state, setState] = useState(initialState)
	const [isSubmitted, setIsSubmitted] = useState(false)
	const [hasError, setHasError] = useState('')

	// handle store
	const dispatch = useDispatch()
	const { auth, connected, initialized } = useSelector((state: RootReducerState) => state)

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

		// i have to handle this later (remove local state variable if you have global state)
		setIsSubmitted(true)

		// dispatch the action
		dispatch(createSchoolLogin(state.school, state.password))
	}

	const hanldeInputChange = (event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>) => {
		const { name, value } = event.target
		setState({ ...state, [name]: value })
	}

	if (auth.faculty_id) {
		return <Redirect to="/home" />
	}

	if (auth.token) {
		return <Redirect to="/staff-login" />
	}

	if (!connected) {
		return (
			<AppLayout title={"School Login"}>
				<div className="p-5 pb-0 md:p-10 md:pb-0 text-gray-700">
					<div className="text-center animate-pulse">Connecting, Pleae wait...</div>
				</div>
			</AppLayout>
		)
	}

	if (!initialized) {
		return (
			<AppLayout title={"School Login"}>
				<div className="p-5 pb-0 md:p-10 md:pb-0 text-gray-700">
					<div className="flex flex-col items-center mt-20">
						<img className="animate-bounce w-8 md:w-12" src={DownloadIcon} alt="d-icon" />
						<div className="text-sm animate-pulse">Downloading Database, Please wait...</div>
					</div>
				</div>
			</AppLayout>
		)
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
								name="school"
								autoFocus={true}
								required
								onChange={hanldeInputChange}
								autoCapitalize="off"
								autoCorrect="off"
								autoComplete="off"
								placeholder="Enter school id"
								className="tw-input" />

							<div className="my-2">Password</div>
							<div className="relative">
								<input
									name="password"
									required
									onChange={hanldeInputChange}
									type={state.openEye ? 'text' : 'password'}
									autoCapitalize="off"
									autoCorrect="off"
									autoComplete="off"
									placeholder="Enter password"
									className="tw-input w-full" />
								<div
									onClick={() => setState({ ...state, openEye: !state.openEye })}
									className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
									{
										<EyePassword open={state.openEye} />
									}
								</div>
							</div>
							<div className="text-xs h-1 pt-2 text-red-brand">{hasError}</div>
							<div className="mt-6 text-center">
								<button className="inline-flex items-center w-full tw-btn-blue px-5 md:px-8 py-3 mb-2">
									{auth.loading ?
										<>
											<Spinner className={"animate-spin h-5 w-5"} />
											<span className={"mx-auto animate-pulse"}>Logging In</span>
										</>
										:
										<span className={"mx-auto"}>Login into your School</span>
									}
								</button>
								<Link to="/school/reset-password" className="text-sm text-gray-500 hover:text-blue-brand">Forgot your school passsword?</Link>
							</div>
						</form>

					</div>
				</div>
			</div>
		</AppLayout>
	)
}
