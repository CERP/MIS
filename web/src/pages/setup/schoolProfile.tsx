import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'


import toTitleCase from 'utils/toTitleCase'

import { createLogin } from 'actions'
import { Spinner } from 'components/Animation/spinner'
import { AppLayout } from 'components/Layout/appLayout'
import { EyePassword } from 'components/Password'

import UserIconSvg from 'assets/svgs/user.svg'
import clsx from 'clsx'


export const SchoolProfile = () => {

	const { settings, assets } = useSelector((state: RootDBState) => state)

	return (
		<AppLayout title={'Setup School'}>
			<div className="p-5 pb-0 md:p-10 md:pb-0 text-gray-700">
				<div className="text-xl md:text-2xl text-center font-bold">Build School Profile</div>
				<div className="md:w-3/4 mx-auto flex flex-col md:flex-row items-center mt-10 md:t-20">
					<div className="w-3/5 md:w-2/5 md:h-60 border border-r-0 rounded-xl sm:rounded-bl-none sm:rounded-br-none md:rounded-tr-none md:rounded-br-none shadow-md">
						<div className="flex flex-col items-center p-4 md:p-10 space-y-2">
							<div className="text-center">
								<div className={clsx("w-16 h-16 border border-gray-300 flex md:h-20 items-center justify-center p-1 rounded-full md:w-20", { "bg-blue-brand": !assets?.schoolLogo })}>
									{
										assets?.schoolLogo ?
											<img className="rounded-full" src={assets?.schoolLogo || '/favicon.ico'} alt="school-logo" />
											:
											<div className="text-white text-2xl">+</div>
									}
								</div>
								<div className="text-sm">Add Logo</div>
							</div>
							<div className="font-semibold text-lg text-center">Welcome to {toTitleCase(settings?.schoolName)}</div>
						</div>
					</div>
					<div className="w-4/5 md:w-2/3 h-60 md:h-96 border md:border-l-0 rounded-xl md:rounded-md bg-gray-700 shadow-md">
						<div className="p-4 md:p-10">
							<div className="text-white text-center text-sm md:text-base">Please Create your Admin profile</div>
							<div className="flex flex-col items-center justify-center p-6 md:p-16">
								<div className={"border border-gray-300 flex h-20 items-center justify-center p-1 rounded-full w-20 bg-blue-brand"}>
									<div className="text-white text-2xl">+</div>
								</div>
								<div className="text-sm text-white mt-4">Add Profile</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</AppLayout>
	)
}

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