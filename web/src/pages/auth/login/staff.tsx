import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect, useDispatch, useSelector } from 'react-redux'

import chunkify from 'utils/chunkify'

import { createLogin } from 'actions'
import { Spinner } from 'components/Animation/spinner'
import { AppLayout } from 'components/Layout/appLayout'
import { EyePassword } from 'components/Password'

import UserIconSvg from 'assets/svgs/user.svg'
import toTitleCase from 'utils/toTitleCase'


type P = RootReducerState & {
	users: RootDBState["users"]
	unsyncd_changes: number
}

type TS = {
	currUserIndex: number
	currUser?: MISUser
}

const initialState: TS = {
	currUserIndex: 0,
}

const Login: React.FC<P> = ({ auth, initialized, users, connected, queued }) => {

	const [state, setState] = useState(initialState)

	const totalUsers = Object.keys(users || {}).length

	if (!initialized && auth.token) {
		return (
			<AppLayout title={"Staff Login"}>
				<div className="p-5 pb-0 md:p-10 md:pb-0 text-gray-700">
					<div className="text-center animate-pulse">Loading Database, Pleae wait...</div>
				</div>
			</AppLayout>
		)
	}

	if (!auth.token) {
		return <Redirect to="/school-login" />
	}

	if (auth.faculty_id) {

		return <Redirect to="/landing" />
	}

	if (totalUsers === 0) {
		return <Redirect to="/faculty/first" />
	}


	const filteredUsers = Object.entries(users || {})
		.filter(([, f]) => f.hasLogin !== false)
		.sort(([, a], [, b]) => a.name.localeCompare(b.name))

	return (
		<AppLayout title={'Staff Login'}>
			<div className="p-5 pb-0 md:p-10 md:pb-0 text-gray-700">
				<div className="text-xl md:text-2xl text-center font-bold">Staff Login to MISchool</div>
				<div className="w-3/4 mx-auto flex md:flex-row items-center mt-10 md:t-20">
					<div className="w-2/5 h-60 border border-r-0 rounded-md rounded-tr-none rounded-br-none shadow-md">
						<div className="flex flex-col items-center md:p-10 space-y-2">
							<div className="w-24 h-24">
								<img className="rounded-full" src="/favicon.ico" alt="school-logo" />
							</div>
							<div className="font-semibold text-xl">Welcome to School</div>
						</div>
					</div>
					<div className="w-2/3 h-96 border border-l-0 rounded-md bg-gray-700 shadow-md">
						<div className="md:p-10">
							{
								state.currUser ?
									<div className="relative">
										<div className="w-3/5 mx-auto">
											<LoginForm user={state.currUser} />
										</div>
										<div className="absolute left-0 top-0">
											<div
												onClick={() => setState({ ...state, currUser: undefined })}
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
													chunkify(filteredUsers, 10)[state.currUserIndex].map(([uid, user]: [string, MISUser], index: number) => (
														<div key={index} className="flex flex-col items-center mb-4 space-y-2">
															<div className="w-20 h-20 cursor-pointer" onClick={() => setState({ ...state, currUser: user })}>
																<img className="rounded-full" src={UserIconSvg} alt="school-logo" />
															</div>
															<div className="text-xs text-white">{user.name}</div>
														</div>
													))
												}
											</div>
										</div>
										<div className="flex flex-row items-center justify-center mt-4 space-x-4">
											{
												[...new Array(Math.ceil(filteredUsers.length / 10))].map((v, index) => (
													<div key={v + index}
														onClick={() => setState({ ...state, currUserIndex: index })}
														className={`h-5 w-5 rounded-full text-sm text-center cursor-pointer hover:bg-yellow-400 hover:text-white shadow-md ${index === state.currUserIndex ? 'bg-yellow-400 text-white' : 'bg-white '}`}
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
	auth: state.auth,
	initialized: state.initialized,
	users: state.db.users,
	connected: state.connected,
	unsyncd_changes: Object.keys(state.queued.mutations || {}).length
}))(Login)

type TLoginForm = {
	user?: MISUser
}

const LoginForm: React.FC<TLoginForm> = ({ user }) => {

	const [password, setPassword] = useState('')
	const [openEye, setOpenEye] = useState(false)

	const dispatch = useDispatch()

	const handleSubmit = (event: React.FormEvent) => {

		if (!password) {
			return
		}

		dispatch(createLogin('', password))
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
						onChange={(event) => setPassword(event.target.value)}
						type={openEye ? 'text' : 'password'}
						autoCapitalize="off"
						autoCorrect="off"
						autoComplete="off"
						placeholder="Enter password"
						className="input w-full" />
					<div
						onClick={() => setOpenEye(!openEye)}
						className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
						{
							<EyePassword open={openEye} />
						}
					</div>
				</div>
				<button className="inline-flex w-full items-center btn-blue py-3">
					{false ?
						<>
							<Spinner className={"animate-spin h-5 w-5"} />
							<span className={"mx-auto animate-pulse"}>Logging In</span>
						</>
						:
						<span className={"mx-auto"}>Login</span>
					}
				</button>
			</form>
			<Link to="/reset-password" className="mt-2 text-sm text-gray-400 hover:text-blue-brand">Forgot your school passsword?</Link>
		</div>
	)
}