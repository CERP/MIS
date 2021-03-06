import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { connect, useDispatch } from 'react-redux'
import { useMediaPredicate } from 'react-media-hook'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/outline'

import chunkify from 'utils/chunkify'
import { toTitleCase } from 'utils/toTitleCase'
import { createLogin } from 'actions'
import { Spinner } from 'components/animation/spinner'
import { AppLayout } from 'components/Layout/appLayout'
import { ShowHidePassword } from 'components/password'
import { ActionTypes } from 'constants/index'

import UserIconSvg from 'assets/svgs/user.svg'
import { TModal } from 'components/Modal'
import { useComponentVisible } from 'hooks/useComponentVisible'

type LoginProps = RootReducerState & {
	users: RootDBState['users']
	onboarding: RootDBState['onboarding']
	school: {
		name: string
		logo: string
	}
	assets: RootDBState['assets']
	unsyncd_changes: number
	faculty: RootDBState['faculty']
}

type AugmentedMISUser = MISUser & {
	id: string
}

const Login: React.FC<LoginProps> = ({
	auth,
	users,
	school,
	connected,
	unsyncd_changes,
	faculty
}) => {
	const dispatch = useDispatch()

	const [usersGroupIndex, setUsersGroupIndex] = useState(0)
	const [user, setUser] = useState<AugmentedMISUser>()

	const filteredUsers = Object.entries(users)
		.filter(
			([uid, f]) => f && f.name && faculty[uid] && faculty[uid].Active && f.hasLogin !== false
		)
		.sort(([, a], [, b]) => a.name.localeCompare(b.name))

	// For desktop screen, there would be 10 users per group
	// and but for mobile, would be 6 users per group
	const USERS_PER_GROUP = useMediaPredicate('(min-width: 640px)') ? 10 : 6

	// renders number of buttons to view user group
	const userGroups = Math.ceil(filteredUsers.length / USERS_PER_GROUP)

	const {
		ref: confirmSwitchSchoolModalRef,
		isComponentVisible: showConfirmSchoolModal,
		setIsComponentVisible: setShowConfirmSchoolModal
	} = useComponentVisible(false)

	const switchSchoolHandler = () => {
		// TODO: convert it to react-alert modal
		if (unsyncd_changes > 0) {
			const msg = `You have ${unsyncd_changes} pending changes. If you switch school without exporting data, data will be lost.
				Are you sure you want to continue?`

			if (!window.confirm(msg)) {
				return
			}
		}

		localStorage.removeItem('ilmx')
		localStorage.removeItem('user')

		dispatch({
			type: ActionTypes.SWITCH_SCHOOL
		})
	}

	return (
		<AppLayout title={'Staff Login'}>
			<div className="p-5 pb-0 md:p-10 md:pb-0 text-gray-700">
				<div className="text-xl md:text-2xl text-center font-bold">
					MISchool Staff Login
				</div>
				{showConfirmSchoolModal && (
					<TModal>
						<div
							className="bg-white md:p-10 p-8 space-y-2 text-center space-y-10"
							ref={confirmSwitchSchoolModalRef}>
							<h1 className="lg:text-xl">Are you sure you want to switch school?</h1>
							<div className="font-semibold text-lg md:text-xl"></div>
							<div className="flex flex-row justify-between space-x-4">
								<button
									onClick={() => setShowConfirmSchoolModal(false)}
									className="w-full py-1 md:py-2 tw-btn bg-gray-400 text-white">
									Cancel
								</button>
								<button
									onClick={switchSchoolHandler}
									className="w-full py-1 md:py-2 tw-btn-red">
									Confirm
								</button>
							</div>
						</div>
					</TModal>
				)}
				<div className="w-full md:w-3/4 mx-auto flex flex-col md:flex-row items-center mt-10 md:t-20">
					<div className="relative border md:w-2/5 p-5 rounded-2xl rounded-bl-none md:rounded-bl-2xl md:rounded-tr-none rounded-br-none shadow-md w-4/5">
						<div className="flex flex-col items-center md:p-10 space-y-2">
							<img
								className="w-16 h-16 md:w-20 object-cover md:h-20 p-1 border border-gray-300 rounded-full"
								src={school.logo || '/favicon.ico'}
								alt="school-logo"
							/>
							<div className="font-semibold text-center">{school.name}</div>
							<div className="font-medium"></div>
							<button
								disabled={!connected}
								onClick={() => setShowConfirmSchoolModal(true)}
								className={clsx(
									'inline-flex items-center text-center w-full tw-btn-red',
									{
										'bg-gray-500 pointer-events-none': !connected
									}
								)}>
								<ArrowLeftIcon className="w-5" />
								<span className="mx-auto">Switch School</span>
							</button>
						</div>
						<div className=""></div>
					</div>
					<div className="bg-gray-700 border border-l-0 rounded-2xl shadow-md w-full md:w-2/3 ">
						<div className="p-5 md:p-10 md:pt-5">
							{user ? (
								<div className="relative">
									<div className="w-full md:w-3/5 mx-auto">
										<LoginForm {...{ user, auth, faculty }} />
									</div>
									<div className="absolute left-0 top-0">
										<ArrowLeftIcon
											onClick={() => setUser(undefined)}
											className="w-10 h-8 p-2 flex items-center justify-center rounded-md shadow-md bg-white text-blue-brand cursor-pointer"
										/>
									</div>
								</div>
							) : (
								<>
									<div className="text-white text-center">
										Choose your Staff Login
									</div>
									<div className="md:mt-6">
										<div className="grid grid-cols-3 md:grid-cols-5 md:gap-0 md:h-60">
											{chunkify(filteredUsers || [], USERS_PER_GROUP)[
												usersGroupIndex
											].map(([uid, user]: [string, MISUser]) => {
												const staffMember = faculty[uid]
												return (
													<div
														key={uid}
														className="group flex flex-col items-center mb-2 space-y-1">
														<div
															className="relative w-20 h-20 cursor-pointer"
															onClick={() =>
																setUser({ id: uid, ...user })
															}>
															<img
																className="rounded-full w-20 h-20"
																src={
																	staffMember?.ProfilePicture
																		?.url ||
																	staffMember?.ProfilePicture
																		?.image_string ||
																	UserIconSvg
																}
																alt={staffMember?.Name}
															/>
															{staffMember.Admin && (
																<div
																	className={clsx(
																		'absolute h-3 w-3 rounded-full bg-green-brand',
																		!(
																			staffMember
																				?.ProfilePicture
																				?.url ||
																			staffMember
																				?.ProfilePicture
																				?.image_string
																		)
																			? 'bottom-2.5 right-3.5'
																			: 'bottom-1.5 right-2'
																	)}
																	title="Admin"
																/>
															)}
														</div>
														<div className="text-xs text-white group-hover:text-blue-brand text-center">
															{toTitleCase(user.name)}
														</div>
													</div>
												)
											})}
										</div>
									</div>
									{userGroups > 1 && (
										<div className="flex flex-row flex-wrap items-center justify-center space-x-4">
											{
												// generating buttons for each user group (panel)
												// value or index can be both used to highlight the current
												// group of users
												[...new Array(userGroups)].map((v, index) => (
													<div
														key={index}
														onClick={() => setUsersGroupIndex(index)}
														className={clsx(
															'w-8 h-8 md:h-10 md:w-10 mt-2 rounded-full text-sm md:text-base md:font-semibold flex items-center justify-center cursor-pointer hover:bg-yellow-400 hover:text-white shadow-md',
															{
																'bg-yellow-400 text-white':
																	index === usersGroupIndex,
																'bg-white':
																	index !== usersGroupIndex
															}
														)}>
														{index + 1}
													</div>
												))
											}
										</div>
									)}
								</>
							)}
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
	users: state.db?.users ?? {},
	onboarding: state.db?.onboarding,
	connected: state.connected,
	unsyncd_changes: Object.keys(state.queued.mutations ?? {}).length,
	faculty: state.db.faculty
}))(Login)

type LoginFormProps = {
	user?: AugmentedMISUser
	faculty: RootDBState['faculty']
	auth: RootReducerState['auth']
}

const LoginForm: React.FC<LoginFormProps> = ({ user, auth, faculty }) => {
	const dispatch = useDispatch()

	// TODO: create single state variable
	const [password, setPassword] = useState('')
	const [hasError, setHasError] = useState('')
	const [isSubmitted, setIsSubmitted] = useState(false)
	const [showHidePassword, setShowHidePassword] = useState(false)

	// TODO: handle twice rendering ecause of auth.attempt_failed
	//  and auth.loading in a robust way
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
			toast.error('Please enter your password')
			return
		}

		setIsSubmitted(true)

		dispatch(createLogin(user.name, password))
	}

	const staffMember = faculty[user.id]

	return (
		<div className="flex flex-col items-center space-y-2">
			<div className="relative">
				<img
					className="rounded-full w-24 h-24"
					src={
						staffMember?.ProfilePicture?.url ||
						staffMember?.ProfilePicture?.image_string ||
						UserIconSvg
					}
					alt={staffMember?.Name}
				/>
				{staffMember.Admin && (
					<div
						className={clsx(
							'absolute h-4 w-4 rounded-full bg-green-brand',
							!(
								staffMember?.ProfilePicture?.url ||
								staffMember?.ProfilePicture?.image_string
							)
								? 'bottom-2.5 right-3.5'
								: 'bottom-1.5 right-2'
						)}
						title="Admin"
					/>
				)}
			</div>
			<div className="text-sm text-white">{toTitleCase(user.name)}</div>
			<form id="staff-login" onSubmit={handleSubmit}>
				<div className="w-full relative my-4">
					<input
						name="password"
						required
						autoFocus={true}
						onChange={event => setPassword(event.target.value)}
						type={showHidePassword ? 'text' : 'password'}
						autoCapitalize="off"
						autoCorrect="off"
						autoComplete="off"
						placeholder="Enter password"
						className="tw-input w-full tw-is-form-bg-black"
					/>
					<div
						onClick={() => setShowHidePassword(!showHidePassword)}
						className="absolute inset-y-0 right-0 pr-2 flex items-center cursor-pointer text-white">
						{<ShowHidePassword open={showHidePassword} />}
					</div>
				</div>
				<button
					disabled={isSubmitted}
					className={clsx('inline-flex w-full items-center tw-btn-blue py-3', {
						'pointer-events-none': isSubmitted
					})}>
					{isSubmitted ? (
						<>
							<Spinner className={'animate-spin h-5 w-5'} />
							<span className={'mx-auto animate-pulse'}>Logging In</span>
						</>
					) : (
						<>
							<span className={'mx-auto'}>Login as {user.name.split(' ')[0]}</span>
							<ArrowRightIcon className="w-6" />
						</>
					)}
				</button>
				<div className="h-1 py-1 text-xs text-red-brand">{hasError}</div>
			</form>
			{user.type === 'admin' && (
				<Link
					to="/admin/reset-password"
					className="mt-2 text-sm text-gray-400 hover:text-blue-brand">
					Forgot your passsword?
				</Link>
			)}
		</div>
	)
}
