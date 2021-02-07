import React, { useEffect, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect, useDispatch } from 'react-redux'
import clsx from 'clsx'

import chunkify from 'utils/chunkify'
import toTitleCase from 'utils/toTitleCase'
import { ActionTypes, OnboardingStage } from 'constants/index'
import { createLogin } from 'actions'
import { Spinner } from 'components/Animation/spinner'
import { AppLayout } from 'components/Layout/appLayout'
import { EyePassword } from 'components/Password'

import UserIconSvg from 'assets/svgs/user.svg'



type TProps = RootReducerState & {
	users: RootDBState["users"]
	onboarding: RootDBState["onboarding"]
	school: {
		name: string
		logo: string
	}
	assets: RootDBState["assets"]
	unsyncd_changes: number
}

const USER_GROUP_SIZE = 10

const Login: React.FC<TProps> = ({ auth, initialized, users, school, connected, unsyncd_changes, onboarding }) => {

	const dispatch = useDispatch()

	const [userGroupIndex, setUserGroupIndex] = useState(0)
	const [user, setUser] = useState<MISUser>()

	if (!initialized && auth.token) {
		return (
			<AppLayout title={"Staff Login"}>
				<div className="p-5 pb-0 md:p-10 md:pb-0 text-gray-700">
					<div className="text-center animate-pulse">Loading Database, Pleae wait...</div>
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
			const res = window.confirm(`You have ${unsyncd_changes} pending changes. If you switch schools without exporting data, data will be lost. Are you sure you want to continue?`)
			if (!res) {
				return
			}
		}

		localStorage.removeItem("ilmx")
		localStorage.removeItem("user")

		dispatch({
			type: ActionTypes.SWITCH_SCHOOL
		})
	}

	return (
		<AppLayout title={'Staff Login'}>
			<div className="p-5 pb-0 md:p-10 md:pb-0 text-gray-700">
				<div className="text-xl md:text-2xl text-center font-bold">Staff Login into MISchool</div>
				<div className="w-3/4 mx-auto flex md:flex-row items-center mt-10 md:t-20">
					<div className="w-2/5 h-60 border border-r-0 rounded-md rounded-tr-none rounded-br-none shadow-md">
						<div className="flex flex-col items-center md:p-10 space-y-2">
							<div className="w-20 h-20 p-1 border border-gray-300 rounded-full">
								<img className="rounded-full" src={school.logo || 'favicon.ico'} alt="school-logo" />
							</div>
							<div className="font-semibold text-lg text-center">{toTitleCase(school.name)}</div>
							<button
								disabled={!connected}
								onClick={() => switchSchoolHandler()}
								className={clsx("w-7/12 tw-btn-red", {
									"bg-gray-500 pointer-events-none": !connected,
								})}>Switch School</button>
						</div>
					</div>
					<div className="w-2/3 h-96 border border-l-0 rounded-md bg-gray-700 shadow-md">
						<div className="md:p-10">
							{
								user ?
									<div className="relative">
										<div className="w-3/5 mx-auto">
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
										<div className="text-white text-center">Please choose your Staff Login</div>
										<div className="md:mt-6">
											<div className="grid md:grid-cols-5 md:gap-0 md:h-60">
												{
													chunkify(filteredUsers, USER_GROUP_SIZE)[userGroupIndex].map(([uid, user]: [string, MISUser]) => (
														<div key={uid} className="group flex flex-col items-center mb-4 space-y-2">
															<div className="w-20 h-20 cursor-pointer" onClick={() => setUser(user)}>
																<img className="rounded-full border-2 border-transparent group-hover:border-red-brand focus:border-red-brand" src={UserIconSvg} alt="school-logo" />
															</div>
															<div className="text-xs text-white group-hover:text-blue-brand">{user.name}</div>
														</div>
													))
												}
											</div>
										</div>
										<div className="flex flex-row items-center justify-center mt-4 space-x-4">
											{
												[...new Array(Math.ceil(filteredUsers.length / USER_GROUP_SIZE))].map((v, index) => (
													<div key={index}
														onClick={() => setUserGroupIndex(index)}
														className={`h-5 w-5 rounded-full text-sm text-center cursor-pointer hover:bg-yellow-400 hover:text-white shadow-md ${index === userGroupIndex ? 'bg-yellow-400 text-white' : 'bg-white '}`}
													>{index + 1}</div>
												))
											}
										</div>
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

type TLoginForm = {
	user?: MISUser
	auth: RootReducerState["auth"]
}

const LoginForm: React.FC<TLoginForm> = ({ user, auth }) => {

	const dispatch = useDispatch()

	const [password, setPassword] = useState('')
	const [hasError, setHasError] = useState('')
	const [isSubmitted, setIsSubmitted] = useState(false)
	const [openEye, setOpenEye] = useState(false)

	useEffect(() => {
		if (auth.attempt_failed && isSubmitted && !auth.loading) {

			// just to create a fake server delay
			setTimeout(() => {
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
						type={openEye ? 'text' : 'password'}
						autoCapitalize="off"
						autoCorrect="off"
						autoComplete="off"
						placeholder="Enter password"
						className="tw-input w-full" />
					<div
						onClick={() => setOpenEye(!openEye)}
						className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
						{
							<EyePassword open={openEye} />
						}
					</div>
				</div>
				<button className={`inline-flex w-full items-center tw-btn-blue py-3 ${isSubmitted ? 'pointer-events-none' : ''}`} disabled={isSubmitted}>
					{isSubmitted ?
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