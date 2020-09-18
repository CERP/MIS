import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AppLayout } from 'components/layout'
import { RootReducerCombinedState } from 'reducers'

import { user_actions } from 'actions'

type P = {

}

type S = {
	username: string
	password: string
	remember: boolean
}

export const Login: React.FC<P> = ({ }) => {

	const [submitted, set_submitted] = useState(false)
	const [state, set_state] = useState<S>({
		username: '',
		password: '',
		remember: false
	})

	const dispatch = useDispatch()
	const location = useLocation()
	// @ts-ignore
	const loggingIn = useSelector((state: RootReducerCombinedState) => state.authentication.logginIn)

	console.log(loggingIn)

	const { username, password } = state

	const handle_change = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		set_state({ ...state, [name]: value })
	}

	const handle_login = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		set_submitted(true)

		if (username && password) {
			// @ts-ignore
			const { from } = location.state || { from: { pathname: "/login" } }
			dispatch(user_actions.login(username, password, from))
		}
	}

	return (
		<AppLayout>
			<form className="h-full rounded py-12 px-12 flex flex-col items-center justify-center" onSubmit={(e) => handle_login(e)}>
				<div className="mb-4 mt-8">
					<div className="mb-4">
						<label className="sr-only">Username</label>
						<input className="border-solid border border-gray-400 rounded px-2 py-3" type="text"
							name="username" placeholder="usernmae" onChange={(e) => handle_change(e)} required />
					</div>
					<div>
						<label className="sr-only">Password</label>
						<input className="border-solid border border-gray-400 rounded px-2 py-3" type="password"
							name="password" placeholder="Password" onChange={(e) => handle_change(e)} required />
					</div>
					<div className="my-4 flex items-center">
						<input className="h-4 w-4 mr-2" type="checkbox" onChange={(e) => handle_change(e)} />
						<label className="text-md text-gray-700">Remember me</label>
					</div>
					<button className="bg-gray-500 hover:bg-gray-600 rounded text-white font-bold w-full py-3">
						Login
					</button>
				</div>
			</form>
		</AppLayout>
	)
}