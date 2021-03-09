import React, { useEffect, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect, useDispatch } from 'react-redux'
import clsx from 'clsx'

import chunkify from 'utils/chunkify'
import { toTitleCase } from 'utils/toTitleCase'
import { createLogin } from 'actions'
import { Spinner } from 'components/animation/spinner'
import { AppLayout } from 'components/Layout/appLayout'
import { ShowHidePassword } from 'components/password'
import { ActionTypes, OnboardingStage } from 'constants/index'
import { useMediaPredicate } from "react-media-hook"

import UserIconSvg from 'assets/svgs/user.svg'

type LoginProps = RootReducerState & {
	users: RootDBState["users"]
	onboarding: RootDBState["onboarding"]
	school: {
		name: string
		logo: string
	}
	assets: RootDBState["assets"]
	unsyncd_changes: number
}

const Login: React.FC<LoginProps> = ({ auth, initialized, users, school, connected, unsyncd_changes, onboarding }) => {

	const dispatch = useDispatch()

	const [usersGroupIndex, setUsersGroupIndex] = useState(0)
	const [user, setUser] = useState<MISUser>()

	if (!initialized && auth.token) {
		return (
			<AppLayout title={"Staff Login"}>
				<div className="p-5 pb-0 md:p-10 md:pb-0 text-gray-700">
					<div className="text-center animate-pulse">Loading Database, Please wait...</div>
				</div>
			</AppLayout>
		)
	}

	// TODO: remove this logic
	// add more robust way of redirection

	if (!auth.token) {
		return <Redirect to="/school-login" />
	}

	// here handling two cases:
	// - user logged in and onboarding state is completed (new schools), redirect to home page
	// - user logged in and there's no onboarding state (old schools), redirect to home page
	if (auth?.faculty_id && auth?.token && (onboarding?.stage ? onboarding?.stage === OnboardingStage.COMPLETED : true)) {
		return <Redirect to="/home" />
	}

	// user logged in and there's onboarding state
	// onboarding component will handle further
	// desired state component renders
	if (auth?.faculty_id && auth?.token && onboarding?.stage) {
		return <Redirect to="/school/onboarding" />
	}

	// school logged in and there's no user, start the onboarding process
	// by creating a new user
	if (auth?.token && Object.keys(users || {}).length === 0) {
		return <Redirect to="/school/setup" />
	}

	const filteredUsers = Object.entries(users)
		.filter(([, f]) => f.hasLogin !== false)
		.sort(([, a], [, b]) => a.name.localeCompare(b.name))

	const switchSchoolHandler = () => {

		if (unsyncd_changes > 0) {
			const msg = `You have ${unsyncd_changes} pending changes. If you switch school without exporting data, data will be lost.
				Are you sure you want to continue?`

			if (!window.confirm()) {
				return
			}
		}

		localStorage.removeItem("ilmx")
		localStorage.removeItem("user")

		dispatch({
			type: ActionTypes.SWITCH_SCHOOL
		})
	}

	const USERS_PER_GROUP = useMediaPredicate("(min-width: 640px)") ? 10 : 6

	// renders number of button to view user group
	const userGroups = Math.ceil(filteredUsers.length / USERS_PER_GROUP)

	return (
		<AppLayout title={'Staff Login'}>
			<div className="p-5 pb-0 md:p-10 md:pb-0 text-gray-700">
				<div className="text-xl md:text-2xl text-center font-bold">MISchool Staff Login</div>
				<div className="w-full md:w-3/4 mx-auto flex flex-col md:flex-row items-center mt-10 md:t-20">
					<div className="relative border md:w-2/5 p-5 rounded-2xl rounded-bl-none md:rounded-bl-2xl md:rounded-tr-none rounded-br-none shadow-md w-4/5">
						<div className="flex flex-col items-center md:p-10 space-y-2">
							<img className="w-16 h-16 md:w-20 md:h-20 p-1 border border-gray-300 rounded-full" src={school.logo || 'favicon.ico'} alt="school-logo" />
							<div className="font-semibold text-center">{school.name}</div>
							<div className="font-medium"></div>
							<button
								disabled={!connected}
								onClick={() => switchSchoolHandler()}
								className={clsx("w-full md:w-7/12 tw-btn-red", {
									"bg-gray-500 pointer-events-none": !connected,
								})}>Switch School</button>
						</div>
						<div className=""></div>
					</div>
					<div className="bg-gray-700 border border-l-0 rounded-2xl shadow-md w-full md:w-2/3 ">
						<div className="p-5 md:p-10">
							{
								user ?
									<div className="relative">
										<div className="w-full md:w-3/5 mx-auto">
											<LoginForm user={user} auth={auth} />
										</div>
										<div className="absolute left-0 top-0">
											<div
												onClick={() => setUser(undefined)}
												className="w-10 h-8 flex items-center justify-center rounded-md shadow-md bg-white text-blue-brand cursor-pointer">
												<svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
												</svg>
											</div>
										</div>
									</div>
									:
									<>
										<div className="text-white text-center">Choose your Staff Login</div>
										<div className="md:mt-6">
											<div className="grid grid-cols-3 md:grid-cols-5 md:gap-0 md:h-60">
												{
													chunkify(filteredUsers || [], USERS_PER_GROUP)[usersGroupIndex]
														.map(([uid, user]: [string, MISUser]) => (
															<div key={uid} className="group flex flex-col items-center mb-4 space-y-2">
																<div className="w-20 h-20 cursor-pointer" onClick={() => setUser(user)}>
																	<img className="rounded-full border-2 border-transparent group-hover:border-green-brand focus:border-green-brand"
																		src={UserIconSvg}
																		alt="school-logo"
																	/>
																</div>
																<div className="text-xs text-white group-hover:text-blue-brand text-center">{toTitleCase(user.name)}</div>
															</div>
														))
												}
											</div>
										</div>
										{
											userGroups > 1 &&
											<div className="flex flex-row items-center justify-center space-x-4">
												{
													// generating buttons for each user group (panel)
													// value or index can be both used to highlight the current
													// group of users
													[...new Array(userGroups)]
														.map((v, index) => (
															<div key={index}
																onClick={() => setUsersGroupIndex(index)}
																className={clsx("w-8 h-8 md:h-10 md:w-10 rounded-full text-sm md:text-base md:font-semibold flex items-center justify-center cursor-pointer hover:bg-yellow-400 hover:text-white shadow-md",
																	{
																		"bg-yellow-400 text-white": index === usersGroupIndex,
																		"bg-white": index !== usersGroupIndex
																	}
																)}>
																{index + 1}
															</div>
														))
												}
											</div>
										}
									</>
							}
						</div>
					</div>
				</div>
			</div>
		</AppLayout>
	)
}

export const StaffLogin = connect((state: RootReducerState) => ({
	school: {
		name: state.db?.settings?.schoolName,
		logo: state.db?.assets?.schoolLogo
	},
	auth: state.auth,
	initialized: state.initialized,
	users: state.db?.users || {},
	onboarding: state.db?.onboarding,
	connected: state.connected,
	unsyncd_changes: Object.keys(state.queued.mutations || {}).length
}))(Login)

type LoginFormProps = {
	user?: MISUser
	auth: RootReducerState["auth"]
}

const LoginForm: React.FC<LoginFormProps> = ({ user, auth }) => {

	const dispatch = useDispatch()

	// TODO: create single state variable
	const [password, setPassword] = useState('')
	const [hasError, setHasError] = useState('')
	const [isSubmitted, setIsSubmitted] = useState(false)
	const [showHidePassword, setShowHidePassword] = useState(false)

	useEffect(() => {
		if (auth.attempt_failed && isSubmitted && !auth.loading) {

			// just to create a fake server delay
			setTimeout(() => {
				// TODO: add RHT
				setHasError('Password is incorrect!')
				setIsSubmitted(false)
			}, 1500)

			setTimeout(() => {
				setHasError('')
			}, 3000)
		}
	}, [auth, isSubmitted])

	const handleSubmit = (event: React.FormEvent) => {

		event.preventDefault()

		// TODO: show RHT
		if (!password) {
			return
		}

		setIsSubmitted(true)

		dispatch(createLogin(user.name, password))
	}

	return (
		<div className="flex flex-col items-center space-y-3">
			<div className="w-24 h-24">
				<img className="rounded-full" src={UserIconSvg} alt="school-logo" />
			</div>
			<div className="text-sm mt-2 text-white">{toTitleCase(user.name)}</div>
			<form id='staff-login' onSubmit={handleSubmit}>
				<div className="w-full relative my-4">
					<input
						name="password"
						required
						autoFocus={true}
						onChange={(event) => setPassword(event.target.value)}
						type={showHidePassword ? 'text' : 'password'}
						autoCapitalize="off"
						autoCorrect="off"
						autoComplete="off"
						placeholder="Enter password"
						className="tw-input w-full" />
					<div
						onClick={() => setShowHidePassword(!showHidePassword)}
						className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
						{
							<ShowHidePassword open={showHidePassword} />
						}
					</div>
				</div>
				<button
					disabled={isSubmitted}
					className={clsx("inline-flex w-full items-center tw-btn-blue py-3", {
						"pointer-events-none": isSubmitted
					})}>
					{
						isSubmitted ?
							<>
								<Spinner className={"animate-spin h-5 w-5"} />
								<span className={"mx-auto animate-pulse"}>Logging In</span>
							</>
							:
							<span className={"mx-auto"}>Login</span>
					}
				</button>
				<div className="h-1 py-1 text-xs text-red-brand">{hasError}</div>
			</form>
			<Link to="/reset-password" className="mt-2 text-sm text-gray-400 hover:text-blue-brand">Forgot your school passsword?</Link>
		</div>
	)
}